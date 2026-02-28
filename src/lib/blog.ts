import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { marked } from "marked"

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
    .sort((a, b) => (a.date < b.date ? 1 : -1))

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
    hook: data.hook || null,
    readTime: calculateReadTime(content),
    contentHtml,
  }
}