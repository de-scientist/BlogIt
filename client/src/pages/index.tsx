import Link from "next/link";


export default function Home() {
return (
<section className="text-center py-20">
<h1 className="text-4xl font-bold">Welcome to TechBlog</h1>
<p className="mt-4 text-lg">Write, share, recover — and tell the truth straight.</p>
<div className="mt-8 flex justify-center gap-4">
<Link href="/auth/register"><a className="btn">Get started</a></Link>
<Link href="/blogs/list"><a className="btn-outline">Browse blogs</a></Link>
</div>
</section>
);
}