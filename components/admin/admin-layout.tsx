"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Package, Settings, ShoppingCart, Users, LogOut, Menu, X, TypeIcon, ChartBarStacked, Landmark } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data, status } = useSession();
  const isLoading = status === "loading"
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Mobile sidebar toggle */}
      {!isSidebarOpen && (
        <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 md:hidden" onClick={toggleSidebar}>
          <Menu className="h-6 w-6" />
        </Button>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:h-screen",
          isSidebarOpen ? "translate-x-0 z-50" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex h-14 items-center justify-between border-b px-4">
            <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
              <Package className="h-6 w-6" />
              <span>Admin Panel</span>
            </Link>
            <div>
              <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>

          <nav className="flex-1 overflow-auto py-4 px-2">
            <div className="space-y-1">
              <Link href="/admin/dashboard">
                <Button variant="ghost" className="w-full justify-start">
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/admin/products">
                <Button variant="ghost" className="w-full justify-start">
                  <Package className="mr-2 h-4 w-4" />
                  Products
                </Button>
              </Link>
              <Link href="/admin/products/category">
                <Button variant="ghost" className="w-full justify-start">
                  <ChartBarStacked className="mr-2 h-4 w-4" />
                  Products Categories
                </Button>
              </Link>
              {/* <Link href="/admin/products/types">
                <Button variant="ghost" className="w-full justify-start">
                  <TypeIcon className="mr-2 h-4 w-4" />
                  Products Types
                </Button>
              </Link> */}
              <Link href="/admin/orders">
                <Button variant="ghost" className="w-full justify-start">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Orders
                </Button>
              </Link>
              <Link href="/admin/user">
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Customers
                </Button>
              </Link>
              <Link href="/admin/accounts">
                <Button variant="ghost" className="w-full justify-start">
                  <Landmark className="mr-2 h-4 w-4" />
                  Payments Accounts
                </Button>
              </Link>
              {/* <Link href="/admin/analytics">
                <Button variant="ghost" className="w-full justify-start">
                  <BarChart className="mr-2 h-4 w-4" />
                  Analytics
                </Button>
              </Link> */}
            </div>
          </nav>

          <div className="border-t p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                {isLoading ? (
                  <span>Loading...</span>
                ) : (
                  <>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                      <span className="font-medium text-primary text-sm">{data?.user?.name && data?.user?.name[0]?.toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{data?.user?.name}</p>
                      <p className="text-xs text-muted-foreground">{data?.user?.email}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <Link href="/admin/settings">
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col w-[100%]">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 md:px-6">
          <div className="hidden md:block font-semibold">Admin Dashboard</div>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              View Store
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

