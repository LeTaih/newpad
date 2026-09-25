import Link from "next/link";
import { notFound } from "@/content/site";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-5 text-center">
      <div className="glass w-full max-w-md rounded-3xl px-8 py-12">
        <h1 className="text-[clamp(2rem,6vw,3rem)] leading-[1.05] font-semibold tracking-[-0.035em] text-balance">
          {notFound.title}
        </h1>
        <p className="mt-4 text-lg text-muted">{notFound.body}</p>
        <Link
          href="/"
          className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-fg px-6 text-[15px] font-medium tracking-tight whitespace-nowrap text-ink transition-[transform,background-color] duration-200 ease-spring hover:bg-white active:scale-[0.97]"
        >
          {notFound.cta}
        </Link>
      </div>
    </main>
  );
}
