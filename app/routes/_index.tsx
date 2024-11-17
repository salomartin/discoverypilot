import { lazy, Suspense, useEffect, useState } from "react";
import type { MetaFunction } from "@remix-run/cloudflare";
import { ClientOnly } from "remix-utils/client-only";
import { AnimatePresence, motion } from "framer-motion";
import { AGENT_INFO, INTRO_TEXTS } from "content/frontend";

const VoiceClient = lazy(() => import("../components/VoiceClient.client"));

export const meta: MetaFunction = () => {
  return [
    { title: "Realtime Voice Test" },
    { name: "description", content: "Test realtime voice capabilities" },
  ];
};

export default function Index() {
  const [introText, setIntroText] = useState("");
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * INTRO_TEXTS.length);
    setIntroText(INTRO_TEXTS[randomIndex]);
  }, []);
  return (
    <div className="min-h-full flex flex-col justify-between items-center p-8 pb-[env(safe-area-inset-bottom)] text-[#012854] font-['Montserrat',sans-serif] relative overflow-y-auto box-border">
      <div className="w-full max-w-2xl flex flex-col items-center justify-center flex-grow relative z-10 pb-[calc(env(safe-area-inset-bottom)+10rem)]">
        {/* Logo - Fixed position at top */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="w-56 mb-4 md:mb-8 fixed top-0 pt-[calc(env(safe-area-inset-top)+2rem)]"
        >
          <img
            src="/assets/logo-light.svg"
            alt="Neverpay Logo"
            className="w-full"
          />
        </motion.div>
        {/* Content Container - Fixed height to prevent layout shifts */}
        <div className="relative h-[400px] w-full flex items-center justify-center mt-20">
          {/* Intro Text */}
          <AnimatePresence mode="wait">
            <motion.div
              key="intro-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-2xl md:text-4xl font-light text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full"
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: introText.replace(
                    AGENT_INFO.SHORT_NAME,
                    `<strong>${AGENT_INFO.SHORT_NAME}</strong>`
                  ),
                }}
              />
            </motion.div>
          </AnimatePresence>
          <ClientOnly>
            {() => (
              <Suspense>
                <VoiceClient />
              </Suspense>
            )}
          </ClientOnly>
        </div>
      </div>
    </div>
  );
}
