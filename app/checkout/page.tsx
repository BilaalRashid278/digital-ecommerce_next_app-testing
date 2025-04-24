"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CreditCard, Smartphone, Building } from "lucide-react"
import Link from "next/link"

// Mock cart items
const cartItems = [
  {
    id: 1,
    title: "Premium Video Course",
    price: 49.99,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    title: "E-Book Bundle",
    price: 29.99,
    image: "/placeholder.svg?height=80&width=80",
  },
]

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("credit-card")

  const subtotal = cartItems.reduce((total, item) => total + item.price, 0)
  const discount = 10 // $10 discount
  const total = subtotal - discount

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                We'll use this information to send your purchase confirmation and access details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input id="phone" placeholder="+1 (555) 000-0000" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Choose your preferred payment method.</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                <div className="flex items-center space-x-2 rounded-lg border p-4">
                  <RadioGroupItem value="credit-card" id="credit-card" />
                  <Label htmlFor="credit-card" className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5 text-muted-foreground" />
                    Credit/Debit Card
                  </Label>
                </div>

                <div className="flex items-center space-x-2 rounded-lg border p-4">
                  <RadioGroupItem value="jazzcash" id="jazzcash" />
                  <Label htmlFor="jazzcash" className="flex items-center">
                    <Smartphone className="mr-2 h-5 w-5 text-muted-foreground" />
                    JazzCash
                  </Label>
                </div>

                <div className="flex items-center space-x-2 rounded-lg border p-4">
                  <RadioGroupItem value="easypaisa" id="easypaisa" />
                  <Label htmlFor="easypaisa" className="flex items-center">
                    <Smartphone className="mr-2 h-5 w-5 text-muted-foreground" />
                    EasyPaisa
                  </Label>
                </div>

                <div className="flex items-center space-x-2 rounded-lg border p-4">
                  <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                  <Label htmlFor="bank-transfer" className="flex items-center">
                    <Building className="mr-2 h-5 w-5 text-muted-foreground" />
                    Bank Transfer
                  </Label>
                </div>
              </RadioGroup>

              {paymentMethod === "credit-card" && (
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input id="card-number" placeholder="0000 0000 0000 0000" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="000" />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "jazzcash" && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-900">
                  <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">JazzCash Payment Instructions</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    After placing your order, you'll receive instructions on how to complete your payment via JazzCash.
                  </p>
                </div>
              )}

              {paymentMethod === "easypaisa" && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-900">
                  <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">EasyPaisa Payment Instructions</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    After placing your order, you'll receive instructions on how to complete your payment via EasyPaisa.
                  </p>
                </div>
              )}

              {paymentMethod === "bank-transfer" && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-900">
                  <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Bank Transfer Instructions</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    After placing your order, you'll receive our bank details. Please include your order number in the
                    payment reference.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-muted-foreground">${item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-4">
                <Button className="w-full">Complete Purchase</Button>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  By completing your purchase, you agree to our{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

