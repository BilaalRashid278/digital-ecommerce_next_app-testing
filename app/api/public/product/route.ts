import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
    try {
        const { db } = await connectToDatabase();

        const products = await db.collection("products")
            .find({ status: { $ne: "draft" } }) // $ne means "not equal"
            .toArray();

        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}