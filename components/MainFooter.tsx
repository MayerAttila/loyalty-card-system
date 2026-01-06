import Link from "next/link";

const MainFooter = () => {
  return (
    <footer className="bg-brand text-primary">
      <div className="mx-auto grid max-w-5xl gap-10 px-6 py-12 md:grid-cols-3">
        <div>
          <h2 className="text-base font-semibold">Contact</h2>
          <p className="mt-3 text-sm text-primary/80">
            123 Market Street, Suite 200
            <br />
            San Francisco, CA 94105
          </p>
          <p className="mt-3 text-sm text-primary/80">
            <a className="hover:text-primary" href="tel:+14155550120">
              +1 (415) 555-0120
            </a>
            <br />
            <a className="hover:text-primary" href="mailto:hello@brandname.com">
              hello@brandname.com
            </a>
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold">Support</h2>
          <div className="mt-3 flex flex-col gap-2 text-sm text-primary/80">
            <Link className="hover:text-primary" href="/help">
              Help Center
            </Link>
            <Link className="hover:text-primary" href="/faq">
              FAQs
            </Link>
            <Link className="hover:text-primary" href="/contact">
              Contact Form
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-base font-semibold">Company</h2>
          <div className="mt-3 flex flex-col gap-2 text-sm text-primary/80">
            <Link className="hover:text-primary" href="/about">
              About
            </Link>
            <Link className="hover:text-primary" href="/privacy">
              Privacy Policy
            </Link>
            <Link className="hover:text-primary" href="/terms">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-primary/30">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-4 text-xs text-primary/70 md:flex-row md:items-center md:justify-between">
          <span>© 2024 Brand Name. All rights reserved.</span>
          <span>Built for modern loyalty programs.</span>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
