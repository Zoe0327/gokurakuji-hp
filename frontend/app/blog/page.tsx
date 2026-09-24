"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Post = {
    id: number;
    title: string;
    body: string;
    status: string;
    published_at: string | null;
};

async function getPosts(token: string): Promise<Post[]> {
    const response = await fetch("http://localhost:8000/api/admin/posts", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("投稿の取得に失敗しました");
    }

    return response.json();
}

export default function BlogPage() {
    const router = useRouter();

    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/admin/login");
            return;
        }

        getPosts(token)
            .then((data) => {
                setPosts(data);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [router]);

    if (loading) {
        return <p className="p-10">読み込み中...</p>;
    }

    return (
        <main className="p-10">
            <h1 className="mb-8 text-3xl font-bold">Blog</h1>

            <div className="space-y-6">
                {posts.map((post) => (
                    <article key={post.id} className="border-b pb-6">
                        <h2 className="text-xl font-semibold">
                            {post.title}
                        </h2>

                        <p className="mt-2">{post.body}</p>

                        <p className="mt-2 text-sm">
                            状態：{post.status}
                        </p>

                        <a
                            href={`/blog/${post.id}`}
                            className="mt-4 inline-block underline"
                        >
                            詳細を見る
                        </a>
                    </article>
                ))}
            </div>
        </main>
    );
}