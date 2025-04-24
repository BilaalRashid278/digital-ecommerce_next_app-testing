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
import AdminLayout from '@/components/admin/admin-layout';
import { useCreateCateoryMutation, useDeleteCategoryMutation, useGetAllCategoriesQuery, useUpdateCateoryMutation } from '@/lib/rtk-client';
import { Category } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ColumnDefinition, DataTable } from '@/components/ui/custom-table';
import { DynamicIcon } from '@/components/ui/DynamicIcon';


const productColumns: ColumnDefinition<Category>[] = [
  {
    key: "icon",
    header: "Icon",
    cell: (row) => <DynamicIcon name={row.icon} />,
    renderValue: (row) => row.icon
  },
  {
    key: "name",
    header: "Name",
    cell: (row) => row.name,
  },
  {
    key: "description",
    header: "Description",
    cell: (row) => row.description,
  },
  {
    key: "color",
    header: "Color",
    cell: (row) => <div style={{backgroundColor: row.color, width: "20px", height: "20px", borderRadius: "50%"}}/>,
    renderValue: (row) => row.color,
  },
  {
    key: "slug",
    header: "Slug",
    cell: (row) => row.slug,
  },
  {
    key: "createdAt",
    header: "Creation Date",
    cell: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : row.createdAt,
  },
];



export default function ProductCategories() {
  const { toast } = useToast();
  const [createCategory, { isLoading }] = useCreateCateoryMutation();
  const { data: categories, isFetching, refetch } = useGetAllCategoriesQuery();
  const [deleteCategory, {isLoading: deleteCategoryLoading}] = useDeleteCategoryMutation();
  const [updateCategory, {isLoading:updateCategoryLoading}] = useUpdateCateoryMutation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  const form = useForm<Category>({
    defaultValues: {
      name: "",
      slug: "",
      icon: "",
      description: "",
      color: "",
    },
  });

  const handleOpenDialog = (category: Category | null) => {
    setCurrentCategory(category);
    if (category) {
      form.reset(category);
    } else {
      form.reset({
        name: "",
        slug: "",
        icon: "",
        description: "",
        color: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (values: Category) => {
    if(currentCategory) {
      try {
        const { error } = await updateCategory({id: currentCategory._id || "", data: values});
        if (!error) {
          toast({
            title: "Category Updation",
            description: "Category update successfully",
            variant: "success"
          })
          setCurrentCategory(null);
        } else {
          toast({
            title: "Category Creation",
            description: "Category not updated",
            variant: "destructive"
          })
        }
      } catch (error) {
        toast({
          title: "Category Creation",
          description: "Category not updated",
          variant: "destructive"
        })
      }
    } else {
      try {
        const { error } = await createCategory(values);
        if (!error) {
          toast({
            title: "Category Creation",
            description: "Category create successfully",
            variant: "success"
          })
        } else {
          toast({
            title: "Category Creation",
            description: "Category not created",
            variant: "destructive"
          })
        }
      } catch (error) {
        toast({
          title: "Category Creation",
          description: "Category not created",
          variant: "destructive"
        })
      }
    }
    setIsDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await deleteCategory({id});
      if (!error) {
        toast({
          title: "Category Deleted",
          description: "Category deleted successfully",
          variant: "success"
        })
      } else toast({
        title: "Category",
        description: "Category not delete",
        variant: "destructive"
      })
    } catch (error) {
      toast({
        title: "Category",
        description: "Category not delete",
        variant: "destructive"
      })
    }
    setIsDialogOpen(false);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const getProductActions = (row: Category) => {
    const baseActions = [
      {
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
      }
    ];

    return baseActions;
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Product Categories</h2>
          <Button onClick={() => handleOpenDialog(null)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>

        <DataTable<Category>
          data={isFetching ? [] : categories || []}
          columns={productColumns}
          getActions={getProductActions}
          onRowClick={(row) => console.log("Row clicked", row)}
          loading={isFetching}
          refresh={refetch}
        />

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {currentCategory ? "Edit Category" : "Add New Category"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter category name"
                          onChange={(e) => {
                            field.onChange(e);
                            form.setValue('slug', generateSlug(e.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Description</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter category name"
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Color</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter category color"
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                          type='color'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Category slug" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter icon name"
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit">
                    <Check className="mr-2 h-4 w-4" />
                    {currentCategory ? updateCategoryLoading ? 'Updating...' : 'Update' : `${isLoading ? 'Creating...' : 'Create'}`}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
