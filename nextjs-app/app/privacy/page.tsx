import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Data Protection & GDPR Compliance | LaunderetteNear.me",
  description: "Read our privacy policy to understand how LaunderetteNear.me collects, uses, and protects your personal data in compliance with UK GDPR regulations.",
  openGraph: {
    title: "Privacy Policy - LaunderetteNear.me",
    description: "Our commitment to protecting your privacy and complying with UK GDPR regulations.",
    url: "https://launderettenear.me/privacy",
    type: "website",
  },
};

export default function Privacy() {
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
            <h1 className="text-xl font-bold font-heading text-foreground">Privacy Policy</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          
          <div className="mb-8 p-6 bg-primary/5 border border-primary/10 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2"><strong>Last Updated:</strong> November 2024</p>
            <p className="text-muted-foreground">
              LaunderetteNear.me ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">1. Information We Collect</h2>
          
          <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">1.1 Information You Provide</h3>
          <p className="text-muted-foreground mb-4">
            We may collect information that you voluntarily provide to us, including:
          </p>
          <ul className="text-muted-foreground space-y-2 mb-4">
            <li><strong>Contact Information:</strong> Name and email address when you contact us or submit a review</li>
            <li><strong>Review Content:</strong> Reviews, ratings, and comments you submit about launderettes</li>
            <li><strong>Business Information:</strong> If you're a launderette owner requesting to add or update a listing</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">1.2 Automatically Collected Information</h3>
          <p className="text-muted-foreground mb-4">
            When you visit our website, we automatically collect certain information about your device and usage:
          </p>
          <ul className="text-muted-foreground space-y-2 mb-4">
            <li><strong>Location Data:</strong> With your permission, we collect your approximate location to show nearby launderettes</li>
            <li><strong>Device Information:</strong> Browser type, operating system, device type, and screen resolution</li>
            <li><strong>Usage Data:</strong> Pages visited, time spent on pages, click data, and search queries</li>
            <li><strong>IP Address:</strong> Your Internet Protocol (IP) address for security and analytics purposes</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">1.3 Cookies and Tracking Technologies</h3>
          <p className="text-muted-foreground mb-4">
            We use cookies and similar tracking technologies to enhance your experience:
          </p>
          <ul className="text-muted-foreground space-y-2 mb-4">
            <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
            <li><strong>Advertising Cookies:</strong> Used by Google AdSense to serve relevant advertisements</li>
            <li><strong>Authentication Cookies:</strong> Used by Firebase Authentication for admin login functionality</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="text-muted-foreground mb-4">
            We use the information we collect for the following purposes:
          </p>
          <ul className="text-muted-foreground space-y-2 mb-4">
            <li><strong>Provide Services:</strong> Display nearby launderettes, show reviews, and enable search functionality</li>
            <li><strong>Improve Our Website:</strong> Analyze usage patterns to enhance user experience and add new features</li>
            <li><strong>Communication:</strong> Respond to your inquiries, feedback, and support requests</li>
            <li><strong>Content Moderation:</strong> Review and moderate user-submitted reviews for quality and appropriateness</li>
            <li><strong>Analytics:</strong> Track search trends, popular listings, and user behavior to improve our directory</li>
            <li><strong>Advertising:</strong> Display relevant advertisements through Google AdSense</li>
            <li><strong>Legal Compliance:</strong> Comply with applicable laws, regulations, and legal processes</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">3. Third-Party Services</h2>
          
          <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">3.1 Google AdSense</h3>
          <p className="text-muted-foreground mb-4">
            We use Google AdSense to display advertisements on our website. Google may use cookies to serve ads based on your prior visits to our website or other websites. You can opt out of personalized advertising by visiting{" "}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Google Ads Settings
            </a>.
          </p>

          <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">3.2 Firebase (Google Cloud)</h3>
          <p className="text-muted-foreground mb-4">
            We use Firebase services for:
          </p>
          <ul className="text-muted-foreground space-y-2 mb-4">
            <li><strong>Firebase Firestore:</strong> Our database for storing launderette listings, reviews, and analytics</li>
            <li><strong>Firebase Authentication:</strong> Secure authentication for website administrators</li>
          </ul>
          <p className="text-muted-foreground mb-4">
            Firebase is operated by Google and is subject to{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Google's Privacy Policy
            </a>.
          </p>

          <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">3.3 OpenStreetMap Nominatim</h3>
          <p className="text-muted-foreground mb-4">
            We use OpenStreetMap Nominatim for geocoding addresses. This service is subject to the{" "}
            <a href="https://operations.osmfoundation.org/policies/nominatim/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Nominatim Usage Policy
            </a>.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">4. Data Sharing and Disclosure</h2>
          <p className="text-muted-foreground mb-4">
            We do not sell your personal information. We may share information in the following circumstances:
          </p>
          <ul className="text-muted-foreground space-y-2 mb-4">
            <li><strong>With Service Providers:</strong> Third-party services like Firebase and Google AdSense that help us operate our website</li>
            <li><strong>Public Information:</strong> Reviews and ratings you submit are publicly visible on our website</li>
            <li><strong>Legal Requirements:</strong> When required by law, court order, or governmental authority</li>
            <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">5. Your Rights (GDPR)</h2>
          <p className="text-muted-foreground mb-4">
            Under the UK General Data Protection Regulation (GDPR), you have the following rights:
          </p>
          <ul className="text-muted-foreground space-y-2 mb-4">
            <li><strong>Right to Access:</strong> Request a copy of the personal data we hold about you</li>
            <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete data</li>
            <li><strong>Right to Erasure:</strong> Request deletion of your personal data ("right to be forgotten")</li>
            <li><strong>Right to Restrict Processing:</strong> Request limitation of how we process your data</li>
            <li><strong>Right to Data Portability:</strong> Receive your data in a structured, commonly used format</li>
            <li><strong>Right to Object:</strong> Object to processing of your personal data for certain purposes</li>
            <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for data processing at any time</li>
          </ul>
          <p className="text-muted-foreground mb-4">
            To exercise any of these rights, please contact us using the information in the "Contact Us" section below.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">6. Data Security</h2>
          <p className="text-muted-foreground mb-4">
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
          </p>
          <ul className="text-muted-foreground space-y-2 mb-4">
            <li>Secure data transmission using HTTPS encryption</li>
            <li>Firebase security rules to protect database access</li>
            <li>Regular security assessments and updates</li>
            <li>Limited access to personal information by authorized personnel only</li>
          </ul>
          <p className="text-muted-foreground mb-4">
            However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">7. Data Retention</h2>
          <p className="text-muted-foreground mb-4">
            We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. Specifically:
          </p>
          <ul className="text-muted-foreground space-y-2 mb-4">
            <li><strong>Reviews:</strong> Retained indefinitely unless you request deletion</li>
            <li><strong>Analytics Data:</strong> Aggregated and anonymized after 26 months</li>
            <li><strong>Contact Inquiries:</strong> Retained for up to 2 years for customer service purposes</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">8. Children's Privacy</h2>
          <p className="text-muted-foreground mb-4">
            Our website is not directed to children under the age of 16. We do not knowingly collect personal information from children under 16. If you believe we have collected information from a child under 16, please contact us immediately.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">9. International Data Transfers</h2>
          <p className="text-muted-foreground mb-4">
            Your information may be transferred to and processed in countries other than the UK, including the United States where our service providers (Google/Firebase) operate data centers. These transfers are conducted in accordance with GDPR requirements and appropriate safeguards.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">10. Changes to This Privacy Policy</h2>
          <p className="text-muted-foreground mb-4">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. We encourage you to review this Privacy Policy periodically for any changes.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">11. Contact Us</h2>
          <p className="text-muted-foreground mb-4">
            If you have any questions about this Privacy Policy or wish to exercise your data protection rights, please contact us:
          </p>
          <div className="bg-card border border-border rounded-lg p-6 mb-4">
            <p className="text-muted-foreground mb-2">
              <strong className="text-foreground">Email:</strong>{" "}
              <a href="mailto:privacy@launderettenear.me" className="text-primary hover:underline">
                privacy@launderettenear.me
              </a>
            </p>
            <p className="text-muted-foreground mb-2">
              <strong className="text-foreground">Website:</strong>{" "}
              <Link href="/contact" className="text-primary hover:underline">
                Contact Form
              </Link>
            </p>
            <p className="text-muted-foreground">
              <strong className="text-foreground">Response Time:</strong> We aim to respond to all privacy inquiries within 30 days
            </p>
          </div>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">12. Cookie Consent</h2>
          <p className="text-muted-foreground mb-4">
            By continuing to use our website, you consent to our use of cookies as described in this Privacy Policy. You can control cookies through your browser settings and opt-out of personalized advertising through the links provided in Section 3.1.
          </p>

          <div className="mt-12 p-6 bg-primary/5 border border-primary/10 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              This Privacy Policy is compliant with UK GDPR and applicable UK data protection laws.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
