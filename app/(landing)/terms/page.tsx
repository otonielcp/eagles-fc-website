import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const LegalTermsPage = () => {
  return (
    <div className="w-full bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 min-h-[60vh]">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-white shadow-xl rounded-lg">
          <CardHeader>
            <CardTitle>
              <h1 className="text-3xl sm:text-4xl font-playfair italic text-gray-700 mb-2 uppercase tracking-wide">Legal Terms & Conditions</h1>
            </CardTitle>
            <p className="text-sm text-gray-500">Last updated: February 13, 2025</p>
          </CardHeader>
          <CardContent>
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#C5A464] mb-2">1. Acceptance of Terms</h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                By accessing and using the Eagles FC website, you agree to comply with and be bound by these Legal Terms and Conditions. If you do not agree to these terms, please do not use our website.
              </p>
            </section>
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#C5A464] mb-2">2. Intellectual Property</h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                All content, images, logos, and materials on this website are the property of Eagles FC or its partners and are protected by applicable copyright and trademark laws. Unauthorized use is strictly prohibited.
              </p>
            </section>
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#C5A464] mb-2">3. User Conduct</h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                You agree not to use the website for any unlawful purpose or in any way that may harm Eagles FC, its members, or other users. Harassment, spamming, or posting offensive content is not permitted.
              </p>
            </section>
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#C5A464] mb-2">4. Limitation of Liability</h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                Eagles FC is not liable for any damages or losses resulting from your use of this website. All content is provided "as is" without warranties of any kind.
              </p>
            </section>
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#C5A464] mb-2">5. Third-Party Links</h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                Our website may contain links to third-party sites. Eagles FC is not responsible for the content or privacy practices of these external sites.
              </p>
            </section>
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#C5A464] mb-2">6. Changes to Terms</h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                Eagles FC reserves the right to update or modify these terms at any time. Changes will be posted on this page with an updated effective date.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-[#C5A464] mb-2">7. Contact Us</h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                If you have any questions about these Legal Terms and Conditions, please contact us at <a href="mailto:info@eaglesfcgi.org" className="text-[#C5A464] underline">info@eaglesfcgi.org</a>.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LegalTermsPage;
