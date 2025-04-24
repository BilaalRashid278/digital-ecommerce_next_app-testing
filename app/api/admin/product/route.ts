import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ProductSchema } from "@/lib/schemas";


// GET all products
export async function GET() {
    try {
        const { db } = await connectToDatabase();
        const products = await db.collection("products").find().toArray();

        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}


export async function POST(req: Request) {
    try {
        const data = await req.json()

        const productResult = ProductSchema.safeParse(data);

        if (!productResult.success) {
            return NextResponse.json({ error: "Product Creation Failed", issues: productResult.error.issues }, { status: 400 })
        }

        const { db } = await connectToDatabase();

        // Create the product
        const result = await db.collection("products").insertOne({...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()})

        return NextResponse.json(
            {
                message: "Product created successfully",
                productId: result.insertedId,
            },
            { status: 201 },
        )
    } catch (error) {
        console.error("Error creating product:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}