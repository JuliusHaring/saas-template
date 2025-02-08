"use client";

import { baseUrl } from "@/lib/utils/base-url";

export default function Home() {
  return (
    <div>
      Todo: fill me
      <script
        async
        src="/api/chatbot/integrate"
        chatbot-id="39810b3e-6828-490c-9f5c-9cf02ee21792"
        api-url={baseUrl}
      ></script>
    </div>
  );
}
