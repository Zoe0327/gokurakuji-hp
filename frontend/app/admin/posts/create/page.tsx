"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePostPage() {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [status, setStatus] = useState("draft");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            console.error("ログインしてください");
            return;
        }

        const response = await fetch("http://localhost:8000/api/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                title,
                body,
                status,
            }),
        });

        const data = await response.json();

        console.log("Laravelからの返答:", data);
        router.push("/admin");
    }

    return (
        <main className="mx-auto max-w-3xl p-10">
            <h1 className="mb-8 text-3xl font-bold">新規投稿</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="mb-2 block">
                        タイトル
                    </label>

                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        className="w-full rounded border p-2"
                    />
                </div>

                <div>
                    <label htmlFor="body" className="mb-2 block">
                        本文
                    </label>

                    <textarea
                        id="body"
                        value={body}
                        onChange={(event) => setBody(event.target.value)}
                        rows={10}
                        className="w-full rounded border p-2"
                    />
                </div>

                <div>
                    <label htmlFor="status" className="mb-2 block">
                        公開状態
                    </label>

                    <select
                        id="status"
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                        className="rounded border p-2"
                    >
                        <option value="draft">下書き</option>
                        <option value="published">公開</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="rounded bg-black px-6 py-2 text-white"
                >
                    保存
                </button>
            </form>
        </main>
    );
}