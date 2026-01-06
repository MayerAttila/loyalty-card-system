import Link from "next/link";

const MainHeader = () => {
  return (
    <div className="bg-brand">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6 text-primary">
        <Link className="text-lg font-semibold" href="/">
          Brand Name
        </Link>
        <div className="flex items-center gap-4 text-sm font-semibold">
          <Link
            className="text-primary/80 hover:text-primary"
            href="/register"
          >
            Register
          </Link>
          <Link
            className="rounded-lg bg-primary px-3 py-1.5 text-brand hover:bg-primary/90"
            href="/login"
          >
            Log In
          </Link>
        </div>
      </header>
    </div>
  );
};

export default MainHeader;
