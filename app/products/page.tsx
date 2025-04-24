"use client"
import { useEffect, useState, Suspense } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { useGetAllPublicProductsQuery, useGetPublicCategoryQuery } from "@/lib/rtk-client"
import ProductCard, { ProductSkeleton } from "@/components/product-card"
import { Product } from "@/lib/types";
import { ProductTypes } from "@/utils/constant";
import { useSearchParams } from "next/navigation"

function ProductsPage() {
  const searchParams = useSearchParams();
  const paramsFilter = searchParams.get("type");
  const [Filters, setFilters] = useState<string[]>(paramsFilter ? [paramsFilter] : []);
  const { data: productsData, isFetching } = useGetAllPublicProductsQuery();
  const { data: categories, isFetching: categoryLoading } = useGetPublicCategoryQuery();
  const [products, setProducts] = useState<Product[] | null>(null);
  const hanldeFilter = (name: string) => {
    const included = Filters.includes(name);
    if (included) {
      const filtered = Filters.filter((filter) => filter !== name);
      setFilters(filtered);
    } else setFilters([...Filters, name]);
  };

  useEffect(() => {
    if (Filters.length) {
      const filtered = productsData?.filter((product) => Filters.includes(product.category) || Filters.includes(product.type));
      setProducts(filtered || []);
    } else setProducts(productsData || null);
    () => {
      setFilters([]);
    }
  }, [Filters, categories, productsData]);
  return (
    <Suspense>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">All Products</h1>
            <p className="text-muted-foreground">Browse our collection of premium digital products</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="category">
                  <AccordionTrigger>Categories</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {categoryLoading ? <p>Loading...</p> : categories?.map((category, idx: number) => (
                        <div id={category._id} onClick={() => hanldeFilter(category.name)} key={category._id} className="flex items-center space-x-2">
                          <Checkbox checked={Filters.includes(category.name)} />
                          <label
                            htmlFor={category._id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {category.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="type">
                  <AccordionTrigger>Product Type</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {ProductTypes?.map((type, idx: number) => (
                        <div id={type.type} onClick={() => hanldeFilter(type.type)} key={type.type} className="flex items-center space-x-2">
                          <Checkbox checked={Filters.includes(type.type)} />
                          <label
                            htmlFor={type.type}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {type.type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="mt-6">
                <Button onClick={() => setFilters([])} className="w-full mt-2">
                  Reset (<span>{Filters.length}</span>) Filters
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className={`grid grid-cols-1 ${isFetching ? "sm:grid-cols-2 xl:grid-cols-3 gap-6" : products && products?.length ? "sm:grid-cols-2 xl:grid-cols-3 gap-6" : ""}`}>
              {!isFetching && products && products?.length < 1 ? (
                <div className="flex justify-center items-center flex-col">
                  <div className="text-center text-red-500 my-2 font-semibold">
                    Products Not Found
                  </div>
                  {Filters.length > 0 && <div className="mt-3">
                    <Button onClick={() => setFilters([])} className="w-full mt-2">
                      Reset (<span>{Filters.length}</span>) Filters
                    </Button>
                  </div>}
                </div>
              ) : products?.map((product) => (
                <ProductCard  cardClasess="w-full xl:w-80" loading={isFetching} key={product._id} product={product} />
              ))}
              {isFetching && [1, 2, 3, 4, 5, 6].map(() => (<ProductSkeleton classes="w-full xl:w-80" />))}
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  )
}

export default function productParamsPage() {
    return (
      <Suspense>
        <ProductsPage/>
      </Suspense>
    )
}

