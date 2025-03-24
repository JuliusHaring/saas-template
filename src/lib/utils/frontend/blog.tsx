import { BlogPost } from "@/app/types";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import React from "react";

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPost | null> {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/content/blog/${slug}.mdx`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;

    const file = await res.text();
    const { content, data } = matter(file);

    if (
      !data.title ||
      !data.description ||
      !data.date ||
      !data.slug ||
      !data.author
    ) {
      throw new Error("Missing required frontmatter fields");
    }

    const compiled = await compileMDX({
      source: content,
      options: { parseFrontmatter: false },
      components: {
        h1: (props) => <h1 className="text-3xl font-bold my-6" {...props} />,
        h2: (props) => (
          <h2 className="text-2xl font-semibold mt-6 mb-2" {...props} />
        ),
        p: (props) => <p className="leading-relaxed mb-4" {...props} />,
        ul: (props) => <ul className="list-disc list-inside mb-4" {...props} />,
        li: (props) => <li className="mb-1" {...props} />,
        a: (props) => <a className="text-blue-600 underline" {...props} />,
        hr: () => <hr className="my-8 border-gray-300" />,
        // extend as needed...
      },
    });

    return {
      title: data.title,
      description: data.description,
      date: data.date,
      slug: data.slug,
      author: data.author,
      content: compiled.content,
    };
  } catch (err) {
    console.error("Error loading post:", err);
    return null;
  }
}
