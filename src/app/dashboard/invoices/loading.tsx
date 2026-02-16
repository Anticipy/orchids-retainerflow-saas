import { Card, CardContent } from "@/components/ui/card"

export default function InvoicesLoading() {
  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-center">
        <div className="h-8 w-28 animate-pulse rounded bg-muted" />
        <div className="h-9 w-36 animate-pulse rounded bg-muted" />
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="h-24 animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    </div>
  )
}
