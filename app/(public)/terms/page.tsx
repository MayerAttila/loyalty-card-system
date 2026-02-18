const LAST_UPDATED = "February 18, 2026";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-transparent text-contrast">
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-semibold text-brand md:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-contrast/70">Last updated: {LAST_UPDATED}</p>
        <p className="mt-6 text-sm leading-7 text-contrast/85">
          These Terms of Service ("Terms") govern your use of Loyale&apos;s website
          and loyalty platform. By accessing or using the service, you agree to these
          Terms.
        </p>

        <div className="mt-10 space-y-8">
          <section>
            <h2 className="text-xl font-semibold">1. Service Description</h2>
            <p className="mt-2 text-sm leading-7 text-contrast/85">
              Loyale provides tools for businesses to create, manage, and distribute
              digital loyalty cards, including wallet pass integrations and stamp/reward
              tracking.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">2. Accounts and Eligibility</h2>
            <p className="mt-2 text-sm leading-7 text-contrast/85">
              You are responsible for account credentials, account activity, and
              ensuring that all information provided is accurate and lawful.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">3. Acceptable Use</h2>
            <p className="mt-2 text-sm leading-7 text-contrast/85">
              You may not use the service for unlawful, deceptive, abusive, or
              unauthorized activity, including attempts to disrupt service operation
              or misuse wallet pass functionality.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">4. Fees and Billing</h2>
            <p className="mt-2 text-sm leading-7 text-contrast/85">
              Paid features are billed according to your selected subscription plan.
              Unless otherwise stated, fees are non-refundable except where required
              by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">5. Third-Party Services</h2>
            <p className="mt-2 text-sm leading-7 text-contrast/85">
              The platform integrates with third-party services (for example Google
              Wallet, Apple Wallet, payment providers, and hosting providers). Their
              services are subject to their own terms and policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">6. Intellectual Property</h2>
            <p className="mt-2 text-sm leading-7 text-contrast/85">
              Loyale retains rights in the platform and related software. You retain
              rights to content and branding you upload, and grant us the rights needed
              to provide the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">7. Disclaimer of Warranties</h2>
            <p className="mt-2 text-sm leading-7 text-contrast/85">
              The service is provided "as is" and "as available" to the maximum extent
              permitted by law, without warranties of uninterrupted or error-free
              operation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">8. Limitation of Liability</h2>
            <p className="mt-2 text-sm leading-7 text-contrast/85">
              To the fullest extent permitted by law, Loyale is not liable for indirect,
              incidental, special, consequential, or punitive damages arising from use
              of the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">9. Termination</h2>
            <p className="mt-2 text-sm leading-7 text-contrast/85">
              We may suspend or terminate accounts that violate these Terms or threaten
              security or platform integrity.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">10. Changes to Terms</h2>
            <p className="mt-2 text-sm leading-7 text-contrast/85">
              We may update these Terms from time to time. Continued use after updates
              take effect constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">11. Contact</h2>
            <p className="mt-2 text-sm leading-7 text-contrast/85">
              For questions regarding these Terms, contact{" "}
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
