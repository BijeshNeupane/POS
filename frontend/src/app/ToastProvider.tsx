"use client";

import dynamic from "next/dynamic";

const ClientToaster = dynamic(
  () => import("react-hot-toast").then((m) => m.Toaster),
  { ssr: false },
);

export default function ToasterProvider() {
  return (
    <ClientToaster
      position="bottom-right"
      toastOptions={{
        duration: 4000,
      }}
    />
  );
}
