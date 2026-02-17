export const metadata = {
  title: "Terms and Conditions - CineStream",
  description: "Terms and conditions for using CineStream streaming service",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#050608] text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-[#F5C542]">Terms and Conditions</h1>
        
        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using CineStream, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Use License</h2>
            <p>Permission is granted to temporarily use CineStream for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Disclaimer</h2>
            <p>The materials on CineStream are provided on an &apos;as is&apos; basis. CineStream makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Limitation of Liability</h2>
            <p>In no event shall CineStream or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on CineStream.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. User Content</h2>
            <p>Users are solely responsible for the content they upload or share on CineStream. By uploading content, you warrant that you have the legal right to do so.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Privacy Policy</h2>
            <p>Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Account Responsibilities</h2>
            <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Termination</h2>
            <p>We reserve the right to terminate your access to CineStream without notice if we believe you have violated any of these terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Your continued use of CineStream following any changes indicates your acceptance of the new terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Contact Us</h2>
            <p>If you have any questions about these Terms and Conditions, please contact us.</p>
          </section>

          <p className="pt-6 text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
