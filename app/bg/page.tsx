import ThemeSwitch from "@/components/ThemeSwitch";
import BackgroundFog from "@/components/BackgroundFog";

const BgPage = () => {
  return (
    <main className="min-h-[400vh] text-contrast">
      <BackgroundFog showBounds showScrollPercent />
      <div className="fixed right-6 top-6 z-20 flex items-center gap-2 rounded-full border border-accent-3 bg-accent-1/80 px-4 py-2 backdrop-blur">
        <ThemeSwitch
          showLabel={false}
          iconClassName="h-5 w-5 text-contrast"
        />
        <span className="text-xs text-contrast/70">Theme</span>
      </div>
      <div className="mx-auto max-w-4xl px-6 py-24">
        <h1 className="text-3xl font-semibold text-contrast">Background Demo</h1>
        <p className="mt-4 text-contrast/70">
          Scroll to see the fog move. This page is intentionally tall so you can
          test continuous motion.
        </p>
      </div>
    </main>
  );
};

export default BgPage;
