// ✅ For Next.js App Router: app/terms/page.js
export default function TermsPage() {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-gray-800 leading-relaxed">
        <h1 className="text-4xl font-bold mb-4 text-blue-600">Terms & Services</h1>
        <p className="mb-8 text-sm text-gray-500">Last updated: April 16, 2025</p>
  
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">1. Acceptance of Terms</h2>
          <p>
            By purchasing or using any digital product from this website, you agree to be bound by these Terms and Services. If you do not agree, please do not use or purchase from this platform.
          </p>
        </section>
  
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">2. Digital Product Delivery</h2>
          <p>
            All digital products are delivered automatically upon successful payment. No physical product will be shipped.
          </p>
        </section>
  
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">3. Refund Policy</h2>
          <p>
            Due to the nature of digital products, all sales are final. No refunds, returns, or exchanges will be provided under any circumstances.
          </p>
        </section>
  
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">4. License and Usage</h2>
          <p>
            You are granted a non-transferable, non-exclusive license to use the product for personal or business use. You may not resell, redistribute, or share the product in any form.
          </p>
        </section>
  
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">5. User Responsibility</h2>
          <p>
            You are solely responsible for keeping your account secure and ensuring your use of the product complies with applicable laws.
          </p>
        </section>
  
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">6. Changes to Terms</h2>
          <p>
            These terms may be updated at any time without prior notice. Continued use of the platform means you accept the updated terms.
          </p>
        </section>
  
        <section className="mt-10 text-center text-sm text-gray-500">
          <p>These terms apply to all users equally. For any questions, please contact our support team.</p>
        </section>
      </div>
    );
  }
  