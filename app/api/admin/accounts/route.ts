import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { BankAccountSchema } from '@/lib/schemas'

// GET all bank accounts
export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const accounts = await db.collection('bankAccounts').find().toArray()
    return NextResponse.json(accounts)
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch bank accounts", error: error.message },
      { status: 500 }
    )
  }
}

// POST a new bank account
export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()
    
    // Validate with Zod
    const validation = BankAccountSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: validation.error.errors },
        { status: 400 }
      )
    }

    const newAccount = {
      ...validation.data,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection('bankAccounts').insertOne(newAccount)
    
    return NextResponse.json(
      { ...newAccount, _id: result.insertedId },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to create bank account", error: error?.message },
      { status: 500 }
    )
  }
}