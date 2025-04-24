import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { z } from "zod"

// Zod schema for role update
const roleUpdateSchema = z.object({
  role: z.enum(["user", "admin", "blocked"]),
})

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validate ID parameter
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      )
    }

    // Parse and validate request body
    const requestData = await req.json()
    const validationResult = roleUpdateSchema.safeParse(requestData)

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

    const { role } = validationResult.data

    // Connect to database
    const { db } = await connectToDatabase()

    // Update user role
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { role, updatedAt: new Date() } }
    )

    // Check if user was found and updated
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "User role updated successfully",
        userId: params.id,
        newRole: role
      },
      { status: 200 }
    )

  } catch (error) {
    console.error("Error updating user role:", error)
    return NextResponse.json(
      { 
        error: "An unexpected error occurred",
        details: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validate ID parameter
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      )
    }

    // Connect to database
    const { db } = await connectToDatabase()

    // Delete user
    const result = await db.collection("users").deleteOne({
      _id: new ObjectId(params.id)
    })

    // Check if user was found and deleted
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "User deleted successfully",
        userId: params.id
      },
      { status: 200 }
    )

  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { 
        error: "An unexpected error occurred",
        details: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 500 }
    )
  }
}