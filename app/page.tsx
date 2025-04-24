import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, FileText, Film, Package } from "lucide-react"
import Link from "next/link"
import FeaturedProducts from "@/components/featured-products"
import HeroSection from "@/components/hero-section"
import CategorySection from "@/components/category-section"
import { DynamicIcon } from "@/components/ui/DynamicIcon"
import tinycolor from 'tinycolor2';
import { Category } from "@/lib/types";



async function getCategories() {
  try {
    const res = await fetch(`${process.env.BASE_URL}/api/public/product/category`, {
      cache: 'no-store' // or 'force-cache' for static data
    });
    if (!res.ok) throw new Error("Failed to fetch categories");
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function Home() {
  const categories: Category[] = await getCategories();

  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />

      <section className="container mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose Our Digital Products?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-0 shadow-md">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Instant Access</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get immediate access to your purchased digital products via Google Drive.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-0 shadow-md">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Film className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Premium Quality</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                All our digital products are carefully crafted to ensure the highest quality.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-0 shadow-md">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Secure Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Multiple secure payment options including JazzCash, EasyPaisa, and Bank Transfer.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <FeaturedProducts />

      <CategorySection length={categories.length || 0}>
        {categories?.map((category, index) => (
          <div
            key={category._id}
            className="animate-fade-in min-w-[300px]"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="h-full rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <div
                style={{
                  backgroundImage: `linear-gradient(to right, ${category.color}, ${tinycolor(category.color).lighten(20).toString()})`
                }}
                className="p-6 text-white h-[100%]"
              >
                <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <DynamicIcon name={category.icon} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-white/80 mb-4">{category.description}</p>
                <Link href={`/products?type=${category.name}`}>
                  <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none">
                    Explore
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </CategorySection>

      <section className="bg-muted py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to explore our digital products?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Browse our collection of premium digital products and find the perfect resources for your needs.
          </p>
          <Button asChild size="lg" className="rounded-full">
            <Link href="/products">
              Browse All Products <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  )
}

