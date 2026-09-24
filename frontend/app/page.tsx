type Post = {
  id: number;
  title: string;
  body: string;
  status: string;
  published_at: string | null;
};

async function getPosts(): Promise<Post[]> {
  const response = await fetch("http://localhost:8000/api/posts");

  if (!response.ok) {
    throw new Error("投稿の取得に失敗しました");
  }

  return response.json();
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <main className="p-10">
      <h1 className="mb-6 text-3xl font-bold">極楽寺からのお知らせ</h1>

      {posts.map((post) => (
        <article key={post.id} className="mb-6">
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <p className="mt-2">{post.body}</p>
        </article>
      ))}
    </main>
  );
}