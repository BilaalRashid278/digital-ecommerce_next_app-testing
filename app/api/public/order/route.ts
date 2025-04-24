// app/api/orders/route.ts
import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { z } from "zod"

// Zod schema for order validation
const OrderSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  productTitle: z.string().min(1, "Product title is required"),
  productPrice: z.number().min(0, "Price must be positive"),
  productSalePrice: z.number().optional(),
  userEmail: z.string().email("Invalid email address"),
  userId: z.string().min(1, "User ID is required"),
  userName: z.string().min(1, "User name is required"),
  userRole: z.string().optional(),
  phoneNumber: z.string(),
  paymentMethod: z.enum(["jazzcash", "easypaisa", "bank_transfer"]).optional().default("bank_transfer"),
  paymentStatus: z.enum(["pending", "completed", "failed"]).default("pending"),
  orderNumber: z.string().min(1, "Order number is required"),
  createdAt: z.date().default(new Date()),
  updateddAt: z.date().default(new Date()),
})

// Generate unique order number
const generateOrderNumber = async (db: any): Promise<string> => {
  const prefix = "ORD"
  const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '') // YYMMDD format
  const count = await db.collection("counters").findOneAndUpdate(
    { _id: "orderNumber" },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: "after" }
  )
  const sequence = String(count.seq).padStart(6, '0')
  return `${prefix}${datePart}${sequence}`
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()

    // Generate unique order number
    const orderNumber = await generateOrderNumber(db)

    // Validate the request body
    const validation = OrderSchema.safeParse({
      ...body,
      orderNumber
    })

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors },
        { status: 400 }
      )
    }

    const orderData = validation.data

    // Insert the order into the database
    const result = await db.collection("orders").insertOne(orderData)

    return NextResponse.json(
      { 
        success: true,
        orderId: result.insertedId,
        orderNumber: orderNumber,
        message: "Order created successfully" 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// ... (keep the existing GET method)