"use client";

import Link from "next/link";

import { ActionPill } from "@/components/ActionPill";
import { BibleReferenceLink } from "@/components/BibleReferenceLink";
import { ShareTruthCard } from "@/components/ShareTruthCard";
import { Toast } from "@/components/Toast";
import { useContent } from "@/data/ContentProvider";
import { getShareableTruthById } from "@/data/content";
import { useShareTruth } from "@/hooks/useShareTruth";

export default function TruthLinkScreen({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const content = useContent();
  const truth = getShareableTruthById(id, content);
  const share = useShareTruth();

  if (!truth) {
    return (
      <div className="min-h-[100dvh] bg-page">
        <div className="mx-auto w-full max-w-[480px] px-6 pt-10">
          <div className="rounded-xl bg-surface p-7">
            <h1 className="font-serif text-[30px] leading-[38px] text-scriptureInk">
              Truth not found
            </h1>
            <p className="mt-2.5 text-[15px] leading-[23px] text-softInk">
              This link may have changed. You can return to Today and find a
              truth to sit with.
            </p>
            <Link
              href="/"
              className="mt-[18px] inline-block text-[15px] font-extrabold text-accentDeep focus-ring"
            >
              Return to Today
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-page">
      <div className="mx-auto w-full max-w-[480px] px-6 pt-10">
        <div className="rounded-xl border border-borderSoft bg-surface p-[30px] shadow-card">
          <p className="text-center text-[11px] font-extrabold uppercase tracking-[1.6px] text-accent">
            {truth.category}
          </p>
          <p className="mt-[18px] text-center font-serif text-[31px] leading-[41px] text-scriptureInk">
            {truth.statement}
          </p>
          <p className="mt-[18px] text-center font-serif italic text-base text-accentDeep">
            <BibleReferenceLink reference={truth.reference} className="focus-ring" />
          </p>
          <p className="mt-4 text-center text-[15px] leading-6 text-softInk">
            {truth.verse}
          </p>
          <p className="mt-[22px] border-t border-borderSoft pt-3.5 text-center font-serif italic text-[13px] text-mutedInkAlt">
            whatgodsaysabout.me
          </p>
        </div>

        <p className="mt-6 text-center font-serif text-[19px] text-ink">
          Encourage a friend with this truth.
        </p>

        <div className="mt-[18px] flex flex-col gap-2.5">
          <ActionPill
            label="Copy link"
            variant="tint"
            onClick={() => void share.copyTruthLink(truth.id)}
          />
          <ActionPill
            label="Share with a friend"
            variant="dark"
            onClick={() => share.openShareTruth(truth.id)}
          />
        </div>

        <Link
          href="/"
          className="mt-6 block text-center text-sm font-bold text-softInk focus-ring"
        >
          Return to Today
        </Link>
      </div>

      <ShareTruthCard
        visible={share.shareTruthId !== null}
        truth={truth}
        onClose={share.closeShareTruth}
        onCopy={() => void share.copyTruthLink(truth.id)}
        onShare={() => void share.shareWithFriend(truth.id)}
      />
      <Toast message={share.toast} />
    </div>
  );
}
