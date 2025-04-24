"use client"
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Edit, Check, Send } from "lucide-react";
import AdminLayout from '@/components/admin/admin-layout';
import {
    useGetAdminOrdersQuery, useUpdateAdminOrderMutation,
    // useUpdateOrderMutation
} from '@/lib/rtk-client';
import { OrderType } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ColumnDefinition, DataTable } from '@/components/ui/custom-table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import moment from 'moment';

const orderColumns: ColumnDefinition<OrderType>[] = [
    {
        key: "orderNumber",
        header: "Order #",
        cell: (row) => row.orderNumber,
        filterType: "text",
    },
    {
        key: "userName",
        header: "Customer Name",
        cell: (row) => row.userName || "N/A",
        filterType: "text",
        minWidth: "150px"
    },
    {
        key: "userEmail",
        header: "Customer Email",
        cell: (row) => row.userEmail || "N/A",
        filterType: "text",
    },
    {
        key: "phoneNumber",
        header: "User Phone Number",
        cell: (row) => row.phoneNumber || "N/A",
        filterType: "text",
        minWidth: "180px"
    },
    {
        key: "productTitle",
        header: "Product",
        cell: (row) => row.productTitle || "N/A",
        filterType: "text",
        minWidth: "150px"
    },
    {
        key: "productPrice",
        header: "Price",
        cell: (row) => (
            <div className="mt-2 flex items-center gap-2">
                <span className="font-bold text-md">{row?.productSalePrice}<small>PKR</small></span>
                <del className="font-bold text-xs">{row?.productPrice}<small>PKR</small></del>
            </div>
        ),
        minWidth: "150px"
    },
    {
        key: "paymentStatus",
        header: "Payment Status",
        cell: (row) => row.paymentStatus.charAt(0).toUpperCase() + row.paymentStatus.slice(1),
        filterType: "select",
        filterOptions: [
            { value: "pending", label: "Pending" },
            { value: "completed", label: "Completed" },
            { value: "failed", label: "Failed" },
        ],
        minWidth: "150px"
    },
    {
        key: "createdAt",
        header: "Order Date",
        cell: (row) => moment.utc(row.createdAt).format('YYYY-MM-DD'),
        filterType: "date",
    },
];

export default function Orders() {
    const { toast } = useToast();
    const { data: orders, isFetching, refetch } = useGetAdminOrdersQuery();
    const [updateOrder, { isLoading: updateOrderLoading }] = useUpdateAdminOrderMutation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentOrder, setCurrentOrder] = useState<OrderType | null>(null);
    const [modelType, setModelType] = useState<"edit" | "send" | null>(null);
    console.log(currentOrder, 'orders');
    const form = useForm<OrderType>({
        defaultValues: {
            paymentStatus: "pending",
        },
    });
    const [messageFields, setMessageFields] = useState([{ title: "Link", value: currentOrder?.productDriveUrl || "" }]);

    const addMessageField = () => {
        setMessageFields([...messageFields, { title: "", value: "" }]);
    };

    const removeMessageField = (index: number) => {
        setMessageFields(fields => fields.filter((_, i) => i !== index));
    };

    const handleFieldChange = (index: number, key: "title" | "value", value: string) => {
        setMessageFields(fields => {
            const newFields = [...fields];
            newFields[index][key] = value;
            return newFields;
        });
    };

    const sendWhatsAppMessage = () => {
        if (!currentOrder?.phoneNumber) return;

        // Clean phone number
        let phone = currentOrder.phoneNumber.replace(/\D/g, '');
        if (phone.startsWith('0')) phone = '92' + phone.slice(1);
        if (!phone.startsWith('92')) phone = '92' + phone;

        // Build message
        const msg = messageFields
            .filter(field => field.title && field.value)
            .map(field => `${field.title}: ${field.value}`)
            .join('\n');

        const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
        window.open(whatsappUrl, '_blank');
    };


    const handleOpenDialog = (order: OrderType | null, type: "edit" | "send") => {
        setModelType(type);
        setCurrentOrder(order);
        if (order) {
            form.reset(order);
        } else {
            form.reset({
                paymentStatus: "pending",
            });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async (values: OrderType) => {
        if (currentOrder) {
            try {
                const { error, data } = await updateOrder({
                    id: currentOrder?.id || "",
                    paymentStatus: values.paymentStatus,
                });

                if (!error) {
                    toast({
                        title: "Order Updated",
                        description: data.message,
                        variant: "success"
                    });
                    refetch();
                } else {
                    toast({
                        title: "Update Failed",
                        description: error.message,
                        variant: "destructive"
                    });
                }
            } catch (error: any) {
                toast({
                    title: "Update Failed",
                    description: error.message,
                    variant: "destructive"
                });
            }
        }
        setIsDialogOpen(false);
    };

    const getOrderActions = (row: OrderType) => {
        return [
            {
                id: "edit",
                label: "Edit",
                icon: <Edit className="h-4 w-4" />,
                onClick: () => handleOpenDialog(row, "edit"),
            },
            {
                id: "send_message",
                label: "Send Order Detail To User",
                icon: <Send className="h-4 w-4" />,
                onClick: () => handleOpenDialog(row, "send"),
            },
        ];
    };

    return (
        <AdminLayout>
            <div className="space-y-6 p-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Order Management</h2>
                </div>

                <DataTable<OrderType>
                    data={isFetching ? [] : orders || []}
                    columns={orderColumns}
                    getActions={getOrderActions}
                    // onRowClick={(row) => {}}
                    loading={isFetching}
                    refresh={refetch}
                />

                {/* Order Details Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    {modelType === "edit" && (<DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>
                                {currentOrder ? `Order #${currentOrder.orderNumber}` : "Order Details"}
                            </DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                                {currentOrder && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <h3 className="font-semibold">Customer Information</h3>
                                            <p>Name: {currentOrder.userName || "N/A"}</p>
                                            <p>Email: {currentOrder.userEmail || "N/A"}</p>
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="font-semibold">Order Information</h3>
                                            <p>Product: {currentOrder.productTitle || "N/A"}</p>
                                            <p>Price: <div className="mt-2 flex items-center gap-2">
                                                <span className="font-bold text-md">{currentOrder?.productSalePrice}<small>PKR</small></span>
                                                <del className="font-bold text-xs">{currentOrder?.productPrice}<small>PKR</small></del>
                                            </div></p>
                                            <p>Order Date: {moment.utc(currentOrder.createdAt).format('YYYY-MM-DD')}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="paymentStatus"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Payment Status</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select payment status" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="pending">Pending</SelectItem>
                                                        <SelectItem value="completed">Completed</SelectItem>
                                                        <SelectItem value="failed">Failed</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <DialogFooter>
                                    <Button type="submit">
                                        <Check className="mr-2 h-4 w-4" />
                                        {updateOrderLoading ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>)}
                    {modelType === "send" && currentOrder && (
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Send WhatsApp Message</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="text-sm text-muted-foreground">
                                    Customer: {currentOrder.userName} ({currentOrder.phoneNumber})
                                </div>

                                {messageFields.map((field, index) => (
                                    <div key={index} className="grid grid-cols-2 gap-2 items-center">
                                        <input
                                            type="text"
                                            className="border p-2 rounded text-sm"
                                            placeholder="Title"
                                            value={field.title}
                                            onChange={(e) => handleFieldChange(index, 'title', e.target.value)}
                                        />
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                className="border p-2 rounded text-sm flex-grow"
                                                placeholder="Value"
                                                value={field.value}
                                                onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
                                            />
                                            <Button
                                                variant="destructive"
                                                onClick={() => removeMessageField(index)}
                                            >Remove</Button>
                                        </div>
                                    </div>
                                ))}

                                <Button variant="outline" onClick={addMessageField}>Add New Field</Button>

                                <DialogFooter className="pt-4">
                                    <Button onClick={sendWhatsAppMessage}>
                                        <Send className="mr-2 h-4 w-4" />
                                        Send Message
                                    </Button>
                                </DialogFooter>
                            </div>
                        </DialogContent>
                    )}
                </Dialog>
            </div>
        </AdminLayout>
    );
}