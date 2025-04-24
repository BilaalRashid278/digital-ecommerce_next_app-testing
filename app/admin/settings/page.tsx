// app/(admin)/website-info/page.tsx
"use client"

import { useForm } from "react-hook-form"
import { Label } from "@radix-ui/react-label"
import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type WebsiteInfo = {
  title: string
  description: string
  keywords: string
  favicon: string
  logo: string
  footerName: string
  contactEmail: string
  phoneNumber: string
  address: string
}

async function fetchWebsiteInfo() {
  try {
    const res = await fetch(`/api/public/website-info`, {
    })

    if (!res.ok) throw new Error("Failed to fetch website info")
    const data = await res.json()
    return data?.data || {}
  } catch (error) {
    console.error("Error fetching website info:", error)
    return null
  }
}

export default function Settings() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<WebsiteInfo>()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const onSubmit = async (data: WebsiteInfo) => {
    setLoading(true)
    setMessage("")

    const payload = {
      ...data,
      keywords: data.keywords.split(",").map(k => k.trim()),
    }

    try {
      const res = await fetch("/api/admin/website-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await res.json()
      if (res.ok) {
        setMessage("✅ Website info updated successfully!")
      } else {
        setMessage("❌ Error: " + (result?.error?.[0]?.message || "Something went wrong"))
      }
    } catch (error) {
      console.error(error)
      setMessage("❌ Submission failed.")
    } finally {
      setLoading(false)
    }
  }
  const handleWEbsiteInfo = async () => {
    const data = await fetchWebsiteInfo();
    console.log(data,'data');
    Object.keys(data).map((key) => {
      // console.log(value, 'value');
      if(key === "keywords") {
        setValue(key, String(data[key]?.reduce((acc: any, current: any) => `${acc ? `${acc},${current}` : current}`, "")))
      } else setValue(key, data[key]);
    })
  }

  useEffect(() => {
    handleWEbsiteInfo();
  }, []);

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg mt-3">
        <h2 className="text-3xl font-bold mb-6">📝 Website Info Settings</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-2">

          {[
            { name: "title", label: "Website Title" },
            { name: "description", label: "Description" },
            { name: "keywords", label: "Keywords (comma separated) like a,b,c,d" },
            { name: "favicon", label: "Favicon URL", type: "url" },
            { name: "logo", label: "Business Logo (100x100 pixels) / Name" },
            { name: "footerName", label: "Show Business Name OR Your Name In Footer" },
            { name: "contactEmail", label: "Contact Email", type: "email" },
            { name: "phoneNumber", label: "Phone Number" },
            { name: "address", label: "Address", classes: "col-span-2" },
          ].map(({ name, label, type = "text", classes }) => (
            <div key={name} className={classes ? classes : "col-span-2 md:col-span-1"}>
              <Label htmlFor={name} className="block text-sm font-medium mb-1">{label}</Label>
              <Input
                id={name}
                type={type}
                {...register(name as keyof WebsiteInfo, { required: `${label} is required` })}
              />
              {errors[name as keyof WebsiteInfo] && (
                <p className="text-sm text-red-500">{errors[name as keyof WebsiteInfo]?.message}</p>
              )}
            </div>
          ))}

          <Button
            type="submit"
            disabled={loading}
            className="col-span-2"
          >
            {loading ? "Saving..." : "Save Information"}
          </Button>

          {message && <p className="mt-4 text-sm">{message}</p>}
        </form>
      </div>
    </AdminLayout>
  )
}
