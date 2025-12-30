import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const CookiesPolicyPage = () => {
  return (
    <div className="w-full bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 min-h-[60vh]">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-white shadow-xl rounded-lg">
          <CardHeader>
            <CardTitle>
              <h1 className="text-3xl sm:text-4xl font-playfair italic text-gray-700 mb-2 uppercase tracking-wide">Cookies Policy</h1>
            </CardTitle>
            <p className="text-sm text-gray-500">Last updated: February 13, 2025</p>
          </CardHeader>
          <CardContent>
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#C5A464] mb-2">1. What Are Cookies?</h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                Cookies are small text files stored on your device when you visit our website. They help us enhance your browsing experience, remember your preferences, and analyze site usage.
              </p>
            </section>
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#C5A464] mb-2">2. How We Use Cookies</h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                We use cookies to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 text-sm leading-relaxed mt-2">
                <li>Remember your preferences and settings</li>
                <li>Enable essential website functionality</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Improve our services and user experience</li>
              </ul>
            </section>
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#C5A464] mb-2">3. Types of Cookies We Use</h2>
              <ul className="list-disc pl-6 text-gray-700 text-sm leading-relaxed">
                <li><span className="font-semibold">Essential Cookies:</span> Necessary for the website to function properly.</li>
                <li><span className="font-semibold">Performance Cookies:</span> Help us understand how visitors interact with our site.</li>
                <li><span className="font-semibold">Functionality Cookies:</span> Remember your preferences and choices.</li>
                <li><span className="font-semibold">Third-Party Cookies:</span> Set by external services for analytics or advertising.</li>
              </ul>
            </section>
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-[#C5A464] mb-2">4. Managing Cookies</h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                You can control and manage cookies through your browser settings. Please note that disabling cookies may affect the functionality of our website.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-[#C5A464] mb-2">5. Contact Us</h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                If you have any questions about our Cookies Policy, please contact us at <a href="mailto:info@eaglesfcgi.org" className="text-[#C5A464] underline">info@eaglesfcgi.org</a>.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CookiesPolicyPage;
