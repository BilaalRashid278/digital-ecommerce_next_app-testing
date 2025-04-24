import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
    try {
        const { db } = await connectToDatabase();
        
        // Only find products where featured is true
        const products = await db.collection("products")
            .find({ featured: true, status: { $ne: "draft" } })
            .toArray();

        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        console.error("Error fetching featured products:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}