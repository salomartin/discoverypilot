import { lazy, Suspense } from 'react';
import type { MetaFunction } from "@remix-run/cloudflare";
import { ClientOnly } from "remix-utils/client-only";

const VoiceClient = lazy(() => import('../components/VoiceClient.client'));

export const meta: MetaFunction = () => {
  return [
    { title: "Realtime Voice Test" },
    { name: "description", content: "Test realtime voice capabilities" },
  ];
};

export default function Index() {
  return (
    <ClientOnly fallback={<div>Loading...</div>}>
      {() => (
        <Suspense fallback={<div>Loading voice client...</div>}>
          <VoiceClient />
        </Suspense>
      )}
    </ClientOnly>
  );
}
