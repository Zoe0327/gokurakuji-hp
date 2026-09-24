<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;

use App\Models\Post;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::where('status', 'public')->get();

        return $posts;
    }

    public function adminIndex()
    {
        $posts = Post::all();

        return $posts;
    }

    public function adminShow($id)
    {
        $post = Post::findOrFail($id);

        return $post;
    }

    public function show($id)
    {
        $post = Post::where('id', $id)
            ->where('status', 'public')
            ->firstOrFail();

        return $post;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'status' => 'required|in:draft,public',
        ]);

        $post = Post::create($validated);

        return $post;
    }

    public function update(Request $request, $id)
    {
    
        $post = Post::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'status' => 'required|in:draft,public',
        ]);

        $post->update($validated);

        return $post;
    }

    public function destroy($id)
    {
        $post = Post::findOrFail($id);

        $post->delete();

        return response()->json([
            'message' => '投稿を削除しました。',
        ]);
    }
}