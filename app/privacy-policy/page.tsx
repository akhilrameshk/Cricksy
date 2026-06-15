import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Cricksy',
  description: 'Privacy policy and data usage terms for Cricksy cricket live scores.',
};

export default function PrivacyPolicy() {
  return (
    <main className="max-w-4xl mx-auto p-6 leading-relaxed">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4 text-sm text-gray-500">Last Updated: June 15, 2026</p>
      
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">1. Introduction</h2>
        <p>Welcome to Cricksy. We value your privacy and are committed to protecting your personal data.</p>
        
        <h2 className="text-xl font-semibold">2. Google AdSense and Cookies</h2>
        <p>
          We use Google AdSense to serve ads. Google uses cookies (such as the DART cookie) 
          to serve ads based on your visit to this and other websites. You may opt out of the 
          use of the DART cookie by visiting the Google Ad and Content Network privacy policy.
        </p>
        
        <h2 className="text-xl font-semibold">3. Data Collection</h2>
        <p>Cricksy does not explicitly collect personal identification information from its viewers.</p>
      </section>
    </main>
  );
}