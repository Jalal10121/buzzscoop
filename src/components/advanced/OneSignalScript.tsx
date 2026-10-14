"use client";

import Script from "next/script";

export function OneSignalScript() {
  const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;

  // Don't load if not configured
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
              allowLocalhostAsSecureOrigin: true,
              notifyButton: {
                enable: true,
                size: "medium",
                theme: "default",
                position: "bottom-right",
                offset: {
                  bottom: "20px",
                  right: "20px"
                },
                showCredit: false,
                text: {
                  "tip.state.unsubscribed": "🔔 Get Breaking News Alerts",
                  "tip.state.subscribed": "✅ You're subscribed to alerts",
                  "tip.state.blocked": "You blocked notifications",
                  "message.prenotify": "Click to subscribe to BuzzScoop alerts",
                  "message.action.subscribed": "Thanks! You'll get breaking news alerts.",
                  "message.action.resubscribed": "You're subscribed to alerts",
                  "message.action.unsubscribed": "You won't receive alerts anymore",
                  "dialog.main.title": "Manage BuzzScoop Alerts",
                  "dialog.main.button.subscribe": "SUBSCRIBE",
                  "dialog.main.button.unsubscribe": "UNSUBSCRIBE",
                  "dialog.blocked.title": "Unblock Notifications",
                  "dialog.blocked.message": "Follow these instructions to allow alerts:"
                }
              },
              promptOptions: {
                slidedown: {
                  enabled: true,
                  autoPrompt: false,
                  actionMessage: "Get instant alerts when we publish new entertainment news!",
                  acceptButtonText: "ALLOW",
                  cancelButtonText: "LATER",
                  categories: {
                    tags: [
                      { tag: "netflix", label: "Netflix News" },
                      { tag: "hollywood", label: "Hollywood News" },
                      { tag: "marvel", label: "Marvel News" },
                      { tag: "music", label: "Music News" }
                    ]
                  }
                }
              },
              welcomeNotification: {
                disable: true
              }
            });
          });
        `}
      </Script>
    </>
  );
}