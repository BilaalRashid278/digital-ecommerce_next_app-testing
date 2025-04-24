"use client"
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Key } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Product } from "@/lib/types";
import AccessButton from "./access-button";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/store/store";

export default React.memo(function ProductCard({ product, loading, cardClasess }: { product?: Product; loading: boolean, cardClasess: string }) {
  // const dispatch = useDispatch<AppDispatch>();
  // const selectedProduct = useSelector<RootState>(state => state.selectedProduct);
  const [currentImage, setCurrentImage] = useState(0);
  const totalImages = product?.images?.length || 1;

  // Auto-slide images
  useEffect(() => {
    if (!loading && totalImages > 1) {
      const interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % totalImages);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [totalImages, loading]);

  return (
    <Card className={`${cardClasess} h-full flex flex-col overflow-hidden group-hover:shadow-lg transition-shadow duration-300`}>
      <div className="relative overflow-hidden">
        {/* Image Slider */}
        <motion.img
          key={product?.images[currentImage] || "/placeholder.svg"}
          src={product?.images[currentImage] || "/placeholder.svg"}
          alt={product?.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />

        {/* Image Navigation Dots */}
        {product?.images && product?.images?.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 bg-black/50 px-2 py-1 rounded-full">
            {product?.images.map((_, idx) => (
              <div key={idx} onClick={() => {
                setCurrentImage(idx);
              }} className="w-2 h-2 rounded-full bg-gray-400"></div>
            ))}

            {/* Animated Active Dot */}
            <motion.div
              className="w-2 h-2 rounded-full bg-white absolute"
              initial={false}
              animate={{ x: currentImage * 12 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          </div>
        )}

        <Badge className="absolute top-2 right-2">{product?.category}</Badge>
      </div>

      <CardHeader className="pb-2">
        <h3 className="font-semibold text-lg">{product?.title}</h3>
      </CardHeader>

      <CardContent className="pb-2 flex-grow">
        <p className="text-muted-foreground text-sm">{product?.description.slice(0, 50)}</p>
        {product?.salePrice ? (
          <div className="mt-2 flex items-center gap-2">
            <del className="font-bold text-sm">{product?.price}<small>PKR</small></del>
            <span className="font-bold text-lg">{product?.salePrice}<small>PKR</small></span>
          </div>
        ) : (
          <span className="font-bold text-lg mt-2">{product?.price}<small>PKR</small></span>
        )}
      </CardContent>

      <CardFooter className="flex gap-2 justify-between items-center pt-2">
        <Link href={`/products/${product?._id}`}>
          <Button size="sm" className="grow" variant="outline">
            <Eye className="h-4 w-4" />
            View
          </Button>
        </Link>
        <AccessButton classes="grow" product={product || null}/>
      </CardFooter>
    </Card>
  );
})



export const ProductSkeleton = React.memo(({ classes }: { classes?: string }) => (
  <div className={`${classes} h-[350px] bg-gray-200 animate-pulse rounded-lg flex flex-col`}>
    {/* Image Skeleton */}
    <div className="h-48 w-full bg-gray-300"></div>

    {/* Title Skeleton */}
    <div className="p-4">
      <div className="h-4 bg-gray-400 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-300 rounded w-5/6"></div>
    </div>

    {/* Price & Buttons Skeleton */}
    <div className="p-4 flex justify-between items-center">
      <div className="h-5 bg-gray-400 rounded w-16"></div>
      <div className="flex gap-2">
        <div className="h-8 w-8 bg-gray-400 rounded-full"></div>
        <div className="h-8 w-8 bg-gray-400 rounded-full"></div>
      </div>
    </div>
  </div>
));

