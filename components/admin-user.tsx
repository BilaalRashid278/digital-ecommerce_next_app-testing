'use client'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Edit, Trash2, Plus, X, Check } from "lucide-react";
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import {
    useCreateAdminUserMutation,
    useDeleteAdminUserMutation,
    useGetAllUsersQuery,
    useUpdateAdminUserRoleMutation,
} from '@/lib/rtk-client';
import { User } from '@/lib/types';
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

const userColumns: ColumnDefinition<User>[] = [
    {
        key: "name",
        header: "Name",
        cell: (row) => row.name,
        filterType: "text",
    },
    {
        key: "email",
        header: "Email",
        cell: (row) => row.email,
        filterType: "text",
    },
    {
        key: "phoneNumber",
        header: "Phone Number",
        cell: (row) => row.phoneNumber,
        filterType: "text",
    },
    {
        key: "role",
        header: "Role",
        cell: (row) => row.role,
        filterType: "select",
        filterOptions: [
            { value: "admin", label: "Admin" },
            { value: "user", label: "User" },
            { value: "blocked", label: "Blocked" },
        ]
    },
    {
        key: "createdAt",
        header: "Creation Date",
        cell: (row) => moment.utc(row.createdAt).format('YYYY-MM-DD'),
        filterType: "date",
    },
];

export default function AdminUserManagement() {
    const { toast } = useToast();
    const [createUser, { isLoading }] = useCreateAdminUserMutation();
    const { data: users, isFetching, refetch } = useGetAllUsersQuery();
    const [deleteUser, { isLoading: deleteUserLoading }] = useDeleteAdminUserMutation();
    const [updateUser, { isLoading: updateUserLoading }] = useUpdateAdminUserRoleMutation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const form = useForm<User>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            phoneNumber: "",
            role: "user",
        },
    });

    const handleOpenDialog = (user: User | null) => {
        setCurrentUser(user);
        if (user) {
            form.reset(user);
        } else {
            form.reset({
                name: "",
                email: "",
                password: "",
                role: "user",
            });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async (values: User) => {
        if (currentUser) {
            try {
                const { error, data } = await updateUser({ id: currentUser._id || "", role: values.role });
                if (!error) {
                    toast({
                        title: "User Updated",
                        description: data.message,
                        variant: "success"
                    })
                    setCurrentUser(null);
                } else {
                    toast({
                        title: "User Update Failed",
                        description: error.message,
                        variant: "destructive"
                    })
                }
            } catch (error) {
                toast({
                    title: "User Update Failed",
                    description: error.message,
                    variant: "destructive"
                })
            }
        } else {
            try {
                const { error, data } = await createUser(values);
                if (!error) {
                    toast({
                        title: "User Created",
                        description: data?.message,
                        variant: "success"
                    })
                } else {
                    toast({
                        title: "User Creation Failed",
                        description: error?.message,
                        variant: "destructive"
                    })
                }
            } catch (error) {
                toast({
                    title: "User Creation Failed",
                    description: error?.message,
                    variant: "destructive"
                })
            }
        }
        setIsDialogOpen(false);
    };

    const handleDelete = async (id: string) => {
        try {
            const { error, data } = await deleteUser(id);
            if (!error) {
                toast({
                    title: "User Deleted",
                    description: data.message,
                    variant: "success"
                })
            } else toast({
                title: "User Deletion Failed",
                description: error.message,
                variant: "destructive"
            })
        } catch (error) {
            toast({
                title: "User Deletion Failed",
                description: error.message,
                variant: "destructive"
            })
        }
        setIsDialogOpen(false);
    };

    const getUserActions = (row: User) => {
        const baseActions = row.role === 'admin' ? [{
            id: "edit",
            label: "Edit",
            icon: <Edit className="h-4 w-4" />,
            onClick: () => handleOpenDialog(row),
        },] : [{
            id: "edit",
            label: "Edit",
            icon: <Edit className="h-4 w-4" />,
            onClick: () => handleOpenDialog(row),
        },
        {
            id: 'delete',
            label: "Delete",
            icon: <Trash2 className="h-4 w-4" />,
            onClick: () => handleDelete(row._id || ''),
        }]

        return baseActions;
    };

    return (
        <div className="space-y-6 p-5">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Customer Management</h2>
                <Button onClick={() => handleOpenDialog(null)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Customer
                </Button>
            </div>

            <DataTable<User>
                data={isFetching ? [] : users || []}
                columns={userColumns}
                getActions={getUserActions}
                onRowClick={(row) => console.log("Row clicked", row)}
                loading={isFetching}
                refresh={refetch}
            />

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {currentUser ? "Edit User" : "Add New User"}
                        </DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                            {!currentUser && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Enter user name"
                                                        disabled={!!currentUser}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Enter user email"
                                                        type="email"
                                                        disabled={!!currentUser}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="phoneNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl>
                                                    <PhoneInput
                                                        placeholder="Enter phone number"
                                                        defaultCountry="PK"
                                                        {...field}
                                                        disabled={isLoading}
                                                        className="input w-full rounded-md border px-3 py-2 text-sm shadow-sm"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Enter user password"
                                                        type="password"
                                                        disabled={!!currentUser}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}

                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="user">User</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                                <SelectItem value="blocked">Blocked</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button type="submit">
                                    <Check className="mr-2 h-4 w-4" />
                                    {currentUser ? updateUserLoading ? 'Updating...' : 'Update' : `${isLoading ? 'Creating...' : 'Create'}`}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}