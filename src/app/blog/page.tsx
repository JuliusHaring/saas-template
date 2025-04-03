import { Metadata } from "next";
import Link from "next/link";
import { XMLParser } from "fast-xml-parser";
import { getBlogPostBySlug } from "@/lib/utils/frontend/blog";
import type { BlogPost } from "@/app/types";
import Headline from "@/lib/components/shared/molecules/Headline";

// TODO: Edit metadata for blog
export const metadata: Metadata = {
  title: `Blog - REPLACE_ME`,
  description: "",
};

const SITEMAP_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap-0.xml`;

async function getBlogSlugsFromSitemap(): Promise<string[]> {
  const res = await fetch(SITEMAP_URL);
  const xml = await res.text();
  const parser = new XMLParser();
  const parsed = parser.parse(xml);

  const allUrls = parsed.urlset.url;
  const entries = Array.isArray(allUrls) ? allUrls : [allUrls];

  /* eslint-disable @typescript-eslint/no-explicit-any */
  return entries
    .map((entry: any) => entry.loc)
    .filter((url: string) => url.includes("/blog/"))
    .map((url: string) => url.split("/blog/")[1]);
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

export default async function BlogPage() {
  const slugs = await getBlogSlugsFromSitemap();
  const posts: BlogPost[] = [];

  for (const slug of slugs) {
    const post = await getBlogPostBySlug(slug);
    if (post) posts.push(post);
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-gray-800">
      <Headline className="text-blue-600">Blog</Headline>
      <ul className="space-y-8 mt-10">
        {posts
          .sort(
            (a, b) =>
              new Date(b.date).getUTCDate() - new Date(a.date).getUTCDate(),
          )
          .map((post) => (
            <li key={post.slug} className="border-b pb-6 mt-2">
              <Headline level={2} className="hover:text-blue-600">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </Headline>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(post.date).toLocaleDateString("de-DE")} ·{" "}
                {post.author}
              </p>
              <p className="mt-2 text-gray-700">{post.description}</p>
            </li>
          ))}
      </ul>
    </main>
  );
}
