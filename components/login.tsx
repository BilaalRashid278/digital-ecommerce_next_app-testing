"use client"
import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

// Form validation schema
const formSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function LoginForm({goNavigate = true}: {goNavigate?: boolean}) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const { toast } = useToast()

    // Get the callbackUrl from the query parameters or default to "/"
    const callbackUrl = searchParams.get("callbackUrl") || "/"

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    })

    async function onSubmit(values: FormValues) {
        setIsLoading(true)

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: values.email,
                password: values.password,
            })

            if (result?.error) {
                toast({
                    title: "Login failed",
                    description: "Invalid email or password. Please try again.",
                    variant: "destructive",
                })
            } else {
                // Check if the user is an admin and redirect accordingly
                const response = await fetch("/api/auth/session")
                const session = await response.json()

                toast({
                    title: "Login successful",
                    description: "You have been logged in successfully.",
                    variant: "success"
                })

                if(goNavigate){
                    if (session?.user?.role === "admin") {
                        router.push("/admin/dashboard")
                    } else {
                        router.push(callbackUrl)
                    }
                }
                // Force a refresh to update the UI with the logged-in state
                router.refresh()
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "An unexpected error occurred. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="m@example.com" {...field} disabled={isLoading} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center justify-between">
                                    <FormLabel>Password</FormLabel>
                                </div>
                                <FormControl>
                                    <Input type="password" {...field} disabled={isLoading} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="rememberMe"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Remember me</FormLabel>
                                </div>
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Logging in..." : "Login"}
                    </Button>
                </form>
            </Form>
            <div className="text-sm text-muted-foreground mt-2">
                Don't have an account?{" "}
                <Link href="/auth/register" className="text-primary hover:underline">
                    Sign up
                </Link>
            </div>
        </div>
    )
}

export default function LoginWithSuspense({goNavigate = true}: {goNavigate?: boolean}) {
    return (
        <Suspense>
            <LoginForm goNavigate={goNavigate}/>
        </Suspense>
    )
}

