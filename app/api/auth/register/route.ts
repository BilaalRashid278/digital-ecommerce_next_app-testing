import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { connectToDatabase } from "@/lib/mongodb"
import { z } from "zod"

// Schema for validation
const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string(),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validate input data
    const result = userSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", issues: result.error.issues }, { status: 400 })
    }

    const { name, email, password, phoneNumber } = result.data

    const { db } = await connectToDatabase()

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Hash the password
    const hashedPassword = await hash(password, 12)

    // Create the user with 'user' role (not admin)
    const newUser = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      role: "user", // Default role is 'user'
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json(
      {
        message: "User registered successfully",
        userId: newUser.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "An error occurred during registration" }, { status: 500 })
  }
}

