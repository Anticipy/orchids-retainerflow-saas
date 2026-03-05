import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { marked, Renderer } from "marked"

// Slugify heading text for IDs
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

const renderer = new Renderer()

// Headings with IDs for TOC
renderer.heading = function ({ text, depth }: any) {
  const id = slugify(text)
  const sizes: Record<number, string> = { 1: "h1", 2: "h2", 3: "h3", 4: "h4" }
  const tag = sizes[depth] || "h2"
  return `<${tag} id="${id}">${text}</${tag}>\n`
}

// Tables with warning cell support
renderer.table = function ({ header, rows }: any) {
  const headerHtml = header
    .map((cell: any) => `<th>${typeof cell === "string" ? cell : cell.text || ""}</th>`)
    .join("")
  const rowsHtml = rows
    .map((row: any[]) => {
      const cells = row
        .map((cell: any) => {
          const text = typeof cell === "string" ? cell : cell.text || ""
          const isWarning = text.includes("-1") || text.includes("overage")
          const cleanText = text.replace(" ← overage", "").replace("← overage", "")
          const cls = isWarning ? ' class="cell-warning"' : ""
          return `<td${cls}>${cleanText}</td>`
        })
        .join("")
      return `<tr>${cells}</tr>`
    })
    .join("")
  return `<div class="table-wrap"><table><thead><tr>${headerHtml}</tr></thead><tbody>${rowsHtml}</tbody></table></div>`
}

// Pull quotes
renderer.blockquote = function ({ text }: any) {
  const parsed = marked.parseInline(text)
  return `<blockquote class="pull-quote">${parsed}</blockquote>`
}

marked.use({ renderer, gfm: true, breaks: false })

const postsDirectory = path.join(process.cwd(), "src/content/blog")

export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  hook?: string
  readTime: string
  contentHtml: string
}

export interface PostMeta {
  slug: string
  title: string
  date: string
  excerpt: string
  readTime: string
}

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${minutes} min read`
}

export async function getAllPosts(): Promise<PostMeta[]> {
  if (!fs.existsSync(postsDirectory)) return []

  const fileNames = fs.readdirSync(postsDirectory)
  const posts = fileNames
    .filter((name) => name.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "")
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, "utf8")
      const { data, content } = matter(fileContents)

      return {
        slug,
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        readTime: calculateReadTime(content),
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return posts
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const fullPath = path.join(postsDirectory, `${slug}.md`)
  if (!fs.existsSync(fullPath)) return null

  const fileContents = fs.readFileSync(fullPath, "utf8")
  const { data, content } = matter(fileContents)
  const contentHtml = await marked(content)

  return {
    slug,
    title: data.title,
    date: data.date,
    excerpt: data.excerpt,
    hook: data.hook ? marked.parseInline(data.hook) as string : undefined,
    readTime: calculateReadTime(content),
    contentHtml,
  }
}