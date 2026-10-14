"use client";

import Script from "next/script";

export function OneSignalScript() {
  const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;

  if (!appId) return null;

  return (
    <>
      <Script
        src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
        strategy="afterInteractive"
        defer
      />
      <Script id="onesignal-init" strategy="afterInteractive">
        {`
          window.OneSignalDeferred = window.OneSignalDeferred || [];
          OneSignalDeferred.push(async function(OneSignal) {
            await OneSignal.init({
              appId: "${appId}",
              safari_web_id: "",
              notifyButton: { enable: true },
              allowLocalhostAsSecureOrigin: true,
            });
          });
        `}
      </Script>
    </>
  );
}