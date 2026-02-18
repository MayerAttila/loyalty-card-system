import Link from "next/link";

const MainFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand text-primary">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-base font-semibold">Loyale</h2>
          <div className="flex flex-wrap items-center text-sm text-primary/80">
            <Link className="hover:text-primary" href="/privacy">
              Privacy
            </Link>
            <span className="mx-2 text-primary/50">|</span>
            <Link className="hover:text-primary" href="/terms">
              Terms
            </Link>
            <span className="mx-2 text-primary/50">|</span>
            <a className="hover:text-primary" href="mailto:support@loyale.online">
              Contact
            </a>
          </div>
        </div>

        <div className="mt-6 border-t border-primary/30 pt-4">
          <div className="flex flex-col gap-2 text-xs text-primary/70 md:flex-row md:items-center md:justify-between">
            <span>&copy; {currentYear} Loyale</span>
            <span>Developed by MayerAttila</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
