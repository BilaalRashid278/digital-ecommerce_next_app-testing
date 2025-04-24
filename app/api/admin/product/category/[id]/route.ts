import { z } from "zod";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { CategorySchema } from "@/lib/schemas";

const PartialProductSchema = CategorySchema.partial();

// DELETE product
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        
        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid category ID" },
                { status: 400 }
            );
        }

        const { db } = await connectToDatabase();
        const result = await db.collection("category").deleteOne({
            _id: new ObjectId(id)
        });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { error: "Category not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Category deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting category:", error);
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
                { error: "Invalid category ID" },
                { status: 400 }
            );
        }

        const productResult = PartialProductSchema.safeParse(data);
        if (!productResult.success) {
            return NextResponse.json(
                { error: "Category update failed", issues: productResult.error.issues },
                { status: 400 }
            );
        }

        const { db } = await connectToDatabase();
        const result = await db.collection("category").updateOne(
            { _id: new ObjectId(id) },
            { $set: { ...productResult.data } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { error: "Category not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Category updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating category:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}