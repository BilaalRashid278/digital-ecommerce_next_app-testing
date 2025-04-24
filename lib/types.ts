import { z } from "zod"
import { BankAccountSchema } from "./schemas"

export interface User {
  _id?: string
  name: string
  email: string
  password: string
  phoneNumber: string
  role: "user" | "admin" | "blocked"
  createdAt?: Date
}

export interface Product {
  _id?: string
  title: string
  description: string
  short_description: string
  price: number
  salePrice: number
  type: string
  category: string
  images: string[]
  preview?: string
  sampleUrl?: string
  requirements: string[]
  features: string[]
  status: "draft" | "published"
  rating: number
  review: number
  featured: boolean
  instructor: string
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  _id: string
  productId: string
  product: Product
  userId: string
  createdAt: Date
}
export interface Category {
  _id?: string
  name: string
  description: string
  slug: string
  icon: string
  createdAt?: string
  color?: string
}

export interface Order {
  _id: string
  userId: string
  user?: User
  items: {
    productId: string
    product: Product
  }[]
  totalAmount: number
  paymentMethod: "jazzcash" | "easypaisa" | "bank_transfer" | "credit_card"
  paymentStatus: "pending" | "completed" | "failed"
  transactionId?: string
  accessGranted: boolean
  createdAt: Date
  updatedAt: Date
}

export type PaymentMethod = "jazzcash" | "easypaisa" | "bank_transfer"

export interface OrderType {
  productId?: string;
  productTitle?: string;
  productPrice?: number;
  productSalePrice?: number;
  userEmail?: string | null;
  userId?: string | null;
  userName?: string | null;
  userRole?: string | null;
  paymentMethod?: PaymentMethod
  phoneNumber: string
  paymentStatus: "pending" | "completed" | "failed"
  orderNumber?: string
  createdAt?: string | any
}

export type BankAccount = z.infer<typeof BankAccountSchema>



