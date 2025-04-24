import React from 'react'
import AdminLayout from '@/components/admin/admin-layout'
import ProductsTable from "@/components/admin/products-table"

const Product = () => {
  return (
    <AdminLayout>
        <ProductsTable/>
    </AdminLayout>
  )
}

export default Product
