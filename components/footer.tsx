import Link from "next/link"
export default function Footer({websiteInfo = {}}: any) {
  return (
    <footer className="bg-muted">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center">
          <div className="text-center">
            <h3 className="text-lg font-bold mb-4">Digital Markaz</h3>
            <p className="text-muted-foreground mb-4">Premium digital products with instant access via Google Drive & Others.</p>
          </div>
        </div>

        <div className="border-t mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} {websiteInfo?.footerName ? websiteInfo?.footerName : "Unkown Business Name"}. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

