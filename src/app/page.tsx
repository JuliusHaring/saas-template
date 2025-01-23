"use client";

import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <script
        src="http://localhost:3000/api/integrate-chatbot"
        assistant-id="asst_6hG2S7KCwvihuJx0Xxg0Aic2"
        api-url="http://localhost:3000"
      ></script>

      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        {/* Rest of your component */}
      </main>
    </div>
  );
}
