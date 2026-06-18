import { redirect } from "next/navigation";

export default function LegacySlugRedirect({
  params,
}: {
  params: { slug: string };
}) {
  const raw = Number.parseInt(params.slug, 10);
  const n = Number.isFinite(raw) && raw > 0 ? raw : 1;
  redirect(`/t/identity-${n}`);
}
