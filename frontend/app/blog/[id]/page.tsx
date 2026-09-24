type Post = {
    id: number;
    title: string;
    body: string;
    status: string;
    published_at: string | null;
};

async function getPost(id: string): Promise<Post> {
    const response = await fetch(`http://localhost:8000/api/posts/${id}`);

    if (!response.ok) {
        throw new Error("投稿の取得に失敗しました");
    }

    return response.json();
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const post = await getPost(id);

    return (
        <main className="p-10">
            <article>
                <h1 className="text-3xl font-bold">{post.title}</h1>
                <p className="mt-6">{post.body}</p>
            </article>
        </main>
    );
}