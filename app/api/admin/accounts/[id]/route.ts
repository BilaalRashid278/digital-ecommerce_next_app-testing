import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase()
    
    // Validate ID format
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { message: "Invalid ID format" },
        { status: 400 }
      )
    }

    const result = await db.collection('bankAccounts').deleteOne({
      _id: new ObjectId(params.id)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Account not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: "Account deleted successfully" },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to delete account", error: error?.message },
      { status: 500 }
    )
  }
}