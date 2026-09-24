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
    console.log("送信するtoken:", token);

    const response = await fetch("http://localhost:8000/api/admin/posts", {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });

    const data = await response.json();

    console.log("管理画面用APIの返答:", data);

    if (!response.ok) {
        throw new Error("投稿の取得に失敗しました");
    }

    return data;
}

export default function BlogPage() {
    const router = useRouter();

    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    const handleDelete = async (id: number) => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/admin/login");
            return;
        }

        const confirmed = window.confirm("この投稿を削除しますか？");

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8000/api/posts/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            const data = await response.json();

            console.log("削除結果:", data);

            if (!response.ok) {
                throw new Error("投稿の削除に失敗しました");
            }

            setPosts((currentPosts) =>
                currentPosts.filter((post) => post.id !== id)
            );
        } catch (error) {
            console.error("投稿削除エラー:", error);
        }
    };

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
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold">Blog</h1>

                <button
                    type="button"
                    onClick={() => router.push("/admin/posts/create")}
                    className="rounded bg-black px-4 py-2 text-white"
                >
                    新規投稿
                </button>
            </div>

            <div className="space-y-6">
                {posts.map((post) => (
                    <article key={post.id} className="border-b pb-6">
                        <h2 className="text-xl font-semibold">{post.title}</h2>

                        <p className="mt-2">{post.body}</p>

                        <div className="mt-4 flex gap-4">
                            <a
                                href={`/blog/${post.id}`}
                                className="underline"
                            >
                                詳細を見る
                            </a>

                            <button
                                type="button"
                                onClick={() => router.push(`/admin/posts/${post.id}/edit`)}
                                className="rounded border px-4 py-2"
                            >
                                編集
                            </button>

                            <button
                                type="button"
                                onClick={() => handleDelete(post.id)}
                                className="rounded bg-red-600 px-4 py-2 text-white"
                            >
                                削除
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        </main>
    );
}