import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { ProductSchema } from "@/lib/schemas";

const PartialProductSchema = ProductSchema.partial();


// GET single product
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;
        
        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid product ID" },
                { status: 400 }
            );
        }

        const { db } = await connectToDatabase();
        const product = await db.collection("products").findOne({
            _id: new ObjectId(id)
        });

        if (!product) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}