"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export function AuthErrorPage() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const errorParam = searchParams.get("error")
    if (errorParam) {
      switch (errorParam) {
        case "CredentialsSignin":
          setError("Invalid email or password. Please try again.")
          break
        case "SessionRequired":
          setError("You need to be signed in to access this page.")
          break
        case "AccessDenied":
          setError("You don't have permission to access this page.")
          break
        default:
          setError("An authentication error occurred. Please try again.")
      }
    }
  }, [searchParams])

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/20">
              <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <CardTitle className="text-2xl">Authentication Error</CardTitle>
          <CardDescription>{error || "An error occurred during authentication"}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">Please try again or contact support if the problem persists.</p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/">Return to Homepage</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/login">Try Again</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function AuthErrorPageWithSuspense () {
  return (
    <Suspense>
        <AuthErrorPage/>
    </Suspense>
  )
}

