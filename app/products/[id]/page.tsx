"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Play, ChevronLeft, ChevronRight, X } from "lucide-react"
import Link from "next/link"
import { useGetPublicProductByIDQuery } from "@/lib/rtk-client"
import ProductDetailSkeleton from "@/components/product-detail-skeleton"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import AccessButton from "@/components/access-button"

// Preview Images Component
function PreviewImages({
  images,
  onClose
}: {
  images: string[],
  onClose: () => void
}) {
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0)

  const handleNext = () => {
    setCurrentPreviewIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    )
  }

  const handlePrev = () => {
    setCurrentPreviewIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    )
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300"
      >
        <X className="h-8 w-8" />
      </button>

      <div className="relative max-w-4xl w-full">
        <motion.img
          key={currentPreviewIndex}
          src={images[currentPreviewIndex]}
          alt="Preview"
          className="w-full max-h-[80vh] object-contain rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />

        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { data: product, isFetching } = useGetPublicProductByIDQuery(params.id || "");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  if (isFetching) return <ProductDetailSkeleton />

  const handleNextImage = () => {
    setIsHovering(false);
    if (!product?.images) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    setIsHovering(false);
    if (!product?.images) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="mb-6">
            <Link href="/products" className="text-primary hover:underline mb-4 inline-block">
              ← Back to Products
            </Link>
            <h1 className="text-3xl font-bold mb-2">{product?.title}</h1>
            <div className="flex items-center gap-4 mb-4">
              <Badge>{product?.type}</Badge>
              <Badge variant="outline">{product?.category}</Badge>
            </div>
          </div>

          {/* Image Carousel */}
          <div
            className="relative rounded-lg overflow-hidden mb-8 aspect-video"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <motion.img
              src={product?.images[currentImageIndex] || "/placeholder.svg"}
              alt={product?.title}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />

            {/* Preview Button - appears on hover */}
            {isHovering && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-black/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Button
                  size="lg"
                  onClick={() => setShowPreview(true)}
                >
                  Preview
                </Button>
              </motion.div>
            )}

            {/* Navigation buttons - only show if multiple images */}
            {product?.images && product.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full"
                  onClick={handlePrevImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full"
                  onClick={handleNextImage}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>

          {/* Rest of your existing code... */}

          <Tabs defaultValue="description" className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="whitespace-pre-line">{product?.description}</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="features" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    {product?.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="requirements" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    {product?.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="w-5 h-5 text-primary mr-2 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {product?.preview && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Preview</h2>
              <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
                <img
                  src={product?.preview || "/placeholder.svg"}
                  alt="Course Preview"
                  className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button size="lg" className="rounded-full w-16 h-16 flex items-center justify-center">
                    <Play className="h-8 w-8" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:w-1/3">
          <div className="sticky top-20">
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  {product?.salePrice ? (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="font-bold text-2xl">{product?.salePrice}<small>PKR</small></span>
                      <del className="font-bold text-md">{product?.price}<small>PKR</small></del>
                    </div>
                  ) : (
                    <span className="font-bold text-2xl mt-2">{product?.price}<small>PKR</small></span>
                  )}
                  <Badge variant="outline" className="text-green-600 bg-green-100 dark:bg-green-900/30">
                    Premium Quality
                  </Badge>
                </div>

                <div className="space-y-4 mb-6">
                  <AccessButton classes="w-full" product={product || null}/>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">This purchase includes:</h3>
                  <ul className="space-y-2">
                    {product?.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">{product?.short_description || ""}</h3>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && product?.images && (
          <PreviewImages
            images={product.images}
            onClose={() => setShowPreview(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}