const LAST_UPDATED = "February 18, 2026";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-transparent text-contrast">
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-semibold text-brand md:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-contrast/70">Last updated: {LAST_UPDATED}</p>
        <p className="mt-6 text-sm leading-7 text-contrast/85">
          Loyale ("we", "our", "us") provides digital loyalty card services for
          businesses and their customers. This Privacy Policy explains how we collect,
          use, share, and protect personal information when you use our website,
          dashboard, and wallet pass features.
        </p>

        <div className="mt-10 space-y-8">
          <section>
            <h2 className="text-xl font-semibold">1. Information We Collect</h2>
            <p className="mt-2 text-sm leading-7 text-contrast/85">
              We collect information that you provide directly, including account
              details (name, email), business profile information, customer details
              entered for loyalty enrollment, and loyalty program data such as stamp
              progress and rewards.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">2. How We Use Information</h2>
            <p className="mt-2 text-sm leading-7 text-contrast/85">
              We use information to operate the platform, issue and update wallet
              passes, authenticate users, process subscriptions, send transactional
              notifications, provide support, and improve service reliability and
              security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">3. Sharing and Processors</h2>
            <p className="mt-2 text-sm leading-7 text-contrast/85">
              We share data only as needed with service providers and infrastructure
              partners, such as payment processing providers, cloud storage providers,
              email delivery providers, and wallet platforms (Google Wallet and Apple
              Wallet) for pass delivery and updates.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">4. Data Retention</h2>
            <p className="mt-2 text-sm leading-7 text-contrast/85">
              We retain data while accounts are active and for a reasonable period
              afterwards to meet contractual, legal, accounting, and security
              requirements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">5. Security</h2>
            <p className="mt-2 text-sm leading-7 text-contrast/85">
              We use technical and organizational measures to protect information,
              including access controls and secure transport. No method of
              transmission or storage is fully guaranteed, but we continuously improve
              safeguards.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">6. Your Rights</h2>
            <p className="mt-2 text-sm leading-7 text-contrast/85">
              Depending on your jurisdiction, you may request access, correction,
              deletion, or portability of your personal information, and may object
              to or restrict certain processing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">7. Children&apos;s Privacy</h2>
            <p className="mt-2 text-sm leading-7 text-contrast/85">
              Our services are not directed to children under 13, and we do not
              knowingly collect personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">8. Changes to This Policy</h2>
            <p className="mt-2 text-sm leading-7 text-contrast/85">
              We may update this Privacy Policy from time to time. Material changes
              will be posted on this page with an updated effective date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">9. Contact</h2>
            <p className="mt-2 text-sm leading-7 text-contrast/85">
              For privacy questions, contact us at{" "}
              <a className="text-brand hover:underline" href="mailto:support@loyale.online">
                support@loyale.online
              </a>
              .
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
