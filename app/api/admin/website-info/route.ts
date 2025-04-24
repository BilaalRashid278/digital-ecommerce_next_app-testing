// app/api/website-info/route.ts
import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb" // Assuming this is your MongoDB connection utility
import { z } from "zod"

// Zod schema for validation
const WebsiteInfoSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    keywords: z.array(z.string()).min(1, "At least one keyword is required"),
    favicon: z.string().url("Invalid favicon URL"),
    logo: z.string(),
    footerName: z.string().min(1, "Footer name is required"),
    contactEmail: z.string().email("Invalid email address"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    address: z.string().min(1, "Address is required"),
})

export async function POST(request: Request) {
    try {
        const { db } = await connectToDatabase() // Assuming this function provides a connection to MongoDB
        const body = await request.json()

        // Validate incoming data
        const validation = WebsiteInfoSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors },
                { status: 400 }
            )
        }

        const websiteData = validation.data

        // Assuming 'website_info' is the collection where you store the website data
        const collection = db.collection("website_info")

        // Check if the website info document exists
        const existingData = await collection.findOne({})

        if (existingData) {
            // Update existing document with the new data
            await collection.updateOne(
                {},
                { $set: websiteData },
                { upsert: true } // If no document exists, create a new one
            )
        } else {
            // Create a new document if not exists
            await collection.insertOne(websiteData)
        }

        return NextResponse.json(
            { success: true, message: "Website information updated successfully" },
            { status: 200 }
        )
    } catch (error) {
        console.error("Error updating website information:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
