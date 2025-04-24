'use client'
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useGetPublicBankAccountsAndOrderMutation } from "@/lib/rtk-client"
import { Copy, Check, ChevronDown, ChevronUp, MessageCircle } from "lucide-react"
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function PaymentInstructions() {
  const { toast } = useToast();
  const [expandedAccount, setExpandedAccount] = useState<string | null>(null)
  const [getAccountAndOrder, { isLoading, data }] = useGetPublicBankAccountsAndOrderMutation();
  const { id } = useParams()
  const [copied, setCopied] = useState<{field: string, id: string} | null>(null)
  const { order, bankAccounts } = data || {};
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [selectedBank, setSelectedBank] = useState('')

  const phoneNumber = useMemo(() => bankAccounts?.find((acc) => acc.phoneNumber || acc.phoneNumber.length)?.phoneNumber,[bankAccounts])

  const handleCopy = (text: string, field: string, accountId: string) => {
    navigator.clipboard.writeText(text)
    setCopied({field, id: accountId})
    setTimeout(() => setCopied(null), 2000)
    toast({
      title: "Copied!",
      description: `${field} copied to clipboard`,
    })
  }

  const toggleAccount = (accountId: string) => {
    setExpandedAccount(expandedAccount === accountId ? null : accountId)
  }

  const handleWhatsAppClick = () => {
    if (!firstName || !lastName) {
      toast({
        title: "Error",
        description: "Please enter your first name and last name",
        variant: "destructive"
      })
      return
    }

    if (!selectedBank) {
      toast({
        title: "Error",
        description: "Please select the bank you used for payment",
        variant: "destructive"
      })
      return
    }

    const selectedBankName = bankAccounts?.find(acc => acc?._id === selectedBank)?.name || '';
    const message = `Payment Receipt for Order #${id}\n` +
                   `Amount: ${order?.productSalePrice || order?.productPrice} PKR\n` +
                   `Customer Name: ${firstName} ${lastName}\n` +
                   `Paid Via: ${selectedBankName}\n` +
                   `Please verify and confirm my payment.`;

    const whatsappUrl = `https://wa.me/${phoneNumber?.replace("+","")}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  useEffect(() => {
    getAccountAndOrder(String(id));
  }, [id, getAccountAndOrder])

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Payment Instructions</h1>
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
          <p className="mb-1">Order Number: <span className="font-medium">{id}</span></p>
          <p>Amount: 
            <div className="mt-1 flex items-center gap-2">
              {order?.productPrice && (
                <del className="font-bold text-sm text-gray-500">
                  {order.productPrice} PKR
                </del>
              )}
              <span className="font-bold text-lg text-green-600">
                {order?.productSalePrice} PKR
              </span>
            </div>
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Available Bank Accounts</h2>
          {bankAccounts?.length ? (
            <div className="space-y-4">
              {bankAccounts.map((account: any) => (
                <div key={account._id} className="border rounded-lg overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => toggleAccount(account._id)}
                  >
                    <h3 className="font-medium">{account.name}</h3>
                    {expandedAccount === account._id ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>

                  {expandedAccount === account._id && (
                    <div className="p-4 pt-0 border-t">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Account Name:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{account.accountName}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleCopy(account.accountName, 'accountName', account._id)}
                            >
                              {copied?.field === 'accountName' && copied.id === account._id ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Account Number:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{account.accountNumber}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleCopy(account.accountNumber, 'accountNumber', account._id)}
                            >
                              {copied?.field === 'accountNumber' && copied.id === account._id ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {account.iban && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">IBAN:</span>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{account.iban}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleCopy(account.iban!, 'iban', account._id)}
                              >
                                {copied?.field === 'iban' && copied.id === account._id ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      {account.instructions && (
                        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                          <h3 className="font-medium mb-1 text-sm">Instructions:</h3>
                          <p className="text-sm">{account.instructions}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No bank accounts available</p>
          )}
        </div>

        <div className="mb-6 space-y-4">
          <h3 className="font-medium">Please enter your bank account name</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input 
                id="firstName" 
                placeholder="Enter your first name" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName" 
                placeholder="Enter your last name" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bank">Select bank you will send payment</Label>
            <Select onValueChange={setSelectedBank} required>
              <SelectTrigger>
                <SelectValue placeholder="Select the bank you used" />
              </SelectTrigger>
              <SelectContent>
                {bankAccounts?.map((account: any) => (
                  <SelectItem key={account._id} value={account._id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
          <h3 className="font-medium mb-2">Important:</h3>
          <p className="text-sm">After payment, please fill in your details above and send the receipt to our WhatsApp at {phoneNumber}</p>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleWhatsAppClick}>
            <MessageCircle className="mr-2 h-4 w-4" />
            Send Payment Receipt via WhatsApp
          </Button>
        </div>
      </div>
    </div>
  )
}