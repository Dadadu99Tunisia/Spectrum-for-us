import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PoliciesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-balance mb-8">Policies</h1>

      <div className="space-y-8 max-w-4xl">
        {/* Terms of Service */}
        <Card id="terms">
          <CardHeader>
            <CardTitle>Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Welcome to Spectrum for Us. By accessing and using our marketplace, you agree to be bound by these Terms
              of Service.
            </p>
            <h3 className="font-semibold mt-4 mb-2">1. Account Registration</h3>
            <p className="text-muted-foreground leading-relaxed">
              You must provide accurate information when creating an account. You are responsible for maintaining the
              security of your account credentials.
            </p>
            <h3 className="font-semibold mt-4 mb-2">2. Vendor Responsibilities</h3>
            <p className="text-muted-foreground leading-relaxed">
              Vendors must accurately represent their products and services, fulfill orders promptly, and maintain
              professional communication with buyers.
            </p>
            <h3 className="font-semibold mt-4 mb-2">3. Prohibited Content</h3>
            <p className="text-muted-foreground leading-relaxed">
              We do not allow hate speech, discrimination, or content that violates our community guidelines.
            </p>
          </CardContent>
        </Card>

        {/* Privacy Policy */}
        <Card id="privacy">
          <CardHeader>
            <CardTitle>Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal
              information.
            </p>
            <h3 className="font-semibold mt-4 mb-2">Information We Collect</h3>
            <p className="text-muted-foreground leading-relaxed">
              We collect information you provide when creating an account, making purchases, or contacting us. This
              includes your name, email, and payment information.
            </p>
            <h3 className="font-semibold mt-4 mb-2">How We Use Your Information</h3>
            <p className="text-muted-foreground leading-relaxed">
              We use your information to process orders, communicate with you, and improve our services. We never sell
              your personal information to third parties.
            </p>
            <h3 className="font-semibold mt-4 mb-2">Data Security</h3>
            <p className="text-muted-foreground leading-relaxed">
              We implement industry-standard security measures to protect your data.
            </p>
          </CardContent>
        </Card>

        {/* Refund Policy */}
        <Card id="refund">
          <CardHeader>
            <CardTitle>Refund Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p className="text-muted-foreground leading-relaxed mb-4">
              We want you to be satisfied with your purchases. Here's our refund policy:
            </p>
            <h3 className="font-semibold mt-4 mb-2">Products</h3>
            <p className="text-muted-foreground leading-relaxed">
              Physical products can be returned within 30 days of delivery for a full refund, provided they are in
              original condition.
            </p>
            <h3 className="font-semibold mt-4 mb-2">Services</h3>
            <p className="text-muted-foreground leading-relaxed">
              Service refunds are handled on a case-by-case basis. Please contact the vendor directly to discuss any
              issues.
            </p>
            <h3 className="font-semibold mt-4 mb-2">Processing Time</h3>
            <p className="text-muted-foreground leading-relaxed">
              Refunds are typically processed within 5-7 business days after we receive the returned item.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
