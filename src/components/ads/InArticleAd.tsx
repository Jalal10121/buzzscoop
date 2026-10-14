import { AdUnit } from "./AdUnit";

export function InArticleAd() {
  return (
    <div className="my-8">
      <AdUnit
        slot="2345678901"
        format="rectangle"
        className="min-h-[250px]"
      />
    </div>
  );
}