import { Card, CardContent } from "@/components/ui/card"

export default function ClientsLoading() {
  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-center">
        <div className="h-8 w-32 animate-pulse rounded bg-muted" />
        <div className="h-9 w-24 animate-pulse rounded bg-muted" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-24 animate-pulse rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
