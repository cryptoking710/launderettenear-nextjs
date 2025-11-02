import { Link } from "wouter";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm" data-testid="button-home">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-xl font-bold font-heading text-foreground">Terms of Service</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          
          <div className="mb-8 p-6 bg-primary/5 border border-primary/10 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2"><strong>Last Updated:</strong> November 2024</p>
            <p className="text-muted-foreground">
              These Terms of Service ("Terms") govern your use of LaunderetteNear.me (the "Website"). By accessing or using our Website, you agree to be bound by these Terms.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground mb-4">
            By accessing and using LaunderetteNear.me, you accept and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, please do not use our Website.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">2. Description of Service</h2>
          <p className="text-muted-foreground mb-4">
            LaunderetteNear.me provides a directory of launderettes across the United Kingdom. Our services include:
          </p>
          <ul className="text-muted-foreground space-y-2 mb-4">
            <li>A searchable database of launderette locations</li>
            <li>Information about services, opening hours, and contact details</li>
            <li>User reviews and ratings</li>
            <li>Location-based search functionality</li>
            <li>City-specific guides and information</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">3. User Responsibilities</h2>
          
          <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">3.1 Acceptable Use</h3>
          <p className="text-muted-foreground mb-4">You agree to use our Website only for lawful purposes. You must not:</p>
          <ul className="text-muted-foreground space-y-2 mb-4">
            <li>Submit false, misleading, or fraudulent information</li>
            <li>Post content that is defamatory, obscene, offensive, or violates any law</li>
            <li>Impersonate any person or entity</li>
            <li>Attempt to gain unauthorized access to our systems or networks</li>
            <li>Use automated systems (bots, scrapers) without our written permission</li>
            <li>Interfere with or disrupt the Website or servers</li>
            <li>Violate any applicable laws or regulations</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">3.2 Reviews and User Content</h3>
          <p className="text-muted-foreground mb-4">
            When submitting reviews or other content to our Website, you agree that:
          </p>
          <ul className="text-muted-foreground space-y-2 mb-4">
            <li>Your review is based on genuine personal experience</li>
            <li>You will not post fake, fraudulent, or compensated reviews</li>
            <li>Your content does not violate any third-party rights</li>
            <li>You grant us a perpetual, worldwide, royalty-free license to use, display, and distribute your content</li>
            <li>We reserve the right to edit, remove, or refuse to publish any content</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">4. Information Accuracy</h2>
          
          <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">4.1 Directory Information</h3>
          <p className="text-muted-foreground mb-4">
            We strive to provide accurate and up-to-date information about launderettes. However:
          </p>
          <ul className="text-muted-foreground space-y-2 mb-4">
            <li>Information is provided "as is" without warranties of any kind</li>
            <li>Opening hours, services, and contact details may change without notice</li>
            <li>We are not responsible for errors or omissions in listings</li>
            <li>You should verify critical information directly with the launderette</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">4.2 Third-Party Reviews</h3>
          <p className="text-muted-foreground mb-4">
            Reviews represent the opinions of individual users and do not reflect our views. We do not verify the accuracy of user reviews and are not responsible for their content.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">5. Intellectual Property</h2>
          <p className="text-muted-foreground mb-4">
            All content on LaunderetteNear.me, including text, graphics, logos, images, and software, is our property or licensed to us and is protected by UK and international copyright laws. You may not:
          </p>
          <ul className="text-muted-foreground space-y-2 mb-4">
            <li>Copy, modify, or distribute our content without written permission</li>
            <li>Use our trademarks or branding without authorization</li>
            <li>Create derivative works based on our Website</li>
            <li>Remove any copyright or proprietary notices</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">6. Third-Party Links and Services</h2>
          <p className="text-muted-foreground mb-4">
            Our Website may contain links to third-party websites and services (including launderette websites). We are not responsible for:
          </p>
          <ul className="text-muted-foreground space-y-2 mb-4">
            <li>The content, accuracy, or practices of third-party websites</li>
            <li>Products or services offered by launderettes listed in our directory</li>
            <li>Transactions between you and third parties</li>
          </ul>
          <p className="text-muted-foreground mb-4">
            Your use of third-party websites is at your own risk and subject to their terms and conditions.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">7. Advertising</h2>
          <p className="text-muted-foreground mb-4">
            We display advertisements through Google AdSense and may feature premium listings. Premium listings are paid placements but do not guarantee endorsement. We are not responsible for the content of advertisements or the products/services advertised.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">8. Disclaimers and Limitations of Liability</h2>
          
          <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">8.1 No Warranties</h3>
          <p className="text-muted-foreground mb-4">
            Our Website is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to:
          </p>
          <ul className="text-muted-foreground space-y-2 mb-4">
            <li>Warranties of merchantability or fitness for a particular purpose</li>
            <li>Warranties of accuracy, reliability, or completeness of information</li>
            <li>Warranties of uninterrupted or error-free service</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">8.2 Limitation of Liability</h3>
          <p className="text-muted-foreground mb-4">
            To the fullest extent permitted by law, LaunderetteNear.me and its operators shall not be liable for:
          </p>
          <ul className="text-muted-foreground space-y-2 mb-4">
            <li>Any indirect, incidental, special, or consequential damages</li>
            <li>Loss of profits, data, or business opportunities</li>
            <li>Damages arising from your use or inability to use our Website</li>
            <li>Damages resulting from third-party content, products, or services</li>
            <li>Damages arising from errors or omissions in our directory</li>
          </ul>
          <p className="text-muted-foreground mb-4">
            Our total liability to you for any claims arising from your use of the Website shall not exceed £100.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">9. Indemnification</h2>
          <p className="text-muted-foreground mb-4">
            You agree to indemnify and hold harmless LaunderetteNear.me and its operators from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
          </p>
          <ul className="text-muted-foreground space-y-2 mb-4">
            <li>Your use of the Website</li>
            <li>Your violation of these Terms</li>
            <li>Your violation of any third-party rights</li>
            <li>Content you submit to our Website</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">10. Content Moderation</h2>
          <p className="text-muted-foreground mb-4">
            We reserve the right to:
          </p>
          <ul className="text-muted-foreground space-y-2 mb-4">
            <li>Monitor, edit, or remove any user content</li>
            <li>Refuse to publish reviews that violate our guidelines</li>
            <li>Suspend or terminate access for users who violate these Terms</li>
            <li>Disclose user information if required by law or to protect our rights</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">11. Privacy</h2>
          <p className="text-muted-foreground mb-4">
            Your use of our Website is subject to our{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>, which explains how we collect, use, and protect your personal information.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">12. Changes to Terms</h2>
          <p className="text-muted-foreground mb-4">
            We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to the Website. Your continued use of the Website after changes constitutes acceptance of the modified Terms.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">13. Termination</h2>
          <p className="text-muted-foreground mb-4">
            We may terminate or suspend your access to our Website immediately, without prior notice or liability, for any reason, including if you breach these Terms.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">14. Governing Law</h2>
          <p className="text-muted-foreground mb-4">
            These Terms are governed by and construed in accordance with the laws of England and Wales. Any disputes arising from these Terms or your use of the Website shall be subject to the exclusive jurisdiction of the courts of England and Wales.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">15. Severability</h2>
          <p className="text-muted-foreground mb-4">
            If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">16. Contact Information</h2>
          <p className="text-muted-foreground mb-4">
            If you have questions about these Terms, please contact us:
          </p>
          <div className="bg-card border border-border rounded-lg p-6 mb-4">
            <p className="text-muted-foreground mb-2">
              <strong className="text-foreground">Email:</strong>{" "}
              <a href="mailto:legal@launderettenear.me" className="text-primary hover:underline">
                legal@launderettenear.me
              </a>
            </p>
            <p className="text-muted-foreground">
              <strong className="text-foreground">Website:</strong>{" "}
              <Link href="/contact" className="text-primary hover:underline">
                Contact Form
              </Link>
            </p>
          </div>

          <div className="mt-12 p-6 bg-primary/5 border border-primary/10 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              By using LaunderetteNear.me, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
