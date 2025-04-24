import { NextResponse } from 'next/server';
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from 'mongodb'
import { z } from 'zod';

// Define status enum with value-label pairs
const statusEnum = [
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" }
] as const;

// Create Zod schema for validation
const updateOrderSchema = z.object({
    paymentStatus: z.enum([
        statusEnum[0].value,
        statusEnum[1].value,
        statusEnum[2].value
    ])
});

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        if (!ObjectId.isValid(params.id)) {
            return NextResponse.json(
                { message: "Invalid ID format" },
                { status: 400 }
            )
        }
        const { db } = await connectToDatabase();

        const { id } = params;
        const requestBody = await request.json();

        // Validate request body
        const validationResult = updateOrderSchema.safeParse(requestBody);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    message: 'Invalid request body',
                    details: validationResult.error.errors
                },
                { status: 400 }
            );
        }

        const { paymentStatus } = validationResult.data;

        // Update the order
        const updatedOrder = await db.collection("orders").findOneAndUpdate({ _id: new ObjectId(params.id) },
        { $set: { paymentStatus } },
        { 
          returnDocument: 'after', // Return the updated document
        });

        if (!updatedOrder) {
            return NextResponse.json(
                { message: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedOrder, { status: 200 });
    } catch (error) {
        console.error('Error updating order status:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}