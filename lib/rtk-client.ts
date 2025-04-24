// src/services/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BankAccount, Category, OrderType, Product, User } from './types'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/', // Points to your Next.js API routes
  }),
  tagTypes: ['getCategories','getProducts','getUsers','getBankAccounts', 'getAdminOrders'],
  endpoints: (builder) => ({
    getAllProducts: builder.query<Product, void>({
      query: () => ({
        url: "admin/product",
        method: "GET"
      }),
      providesTags: ['getProducts']
    }),
    updateProduct: builder.mutation<any, {id: string, data: Partial<Product>}>({
      query: ({id, data}) => ({
        url: `admin/product/${id}`,
        method: "PATCH",
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['getProducts']
    }),
    deleteProduct: builder.mutation<any, {id: string}>({
      query: ({id}) => ({
        url: `admin/product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['getProducts']
    }),
    getAllCategories: builder.query<Category[], void>({
      query: () => ({
        url: "admin/product/category",
        method: "GET"
      }),
      providesTags: ['getCategories']
    }),
    createCateory: builder.mutation<any, Category>({
      query: (data) => ({
        url: "admin/product/category",
        method: "POST",
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['getCategories']
    }),
    updateCateory: builder.mutation<any, {id: string, data: Partial<Category>}>({
      query: ({id, data}) => ({
        url: `admin/product/category/${id}`,
        method: "PATCH",
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['getCategories']
    }),
    deleteCategory: builder.mutation<any, {id: string}>({
      query: ({id}) => ({
        url: `admin/product/category/${id}`,
        method: "Delete",
      }),
      invalidatesTags: ['getCategories']
    }),
    getAllUsers: builder.query<User, void>({
      query: () => ({
        url: "admin/user",
        method: "GET"
      }),
      providesTags: ['getUsers']
    }),
    getPublicCategory: builder.query<Category[], void>({
      query: () => ({
        url: "public/product/category",
        method: "GET"
      }),
    }),
    getFeaturedProducts: builder.query<Product[], void>({
      query: () => ({
        url: "public/product/featured",
        method: "GET"
      }),
    }),
    getAllPublicProducts: builder.query<Product[], void>({
      query: () => ({
        url: "public/product",
        method: "GET"
      }),
    }),
    getPublicProductByID: builder.query<Product, string>({
      query: (id) => ({
        url: `public/product/${id}`,
        method: "GET"
      }),
    }),
    getBankAccounts: builder.query<BankAccount[], void>({
      query: () => ({
        url: `admin/accounts`,
        method: "GET"
      }),
      providesTags: ['getBankAccounts']
    }),
    createOrder: builder.mutation<any, OrderType>({
      query: (data) => ({
        url: "public/order",
        method: "POST",
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      // invalidatesTags: ['getCategories']
    }),
    createBankAccount: builder.mutation<any, BankAccount>({
      query: (data) => ({
        url: "admin/accounts",
        method: "POST",
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['getBankAccounts']
    }),
    deleteBankAccount: builder.mutation<any, string>({
      query: (id) => ({
        url: `admin/accounts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['getBankAccounts']
    }),
    getPublicBankAccountsAndOrder: builder.mutation<{
      order: OrderType,
      bankAccounts: BankAccount[]
    }, string>({
      query: (orderNumber) => ({
        url: `public/accounts/${orderNumber}`,
        method: "GET",
      }),
      // invalidatesTags: ['getBankAccounts']
    }),
    createAdminUser:  builder.mutation<any,User>({
      query: (data) => ({
        url: `admin/user`,
        method: "POST",
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['getUsers']
    }),
    updateAdminUserRole:  builder.mutation<any,{id: string, role: string}>({
      query: ({id, role}) => ({
        url: `admin/user/${id}`,
        method: "PATCH",
        body: {
          role: role
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['getUsers']
    }),
    deleteAdminUser:  builder.mutation<any,string>({
      query: (id) => ({
        url: `admin/user/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ['getUsers']
    }),
    getAdminOrders: builder.query<{success: boolean, data: OrderType[]}, void>({
      query: () => ({
        url: `admin/orders`,
        method: "GET"
      }),
      providesTags: ['getAdminOrders'],
      transformResponse: (res) => res?.data || []
    }),
    updateAdminOrder:  builder.mutation<any,{id: string, paymentStatus: string}>({
      query: ({id, paymentStatus}) => ({
        url: `admin/orders/${id}`,
        method: "PATCH",
        body: {
          paymentStatus: paymentStatus
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['getAdminOrders']
    }),
  }),
})

export const { useGetAllProductsQuery, useCreateCateoryMutation, useGetAllCategoriesQuery, useUpdateCateoryMutation, useDeleteCategoryMutation, useUpdateProductMutation, useGetAllUsersQuery, useGetPublicCategoryQuery, useGetFeaturedProductsQuery, useDeleteProductMutation, useGetAllPublicProductsQuery, useGetPublicProductByIDQuery, useCreateOrderMutation, useGetBankAccountsQuery, useCreateBankAccountMutation, useDeleteBankAccountMutation, useGetPublicBankAccountsAndOrderMutation, useCreateAdminUserMutation, useUpdateAdminUserRoleMutation, useDeleteAdminUserMutation, useGetAdminOrdersQuery, useUpdateAdminOrderMutation } = api;