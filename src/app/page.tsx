"use client";

import { baseUrl } from "@/lib/utils/base-url";

export default function Home() {
  return (
    <div>
      Todo: fill me
      <script
        async
        src="http://localhost:3000/api/chatbot/integrate?chatbotId=d7a3a67a-9985-4224-bb7f-173e2b816c68"
        api-url={baseUrl}
      ></script>
    </div>
  );
}
