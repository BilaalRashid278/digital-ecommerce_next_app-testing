"use client"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { PlusCircle, Trash2 } from "lucide-react"
import AdminLayout from "@/components/admin/admin-layout"
import { BankAccount } from "@/lib/types"
import { useCreateBankAccountMutation, useDeleteBankAccountMutation, useGetBankAccountsQuery } from "@/lib/rtk-client"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@radix-ui/react-progress"

export default function BankAccounts() {
    const { toast } = useToast();
    const { data: accounts, isFetching } = useGetBankAccountsQuery();
    const [createBankAccount, { isLoading }] = useCreateBankAccountMutation();
    useDeleteBankAccountMutation()
    const [deleteBankAccount, { isLoading: deleteLoading }] = useDeleteBankAccountMutation()

    const [newAccount, setNewAccount] = useState<BankAccount>({
        name: "",
        accountName: "",
        accountNumber: "",
        iban: "",
        phoneNumber: "",
        instructions: ""
    })
    const phoneNumberIndex = useMemo(() => accounts?.findIndex((acc) => acc.phoneNumber || acc.phoneNumber.length), [accounts])
    const [openDialog, setOpenDialog] = useState(false)

    const handleAddAccount = async () => {
        try {
            const { error } = await createBankAccount(newAccount);
            if (!error) {
                toast({
                    title: "Bank Account Create Successfully!",
                    variant: "success"
                })
            } else {
                toast({
                    title: "Bank Account No Create",
                    variant: "destructive"
                })
            }
        } catch (error) {
            toast({
                title: "Bank Account No Create",
                variant: "destructive"
            })
        }
        setOpenDialog(false)
    }

    const handleDeleteAccount = async (id: string) => {
        try {
            const { error } = await deleteBankAccount(id);
            if (!error) {
                toast({
                    title: "Bank Account Delete Successfully!",
                    variant: "success"
                })
            } else {
                toast({
                    title: "Bank Account not Delete",
                    variant: "destructive"
                })
            }
        } catch (error) {
            toast({
                title: "Bank Account not Delete",
                variant: "destructive"
            })
        }
    }

    return (
        <AdminLayout>
            <div className="space-y-6 p-3">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">Bank Accounts</h2>
                        <p className="text-base">The customer will make the payment to you in bank accounts.</p>
                    </div>
                    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add New Account
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>Add New Bank Account</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        value={newAccount.name}
                                        onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                                        className="col-span-3"
                                        placeholder="e.g. Bank Transfer"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="accountName" className="text-right">
                                        Account Name
                                    </Label>
                                    <Input
                                        id="accountName"
                                        value={newAccount.accountName}
                                        onChange={(e) => setNewAccount({ ...newAccount, accountName: e.target.value })}
                                        className="col-span-3"
                                        placeholder="e.g. YOUR_BANK_NAME"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="accountNumber" className="text-right">
                                        Account Number
                                    </Label>
                                    <Input
                                        id="accountNumber"
                                        value={newAccount.accountNumber}
                                        onChange={(e) => setNewAccount({ ...newAccount, accountNumber: e.target.value })}
                                        className="col-span-3"
                                        placeholder="e.g. PK00XXXX0000000000000000"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="iban" className="text-right">
                                        IBAN
                                    </Label>
                                    <Input
                                        id="iban"
                                        value={newAccount.iban}
                                        onChange={(e) => setNewAccount({ ...newAccount, iban: e.target.value })}
                                        className="col-span-3"
                                        placeholder="e.g. PK00XXXX0000000000000000"
                                    />
                                </div>
                                {phoneNumberIndex === -1 && (
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="iban" className="text-right">
                                            WhatsApp Number
                                        </Label>
                                        <Input
                                            id="phoneNumber"
                                            value={newAccount.phoneNumber}
                                            onChange={(e) => setNewAccount({ ...newAccount, phoneNumber: e.target.value })}
                                            className="col-span-3"
                                            placeholder="e.g. 92XXXXXXXXX"
                                        />
                                    </div>
                                )}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="instructions" className="text-right">
                                        Instructions
                                    </Label>
                                    <Input
                                        id="instructions"
                                        value={newAccount.instructions}
                                        onChange={(e) => setNewAccount({ ...newAccount, instructions: e.target.value })}
                                        className="col-span-3"
                                        placeholder="e.g. Transfer amount to this bank account..."
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button type="button" disabled={isLoading} onClick={handleAddAccount}>
                                    {isLoading ? "Saving..." : "Save Account"}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>



                {isFetching ? (
                    <div className="w-full">Loading...</div>
                ) : accounts && accounts?.length < 1 ? (
                    <div className="text-center text-lg w-full mt-3">No Accounts Available (Click Add New Account)</div>
                ) : accounts && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {accounts.map((account, index) => (
                            <Card key={account?._id} className="relative">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 h-8 w-8"
                                    onClick={() => handleDeleteAccount(account?._id)}
                                >
                                    {deleteLoading ? <Progress /> : <Trash2 className="h-4 w-4 text-red-500" />}

                                </Button>
                                <CardHeader>
                                    <CardTitle>{account.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Account Name</p>
                                            <p className="font-medium">{account.accountName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Account Number</p>
                                            <p className="font-medium">{account.accountNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">IBAN</p>
                                            <p className="font-medium">{account.iban}</p>
                                        </div>
                                        {phoneNumberIndex !== -1 && phoneNumberIndex === index ? (<div>
                                            <p className="text-sm text-muted-foreground">Whatsapp Number</p>
                                            <p className="font-medium">{account.phoneNumber}</p>
                                        </div>) : (
                                            <div>
                                                <p className="text-sm text-muted-foreground">Whatsapp Number</p>
                                                <p className="font-medium">Alreday set in {accounts[phoneNumberIndex].name}</p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm text-muted-foreground">Instructions</p>
                                            <p className="font-medium">{account.instructions}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}