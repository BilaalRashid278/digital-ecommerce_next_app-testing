"use client"
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useGetFeaturedProductsQuery } from "@/lib/rtk-client"
import { motion } from "framer-motion"
import ProductCard, { ProductSkeleton } from "./product-card"

export default function FeaturedProducts() {
  const { data: featuredProducts, isFetching } = useGetFeaturedProductsQuery();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState<boolean>(false);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const checkScrollable = () => {
    if (scrollContainerRef.current) {
      const { scrollWidth, clientWidth } = scrollContainerRef.current;
      setIsScrollable(scrollWidth > clientWidth);
    }
  };

  useEffect(() => {
    checkScrollable(); // Check on mount
    window.addEventListener("resize", checkScrollable); // Re-check on resize
    return () => window.removeEventListener("resize", checkScrollable);
  }, [featuredProducts]);

  return (
    <section className="py-16 container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Featured Products</h2>
        <Button asChild variant="outline">
          <Link href="/products">View All</Link>
        </Button>
      </div>

      <div className="relative group">
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-opacity duration-200"
          style={{ display: isScrollable ? "block" : "none" }}
        >
          <ChevronLeft className="h-6 w-6 text-gray-800" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide w-full px-2"
          style={{
            scrollbarWidth: 'none', // For Firefox
            msOverflowStyle: 'none', // For IE
          }}
        >
          {featuredProducts?.length &&
            featuredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex-shrink-0 snap-center"
              >
                <ProductCard cardClasess="w-80" product={product} loading={isFetching} />
              </motion.div>
            ))}
          {isFetching && [1, 2, 3, 4, 5].map(() => (
            <ProductSkeleton classes="min-w-[300px]"/>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-opacity duration-200"
          style={{ display: isScrollable ? "block" : "none" }}
        >
          <ChevronRight className="h-6 w-6 text-gray-800" />
        </button>
      </div>
    </section>
  );
}
