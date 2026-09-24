"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await fetch("http://localhost:8000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data.message);
      return;
    }

    localStorage.setItem("token", data.token);

    console.log("ログイン成功:", data);

    router.push("/admin");
  }

  return (
    <main className="mx-auto max-w-md p-10">
      <h1 className="mb-8 text-3xl font-bold">管理者ログイン</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="mb-2 block">
            メールアドレス
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block">
            パスワード
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded border p-2"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded bg-black px-4 py-2 text-white"
        >
          ログイン
        </button>
      </form>
    </main>
  );
}