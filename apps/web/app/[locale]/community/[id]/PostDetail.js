'use client';
import { useEffect, useState } from 'react';

export default function PostDetail({ id }) {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const loadC = () => fetch(`/api/community/posts/${id}/comments`).then((r) => r.json()).then((j) => setComments(j.data || []));
  useEffect(() => {
    fetch(`/api/community/posts/${id}`).then((r) => r.json()).then((j) => setPost(j.data));
    loadC();
  }, [id]);

  async function like() { await fetch('/api/community/likes', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ postId: id }) }); setPost((p) => ({ ...p, likes: (p.likes || 0) + 1 })); }
  async function comment(e) { e.preventDefault(); if (!text.trim()) return; await fetch(`/api/community/posts/${id}/comments`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ comment: text }) }); setText(''); loadC(); }

  if (!post) return <p className="text-sm text-gray-500">Loading…</p>;
  return (
    <div className="space-y-4">
      <article className="rounded-2xl border border-gray-200 bg-white p-5">
        <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-semibold text-brand capitalize">{post.category}</span>
        <h1 className="mt-2 text-xl font-bold text-gray-900">{post.title}</h1>
        <p className="mt-2 whitespace-pre-wrap text-gray-700">{post.content}</p>
        <p className="mt-2 text-xs text-gray-400">{post.author} · {String(post.created_at).slice(0, 10)}</p>
        <button onClick={like} className="mt-3 rounded-lg border border-gray-300 px-3 py-1.5 text-sm">♥ Like ({post.likes || 0})</button>
      </article>
      <section className="space-y-2">
        <h2 className="text-sm font-bold text-gray-900">Comments</h2>
        <form onSubmit={comment} className="flex gap-2"><input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a comment…" className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" /><button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Send</button></form>
        {comments.map((c) => <div key={c.id} className="rounded-xl border border-gray-200 bg-white p-3 text-sm"><p className="text-gray-700">{c.comment}</p><p className="text-xs text-gray-400">{c.author} · {String(c.created_at).slice(0, 10)}</p></div>)}
      </section>
    </div>
  );
}
