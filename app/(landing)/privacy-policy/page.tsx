import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const PrivacyPolicyPage = () => {
  return (
    <div className="w-full bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 min-h-[60vh]">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-white shadow-xl rounded-lg">
          <CardHeader>
            <CardTitle>
              <h1 className="text-3xl sm:text-4xl font-playfair italic text-gray-700 mb-2 uppercase tracking-wide">Privacy Policy</h1>
            </CardTitle>
            <p className="text-sm text-gray-500">Last updated: February 13, 2025</p>
          </CardHeader>
          <CardContent>
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#C5A464] mb-2">1. Information We Collect</h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us. This may include your name, email address, phone number, and payment information.
              </p>
            </section>
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#C5A464] mb-2">2. How We Use Your Information</h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 text-sm leading-relaxed mt-2">
                <li>Provide and maintain our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Improve our website and services</li>
              </ul>
            </section>
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#C5A464] mb-2">3. Information Sharing</h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law.
              </p>
            </section>
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#C5A464] mb-2">4. Data Security</h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#C5A464] mb-2">5. Your Rights</h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-[#C5A464] mb-2">6. Contact Us</h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                If you have any questions about our Privacy Policy, please contact us at <a href="mailto:info@eaglesfcgi.org" className="text-[#C5A464] underline">info@eaglesfcgi.org</a>.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
