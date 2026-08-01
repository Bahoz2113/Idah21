import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalPageView } from "@/components/content/LocalPageView";
import { LOCAL_PAGES } from "@/lib/site";

const SLUG = "batman-robotik-kodlama-kursu";
const page = LOCAL_PAGES.find((p) => p.slug === SLUG);

export const metadata: Metadata = {
  title: page?.title,
  description: page?.description,
  alternates: { canonical: `/${SLUG}` },
};

export default function Page() {
  if (!page) notFound();
  return <LocalPageView page={page} />;
}
