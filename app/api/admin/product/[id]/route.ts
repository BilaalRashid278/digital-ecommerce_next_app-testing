import { z } from "zod";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { ProductSchema } from "@/lib/schemas";

const PartialProductSchema = ProductSchema.partial();


// GET single product
export async function GET_SINGLE(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        
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

// DELETE product
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        
        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid product ID" },
                { status: 400 }
            );
        }

        const { db } = await connectToDatabase();
        const result = await db.collection("products").deleteOne({
            _id: new ObjectId(id)
        });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Product deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// PATCH product (partial update)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const data = await req.json();

        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid product ID" },
                { status: 400 }
            );
        }

        const productResult = PartialProductSchema.safeParse(data);

        if (!productResult.success) {
            return NextResponse.json(
                { error: "Product update failed", issues: productResult.error.issues },
                { status: 400 }
            );
        }

        const { db } = await connectToDatabase();
        const result = await db.collection("products").updateOne(
            { _id: new ObjectId(id) },
            { $set: { ...productResult.data, updatedAt: new Date().toISOString() } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Product updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}