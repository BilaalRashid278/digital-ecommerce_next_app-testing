"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-primary/10 via-background to-primary/5 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 items-center">
          <motion.div className="flex flex-col items-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 text-center">
              Premium Digital Products
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl text-center">
              Discover high-quality digital resources for your personal and professional needs. Instant access via
              Google Drive after purchase.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/products">
                  Browse Products <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-[400px] w-full rounded-xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent z-10 rounded-xl"></div>
              <img
                src="/placeholder.svg?height=400&width=600"
                alt="Digital Products Showcase"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="absolute -bottom-6 -right-4 lg:-right-6 bg-background rounded-lg p-4 shadow-lg z-20">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Instant Access</p>
                  <p className="text-sm text-muted-foreground">After Purchase</p>
                </div>
              </div>
            </div>
          </motion.div> */}
        </div>
      </div>
    </section>
  )
}

