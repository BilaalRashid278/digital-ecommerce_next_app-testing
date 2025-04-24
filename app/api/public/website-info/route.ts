// app/api/website-info/route.ts
import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb" // Assuming this is your MongoDB connection utility


export async function GET() {
    try {
        const { db } = await connectToDatabase()

        const websiteInfo = await db.collection("website_info").findOne()

        if (!websiteInfo) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Website info not found",
                },
                { status: 404 }
            )
        }

        return NextResponse.json(
            {
                success: true,
                data: websiteInfo,
            },
            { status: 200 }
        )
    } catch (error) {
        console.error("Error fetching website info:", error)
        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }
        )
    }
}