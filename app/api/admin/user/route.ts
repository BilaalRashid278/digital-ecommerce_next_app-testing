import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { connectToDatabase } from "@/lib/mongodb"
import { z } from "zod"

// GET all user
export async function GET() {
    try {
        const { db } = await connectToDatabase();
        const products = await db.collection("users").find(
            {}, 
            { projection: { password: 0 } } 
        ).toArray();

        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}



const userSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string(),
  role: z.string().optional().default("user")
})

export async function POST(req: Request) {
  try {
    // Parse and validate request body
    const requestData = await req.json()
    const validationResult = userSchema.safeParse(requestData)

    if (!validationResult.success) {
      const errorMessages = validationResult.error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message
      }))
      
      return NextResponse.json(
        { 
          error: "Validation failed",
          details: errorMessages 
        },
        { status: 400 }
      )
    }

    const { name, email, password, role } = validationResult.data

    // Connect to database
    const { db } = await connectToDatabase()

    // Check if user exists
    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user
    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
    })

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        userId: result.insertedId,
      },
      { status: 201 }
    )

  } catch (error: any) {
    console.error("Error in user creation:", error)
    
    // Handle specific error types
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      )
    }
    
    // Generic error response
    return NextResponse.json(
      { 
        error: "An unexpected error occurred",
        details: process.env.NODE_ENV === "development" ? error?.message : undefined
      },
      { status: 500 }
    )
  }
}