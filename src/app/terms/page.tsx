import Link from "next/link";

export const metadata = {
  title: "Terms and Conditions - PrimeVideo",
  description: "Terms and conditions for using PrimeVideo streaming service",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black via-black/95 to-transparent">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-white">
            Prime<span className="text-blue-500">Video</span>
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-white">Terms and Conditions</h1>
          <p className="text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-8 text-gray-300">
            <section className="bg-[#1a1a1a] rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-400">By accessing and using PrimeVideo, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.</p>
            </section>

            <section className="bg-[#1a1a1a] rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-3">2. Description of Service</h2>
              <p className="text-gray-400">PrimeVideo provides streaming and download access to movies and TV shows. The service is provided for personal, non-commercial viewing purposes only.</p>
            </section>

            <section className="bg-[#1a1a1a] rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-3">3. Use License</h2>
              <p className="text-gray-400">Permission is granted to temporarily use PrimeVideo for personal, non-commercial viewing only. This is the grant of a license, not a transfer of title. You may not:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
                <li>Redistribute or transmit any content</li>
                <li>Copy, modify, or create derivative works</li>
                <li>Use the content for commercial purposes</li>
                <li>Attempt to bypass any content protection measures</li>
              </ul>
            </section>

            <section className="bg-[#1a1a1a] rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-3">4. Disclaimer of Warranties</h2>
              <p className="text-gray-400">The materials on PrimeVideo are provided on an &apos;as is&apos; basis. PrimeVideo makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.</p>
            </section>

            <section className="bg-[#1a1a1a] rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-3">5. Limitation of Liability</h2>
              <p className="text-gray-400">In no event shall PrimeVideo or its operators be liable for any damages (including, without limitation, damages for loss of data or profit, or due to service interruption) arising out of the use or inability to use the materials on PrimeVideo, even if PrimeVideo has been notified of the possibility of such damages.</p>
            </section>

            <section className="bg-[#1a1a1a] rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-3">6. DMCA Copyright Policy</h2>
              <p className="text-gray-400">PrimeVideo respects the intellectual property rights of others. If you believe that your copyrighted work has been infringed, please send a DMCA notice to our designated copyright agent with the following information:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
                <li>Description of the copyrighted work</li>
                <li>Location of the infringing material</li>
                <li>Your contact information</li>
                <li>A statement of good faith belief</li>
                <li>A statement of accuracy under penalty of perjury</li>
              </ul>
            </section>

            <section className="bg-[#1a1a1a] rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-3">7. User Accounts</h2>
              <p className="text-gray-400">Some features may require registration. You agree to provide accurate information and keep your account secure. You are responsible for all activities under your account.</p>
            </section>

            <section className="bg-[#1a1a1a] rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-3">8. Privacy Policy</h2>
              <p className="text-gray-400">Your privacy is important to us. We collect and use information as described in our Privacy Policy. By using PrimeVideo, you consent to the collection and use of information as outlined therein.</p>
            </section>

            <section className="bg-[#1a1a1a] rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-3">9. Third-Party Links</h2>
              <p className="text-gray-400">PrimeVideo may contain links to third-party websites. We are not responsible for the content or practices of these websites. Your use of third-party sites is at your own risk.</p>
            </section>

            <section className="bg-[#1a1a1a] rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-3">10. Termination</h2>
              <p className="text-gray-400">We reserve the right to terminate your access to PrimeVideo without notice if we believe you have violated any of these terms or engaged in any unlawful activity.</p>
            </section>

            <section className="bg-[#1a1a1a] rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-3">11. Modifications to Terms</h2>
              <p className="text-gray-400">We reserve the right to modify these terms at any time. Your continued use of PrimeVideo following any changes indicates your acceptance of the new terms. It is your responsibility to review these terms periodically.</p>
            </section>

            <section className="bg-[#1a1a1a] rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-3">12. Governing Law</h2>
              <p className="text-gray-400">These terms and conditions are governed by and construed in accordance with applicable laws. Any disputes shall be resolved in the appropriate courts of jurisdiction.</p>
            </section>

            <section className="bg-[#1a1a1a] rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-3">13. Contact Information</h2>
              <p className="text-gray-400">If you have any questions about these Terms and Conditions, please contact us through our support channels.</p>
            </section>

            <div className="pt-6 text-center">
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} PrimeVideo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
