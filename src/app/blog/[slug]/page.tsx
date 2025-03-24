import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/lib/utils/frontend/blog";
import type { Metadata } from "next";
import { NEXT_PUBLIC_BASE_URL } from "@/lib/utils/environment";
import Headline from "@/lib/components/shared/molecules/Headline";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return notFound();

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `${NEXT_PUBLIC_BASE_URL}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url: `${NEXT_PUBLIC_BASE_URL}/blog/${post.slug}`,
      authors: [post.author],
    },
    twitter: {
      card: "summary",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return notFound();

  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-gray-800">
      <Headline className="text-blue-600">{post.title}</Headline>
      <p className="text-sm text-gray-500 mb-8">
        {new Date(post.date).toLocaleDateString("de-DE")} · {post.author}
      </p>
      <article className="prose prose-neutral">{post.content}</article>
    </main>
  );
}
