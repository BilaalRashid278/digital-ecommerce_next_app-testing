import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { CategorySchema } from "@/lib/schemas";


export async function GET() {
    try {
        const { db } = await connectToDatabase();
        const category = await db.collection("category").find().toArray();

        return NextResponse.json(category, { status: 200 });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json()

        const categoryResult = CategorySchema.safeParse(data);

        if (!categoryResult.success) {
            return NextResponse.json({ error: "Category Creation Failed", issues: categoryResult.error.issues }, { status: 400 })
        }

        const { db } = await connectToDatabase();

        // Create the category
        const result = await db.collection("category").insertOne({...data, createdAt: new Date().toISOString(),})

        return NextResponse.json(
            {
                message: "Category created successfully",
                categoryId: result.insertedId,
            },
            { status: 201 },
        )
    } catch (error) {
        console.error("Error creating category:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}