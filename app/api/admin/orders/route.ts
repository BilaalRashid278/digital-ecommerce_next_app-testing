import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    // Connect to database
    const { db } = await connectToDatabase()

    // Get all orders sorted by latest first
    const orders = await db.collection("orders")
      .find()
      .sort({ createdAt: -1 }) // -1 for descending (newest first)
      .toArray()

    // Transform orders (remove _id and add id)
    const transformedOrders = orders.map(order => ({
      id: order._id.toString(),
      ...order,
      _id: undefined // Remove the MongoDB _id field
    }))

    return NextResponse.json({
      success: true,
      data: transformedOrders
    }, { status: 200 })

  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch orders",
        details: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 500 }
    )
  }
}