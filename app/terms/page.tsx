import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Cricksy',
};

export default function Terms() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
      <div className="prose prose-blue">
        <p>By accessing Cricksy (cricksy-nn4p.onrender.com), you agree to be bound by these terms...</p>
        {/* Add generated terms here */}
      </div>
    </main>
  );
}