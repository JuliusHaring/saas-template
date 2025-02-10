"use client";

import { baseUrl } from "@/lib/utils/base-url";

export default function Home() {
  return (
    <div>
      Todo: fill me
      <script
        async
        src="/api/chatbot/integrate"
        chatbot-id="bffdafea-41bb-4590-863f-6fa77857c466"
        api-url={baseUrl}
      ></script>
    </div>
  );
}
