"use client"

import type React from "react"
import { useMemo, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import AdminLayout from "@/components/admin/admin-layout"
import { Product } from "@/lib/types"
import Link from "next/link"
import { useGetAllCategoriesQuery, useUpdateProductMutation } from "@/lib/rtk-client"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store/store"
import { setProduct } from "@/slices/update.product"
import { useToast } from "@/hooks/use-toast"
import { ProductTypes } from "@/utils/constant"

type postType = 'draft' | 'published';

export default function AddProductPage() {
  const {toast} = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const updateProduct = useSelector<RootState>(state => state.updateProduct);
  const { data: categories, isFetching } = useGetAllCategoriesQuery();
  const [updateProductMethod, {isLoading: productUpdateLoading}] = useUpdateProductMutation();
  const [product, setProductData] = useState<Partial<Product>>(updateProduct || {
    images: [],
    requirements: [],
    features: [],
    status: "draft",
    rating: 0,
    review: 0
  });

  const productData = useMemo<Partial<Product>>(() => product,[product, updateProduct]);

  const [newRequirement, setNewRequirement] = useState("")
  const [newFeature, setNewFeature] = useState("")
  const [enableSale, setEnableSale] = useState(product.salePrice ? true : false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [postData,setPostData] = useState<postType | null>(null);

  // Add image URL to array
  const addImageUrl = () => {
    if (newImageUrl.trim() && isValidUrl(newImageUrl)) {
      setProductData(prev => ({
        ...prev,
        images: [...(prev.images || []), newImageUrl.trim()]
      }));
      setNewImageUrl("");
    }
  };

  // Simple URL validation
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Remove image URL
  const removeImageUrl = (index: number) => {
    setProductData(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index)
    }));
  };

  const handleSalePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || undefined
    setProductData(prev => ({ ...prev, salePrice: value }))
  }
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || undefined
    setProductData(prev => ({ ...prev, price: value }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProductData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: any) => {
    setProductData((prev) => ({ ...prev, [name]: value }))
  }

  const addArrayItem = (field: keyof Product, value: string) => {
    if (!value.trim()) return
    setProductData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[] || []), value]
    }))
    if (field === 'requirements') setNewRequirement("")
    if (field === 'features') setNewFeature("")
  }

  const removeArrayItem = (field: keyof Product, index: number) => {
    setProductData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (type: postType) => {
    const payload = {
      ...productData,
      status: type,
    }
    setPostData(type);
    if(productData._id){
      try {
        const {error} = await updateProductMethod({
          id: productData._id,
          data: payload
        });
        if(!error) {
          toast({
            title: "Product Updation",
            description: "Product update successfull",
            variant: "success"
          })
        } else toast({
          title: "Product Updation",
          description: "Product not update",
          variant: "destructive"
        });
      } catch (error) {
        toast({
          title: "Product Updation",
          description: "Product not update",
          variant: "destructive"
        });
      } finally {
        setPostData(null);
      }
      return;
    }
    try {
      const res = await fetch("/api/admin/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      });
      if(res.ok) {
        toast({
          title: "Product Creation",
          description: "Product create successfull",
          variant: "success"
        })
      } else toast({
        title: "Product Creation",
        description: "Product not create",
        variant: "destructive"
      });
    } catch (error) {
      toast({
        title: "Product Creation",
        description: "Product not create",
        variant: "destructive"
      });
    } finally {
      setPostData(null);
    }
  }

  // useEffect(() => {
  //   return () => {
  //     if(productData._id){
  //       dispatch(setProduct(null));
  //     }
  //   }
  // },[dispatch])
  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link onClick={() => {
              if(productData._id){
                dispatch(setProduct(null));
              }
            }} href="/admin/products">
              <Button size="sm">
                <ArrowLeft/>
              </Button>
            </Link>
            <h2 className="text-xl md:text-3xl font-bold tracking-tight">
              {productData._id ? "Edit Product" : "Add New Product"}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                handleSubmit('draft');
              }}
            >
              {postData === 'draft' ? 'Drafting...' : 'Save as Draft'}  
            </Button>
            <Button
              onClick={() => {
                handleSubmit('published');
              }}
            >
              {postData === 'published' ? 'Publishing...' : 'Publish Product'} 
            </Button>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>Basic information about your product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Product Title*</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter product title"
                    value={productData?.title || ""}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="short_description">Short Description*</Label>
                  <Textarea
                    id="short_description"
                    name="short_description"
                    placeholder="Enter product short description"
                    rows={5}
                    value={productData?.short_description || ""}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Long Description*</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter product long description"
                    rows={5}
                    value={productData?.description || ""}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Product Type*</Label>
                    <Select
                      onValueChange={(value) => handleSelectChange("type", value)}
                      value={productData?.type || ""}
                      required
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {ProductTypes.map((fileDetails) => (
                          <SelectItem value={fileDetails.type}>{fileDetails.name}-{fileDetails.type}-{fileDetails.fileExtension}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category*</Label>
                    <Select
                      onValueChange={(value) => handleSelectChange("category", value)}
                      // value={productData?.category || ""}
                      defaultValue={productData?.category || ""}
                      required
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category._id} value={category.name}>{category.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructor">Instructor/Author</Label>
                  <Input
                    id="instructor"
                    name="instructor"
                    placeholder="Enter instructor or author name"
                    value={productData?.instructor || ""}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Media</CardTitle>
                <CardDescription>Add product image URLs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Image URLs</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://example.com/image.jpg"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      type="url"
                    />
                    <Button
                      type="button"
                      onClick={addImageUrl}
                      disabled={!newImageUrl.trim() || !isValidUrl(newImageUrl)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {!isValidUrl(newImageUrl) && newImageUrl && (
                    <p className="text-sm text-destructive">Please enter a valid URL</p>
                  )}

                  {productData.images && productData.images.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {productData.images.map((url, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 overflow-hidden rounded-md border">
                              <img
                                src={url}
                                alt={`Product image ${index + 1}`}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100'
                                }}
                              />
                            </div>
                            <span className="text-sm truncate max-w-[180px] md:max-w-xs">{url}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeImageUrl(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Preview URL (single) */}
                <div className="space-y-2">
                  <Label htmlFor="preview">Preview URL</Label>
                  <Input
                    id="preview"
                    name="preview"
                    placeholder="https://example.com/preview.mp4"
                    value={productData?.preview || ""}
                    onChange={handleChange}
                    type="url"
                  />
                </div>

                {/* Sample URL (single) */}
                <div className="space-y-2">
                  <Label htmlFor="sampleUrl">Sample URL</Label>
                  <Input
                    id="sampleUrl"
                    name="sampleUrl"
                    placeholder="https://example.com/sample.pdf"
                    value={productData?.sampleUrl || ""}
                    onChange={handleChange}
                    type="url"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>


          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>Features and requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Features</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a feature"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                    />
                    <Button
                      type="button"
                      onClick={() => addArrayItem('features', newFeature)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {productData.features && productData.features.length > 0 && (
                    <ul className="space-y-2 mt-2">
                      {productData.features.map((feature, index) => (
                        <li key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                          <span>{feature}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removeArrayItem('features', index)}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Requirements</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a requirement"
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                    />
                    <Button
                      type="button"
                      onClick={() => addArrayItem('requirements', newRequirement)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {productData.requirements && productData.requirements.length > 0 && (
                    <ul className="space-y-2 mt-2">
                      {productData.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                          <span>{requirement}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removeArrayItem('requirements', index)}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
                <CardDescription>Set your product pricing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price*</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={productData?.price || ""}
                    onChange={handlePriceChange}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is-featured"
                    checked={productData?.featured || false}
                    onCheckedChange={(checked) => handleSelectChange('featured',checked)}
                  />
                  <Label htmlFor="is-featured">Is Featured Product</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="enable-sale"
                    checked={enableSale}
                    onCheckedChange={(checked) => setEnableSale(checked)}
                  />
                  <Label htmlFor="enable-sale">Enable Sale Price</Label>
                </div>



                {enableSale && (
                  <div className="space-y-2">
                    <Label htmlFor="salePrice">Sale Price*</Label>
                    <Input
                      id="salePrice"
                      name="salePrice"
                      type="number"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      value={productData?.salePrice || ""}
                      onChange={handleSalePriceChange}
                      required={enableSale}
                    />
                    {productData?.price && productData.salePrice && (
                      <p className="text-sm text-muted-foreground">
                        Discount: {Math.round((1 - productData.salePrice / productData.price) * 100)}%
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}