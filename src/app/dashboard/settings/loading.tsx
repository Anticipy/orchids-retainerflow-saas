import { Card, CardContent } from "@/components/ui/card"

export default function SettingsLoading() {
  return (
    <div className="space-y-6 w-full max-w-4xl">
      <div className="h-8 w-24 animate-pulse rounded bg-muted" />
      <Card>
        <CardContent className="p-6">
          <div className="h-32 animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="h-40 animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    </div>
  )
}
