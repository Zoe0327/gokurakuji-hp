"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Post = {
    id: number;
    title: string;
    body: string;
    status: string;
    published_at: string | null;
};

export default function EditPostPage() {
    const params = useParams();
    const router = useRouter();

    const [post, setPost] = useState<Post | null>(null);

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [status, setStatus] = useState("");

    const handleUpdate = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.log("トークンがありません");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8000/api/posts/${params.id}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        title: title,
                        body: body,
                        status: status,
                    }),
                }
            );

            const data = await response.json();

            console.log("更新結果:", data);
            router.push("/admin");
        } catch (error) {
            console.error("投稿更新エラー:", error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.log("トークンがありません");
            return;
        }

        fetch(`http://localhost:8000/api/admin/posts/${params.id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("編集する投稿:", data);

                setPost(data);
                setTitle(data.title);
                setBody(data.body);
                setStatus(data.status);
            })
            .catch((error) => {
                console.error("投稿取得エラー:", error);
            });
    }, [params.id]);

    return (
        <main className="p-10">
            <h1 className="mb-8 text-3xl font-bold">投稿を編集</h1>

            <p>投稿ID：{params.id}</p>

            {post && (
                <div className="mt-8 space-y-6">
                    <div>
                        <label className="mb-2 block font-bold">
                            タイトル
                        </label>

                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded border p-2"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-bold">
                            本文
                        </label>

                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            rows={10}
                            className="w-full rounded border p-2"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-bold">
                            公開状態
                        </label>

                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="rounded border p-2"
                        >
                            <option value="draft">下書き</option>
                            <option value="public">公開</option>
                        </select>
                    </div>
                    <button
                        type="button"
                        onClick={handleUpdate}
                        className="rounded bg-blue-600 px-4 py-2 text-white"
                    >
                        更新する
                    </button>
                </div>
            )}
        </main>
    );
}