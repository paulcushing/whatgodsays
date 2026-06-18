import type { Metadata } from "next";

import { bundledContent, getShareableTruthById } from "@/data/content";
import TruthLinkScreen from "./TruthLinkScreen";

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const truth = getShareableTruthById(params.id, bundledContent);

  if (!truth) {
    return {
      title: "Truth not found — What God Says About Me",
      description: "An encouraging reminder of what God says about you.",
    };
  }

  const title = `"${truth.statement}"`;
  const description = `${truth.verse} — ${truth.reference}`;
  const url = `/t/${encodeURIComponent(truth.id)}`;

  return {
    title,
    description,
    openGraph: {
      type: "article",
      siteName: "What God Says About Me",
      title,
      description,
      url,
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export default function Page({ params }: { params: { id: string } }) {
  return <TruthLinkScreen params={params} />;
}
