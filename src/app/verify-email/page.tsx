export default function VerifyEmailPage() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 relative">
        <div className="absolute inset-0 app-grid-bg pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#6366f1]/10 via-transparent to-transparent pointer-events-none" />
  
        <div className="w-full max-w-md relative">
          <div className="text-center space-y-6 p-8 rounded-lg border border-white/10 bg-white/5 shadow-xl backdrop-blur-sm">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  className="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
  
            <div>
              <h1 className="text-2xl font-bold">Check your email</h1>
              <p className="mt-3 text-muted-foreground">
                We sent a verification link to your email address.
              </p>
            </div>
  
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg text-left">
                <p className="text-sm font-medium mb-2">📬 What to do next:</p>
                <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                  <li>Open your email inbox</li>
                  <li>Click the verification link</li>
                  <li>You will be redirected to your dashboard</li>
                </ol>
              </div>
  
              <div className="p-4 border border-yellow-500/20 bg-yellow-500/5 rounded-lg">
                <p className="text-sm text-yellow-600 dark:text-yellow-500">
                  💡 <strong>Did not receive it?</strong>
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Check your spam folder. The email comes from noreply@retallio.app
                </p>
              </div>
            </div>
  
            <div className="pt-4 border-t border-white/10">
              <a 
                href="/login" 
                className="text-sm text-primary hover:underline"
              >
                Already verified? Sign in →
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }