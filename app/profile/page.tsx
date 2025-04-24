"use client"

import { useSession } from "next-auth/react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfilePage() {
    const { data: session, status } = useSession()

    if (status === "loading") {
        return (
            <div className="container mx-auto py-12">
                <Skeleton className="h-40 w-full rounded-xl" />
            </div>
        )
    }

    const user = session?.user as {
        id: string
        name: string
        email: string
        role: string
        phoneNumber?: string
    }

    return (
        <div className="container mx-auto py-12">
            <Card className="max-w-xl mx-auto shadow-lg rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Your Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                    <div>
                        <span className="font-semibold text-primary">ID:</span> {user.id}
                    </div>
                    <div>
                        <span className="font-semibold text-primary">Name:</span> {user.name}
                    </div>
                    <div>
                        <span className="font-semibold text-primary">Email:</span> {user.email}
                    </div>
                    <div>
                        <span className="font-semibold text-primary">Role:</span> {user.role}
                    </div>
                    <div>
                        <span className="font-semibold text-primary">Phone Number:</span>{" "}
                        {user.phoneNumber || "N/A"}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
