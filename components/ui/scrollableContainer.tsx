"use client"
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useRef } from "react";


export default function ScrollableContainer({children, length}: {children: React.ReactNode, length: number}) {

  // Client component wrapper for the scroll functionality
  const ScrollableCategories = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
      if (scrollContainerRef.current) {
        const scrollAmount = 300; // Adjust this value as needed
        if (direction === 'left') {
          scrollContainerRef.current.scrollLeft -= scrollAmount;
        } else {
          scrollContainerRef.current.scrollLeft += scrollAmount;
        }
      }
    };

    return (
      <div className="relative">
        {length > 4 && (
          <>
            <button 
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-transparent rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-transparent rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </>
        )}
        
        <div 
          ref={scrollContainerRef}
          className="grid grid-flow-col auto-cols-[minmax(300px,1fr)] gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 px-4 md:px-0"
          style={{
            scrollbarWidth: 'none', // For Firefox
            msOverflowStyle: 'none', // For IE
          }}
        >
         {children}
        </div>
      </div>
    );
  };

  return (
    <section className="py-16 container mx-auto px-4">      
      {/* For Server Components (Next.js 13+) */}
      {length <= 4 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {children}
        </div>
      ) : (
        // We need to use a client component for the scrollable version
        <ScrollableCategories />
      )}
    </section>
  );
}