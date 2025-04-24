"use client"
import React from 'react'
import { Button } from "@/components/ui/button"
import { Key } from "lucide-react"
import { useSession } from 'next-auth/react'
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import LoginForm from './login'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Product, OrderType, PaymentMethod } from "@/lib/types"
import { useCreateOrderMutation } from '@/lib/rtk-client'
import { useRouter } from 'next/navigation'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

const AccessButton = ({ classes, product }: { classes: string, product: Product | null }) => {
    const router = useRouter()
    const { toast } = useToast();
    const [createOrder, { isLoading }] = useCreateOrderMutation();
    const { data: session, status } = useSession()
    const [open, setOpen] = React.useState(false)
    const [email, setEmail] = React.useState("")
    const [phoneNumber, setPhoneNumber] = React.useState("")
    const [isValidEmail, setIsValidEmail] = React.useState(true)
    // const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>("jazzcash")

    const isAuthenticated = status === "authenticated"

    React.useEffect(() => {
        if (isAuthenticated && session?.user?.email) {
            setEmail(session.user.email)
            setPhoneNumber(session.user.phoneNumber || "")
        }
    }, [isAuthenticated, session])

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return re.test(email)
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setEmail(value)
        setIsValidEmail(validateEmail(value) || value === "")
    }

    const handleSubmit = async () => {
        if (!validateEmail(email)) {
            setIsValidEmail(false)
            return
        }
        try {
            const orderData: OrderType = {
                productId: product?._id || "",
                productTitle: product?.title,
                productPrice: product?.price,
                productSalePrice: product?.salePrice,
                userEmail: session?.user.email,
                userId: session?.user.id,
                userName: session?.user.name,
                userRole: session?.user.role,
                phoneNumber: phoneNumber || "",
                // paymentMethod: paymentMethod,
                paymentStatus: "pending"
            }

            const { error, data } = await createOrder(orderData);
            if (data?.success) {
                toast({
                    title: "Order create successful!",
                    description: "You'll be notified when this product is available.",
                    variant: "success"
                });
                router.push(`/payment-instructions/${data.orderNumber}`);
            } else {
                toast({
                    title: "Error",
                    description: "Something went wrong. Please try again.",
                    variant: "destructive",
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            })
        } finally {
            setOpen(false);
        }
    }

    const handleClick = () => {
        setOpen(true)
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        size="sm"
                        className={`${classes}`}
                        onClick={handleClick}
                    >
                        <Key className="h-4 w-4 mr-2" />
                        Get Access
                    </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px]">
                    {!isAuthenticated ? (
                        <LoginForm goNavigate={false} />
                    ) : (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Get Notified</h3>
                            <p className="text-sm text-muted-foreground">
                                Enter your email address & phone number to be notified when this product becomes available.
                            </p>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    className={!isValidEmail ? "border-red-500" : ""}
                                />
                                {!isValidEmail && (
                                    <p className="text-sm text-red-500">Please enter a valid email address</p>
                                )}
                            </div>
                            <div className='font-semibold my-2'>OR</div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Phone Number</Label>
                                <PhoneInput
                                    placeholder="Enter phone number"
                                    defaultCountry="PK"
                                    value={phoneNumber}
                                    onChange={(e) => {
                                        setPhoneNumber(e || "");
                                    }}
                                    className="input w-full rounded-md border px-3 py-2 text-sm shadow-sm"
                                />
                                 {!phoneNumber && (
                                    <p className="text-sm text-red-500">Phone number is required</p>
                                )}
                            </div>

                            {/* <div className="space-y-2">
                                <Label>Payment Method</Label>
                                <RadioGroup 
                                    defaultValue="jazzcash" 
                                    className="flex flex-col space-y-2"
                                    onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="jazzcash" id="jazzcash" />
                                        <Label htmlFor="jazzcash">JazzCash</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="easypaisa" id="easypaisa" />
                                        <Label htmlFor="easypaisa">EasyPaisa</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                                        <Label htmlFor="bank_transfer">Bank Transfer</Label>
                                    </div>
                                </RadioGroup>
                            </div> */}

                            <div className="flex justify-end">
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!email || !isValidEmail || !phoneNumber || isLoading}
                                >
                                    {isLoading ? "Processing..." : "Notify Me"}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}

export default React.memo(AccessButton)