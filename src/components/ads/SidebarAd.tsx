import { AdUnit } from "./AdUnit";

export function SidebarAd() {
  return (
    <div className="my-6">
      <AdUnit
        slot="3456789012"
        format="vertical"
        className="min-h-[600px]"
      />
    </div>
  );
}