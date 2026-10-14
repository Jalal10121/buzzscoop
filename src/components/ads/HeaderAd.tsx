import { AdUnit } from "./AdUnit";

export function HeaderAd() {
  // If AdSense not configured, render nothing (no empty space)
  if (!process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto mb-4 sm:mb-6">
      <AdUnit
        slot="1234567890"
        format="horizontal"
        className="min-h-[60px] sm:min-h-[90px]"
      />
    </div>
  );
}