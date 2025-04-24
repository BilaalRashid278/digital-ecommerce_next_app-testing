import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function GET(req: NextRequest, { params }: { params: { orderNumber: string } }) {
  try {
    const { orderNumber } = params
    const { db } = await connectToDatabase()
    
    // Fetch the order first
    const order = await db.collection('orders').findOne({ orderNumber })
    
    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      )
    }
    
    // Then fetch bank accounts (you might want to filter them based on orderNumber if there's a relation)
    const bankAccounts = await db.collection('bankAccounts').find().toArray()
    
    // Return both order and bankAccounts in the response
    return NextResponse.json({
      order,
      bankAccounts
    })
    
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch data", error: error.message },
      { status: 500 }
    )
  }
}