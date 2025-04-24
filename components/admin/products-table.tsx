'use client'
import { ColumnDefinition, DataTable } from "@/components/ui/custom-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, Ban } from "lucide-react";
import { Product } from "@/lib/types";
import Link from "next/link";
import { Button } from "../ui/button";
import { useDeleteProductMutation, useGetAllCategoriesQuery, useGetAllProductsQuery } from "@/lib/rtk-client";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { useRouter } from "next/navigation";
import {setProduct} from "@/slices/update.product"
import { ProductTypes } from "@/utils/constant";
import { useToast } from "../ui/use-toast";

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {toast} = useToast();
  const {push} = useRouter();
  const {data: products, isFetching, refetch} = useGetAllProductsQuery();
  const [deleteProduct,{isLoading}] = useDeleteProductMutation();
  const { data: categories } = useGetAllCategoriesQuery();
  const handleDeleteProduct = async (id: string) => {
    const {error} = await deleteProduct({id});
    if(error){
      toast({
        title: "Product Deletion",
        description: "Product delete Successfully",
        variant: "success"
      })
    } else {
      toast({
        title: "Product Deletion",
        description: "Product not delete",
        variant: "destructive"
      })
    }
  }
  const getProductActions = (row: Product) => {
    const baseActions = [
      {
        id: "view",
        label: "View",
        icon: <Eye className="h-4 w-4" />,
        onClick: () => push(`/products/${row._id}`),
      },
      {
        id: "edit",
        label: "Edit",
        icon: <Edit className="h-4 w-4" />,
        onClick: () => {
          dispatch(setProduct(row));
          push('/admin/products/add?type=update');
        },
      },
      {
        id: "delete",
        label:"Delete",
        icon: <Trash2 className="h-4 w-4" />,
        onClick: () => handleDeleteProduct(row._id || ""),
      }
    ];

    return baseActions;
  };
  const productColumns: ColumnDefinition<Product>[] = [
    {
      key: "title",
      header: "Title",
      cell: (row) => row.title,
      filterType: "text",
    },
    {
      key: "short_description",
      header: "Short Description",
      cell: (row) => row.short_description,
    },
    {
      key: "price",
      header: "Price",
      cell: (row) => (<>{row.salePrice ? <><del>{row.price}</del><strong className="ml-2">{row.salePrice}</strong></> : <strong>{row.price}</strong>}</>),
      renderValue: (row) => row.salePrice || row.price,
    },
    {
      key: "type",
      header: "File Type",
      cell: (row) => <Badge variant="outline">{row.type}</Badge>,
      renderValue: (row) => row.type,
      filterType: "select",
      filterOptions: ProductTypes.map((fileDetails) => (
        { value: fileDetails.type, label: `${fileDetails.name}-${fileDetails.type}-${fileDetails.fileExtension}` }
      )),
    },
    {
      key: "category",
      header: "Category",
      cell: (row) => <Badge variant="outline">{row.category}</Badge>,
      renderValue: (row) => row.category,
      filterType: "select",
      filterOptions: categories?.length ? categories?.map((c) => ({
        label: c.name,
        value: c.name
      })) : [],
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => (
        <Badge
          className={
            row.status === "published"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
          }
        >
          {row.status}
        </Badge>
      ),
      renderValue: (row) => row.status,
      filterType: "select",
      filterOptions: [
        { value: "draft", label: "Draft" },
        { value: "published", label: "Published" },
      ],
    },
  ];
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Products</CardTitle>
          <CardDescription>Manage your digital products inventory.</CardDescription>
        </div>
        <Link onClick={() => {
          dispatch(setProduct(null))
        }} href="/admin/products/add">
          <Button>Add Product</Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="container mx-auto py-10">
          <DataTable<Product>
            data={isFetching ? [] : products || []}
            columns={productColumns}
            getActions={getProductActions}
            onRowClick={(row) => console.log("Row clicked", row)}
            loading={isFetching}
            refresh={refetch}
          />
        </div>
      </CardContent>
    </Card>
  );
}