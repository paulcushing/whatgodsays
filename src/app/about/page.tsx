import Link from "next/link";
import type { Metadata } from "next";

import ContactForm from "@/app/contactform";
import Footer from "@/app/footer";

export const metadata: Metadata = {
  title: "About — What God Says About Me",
  description: "Why this app exists and how to get in touch.",
};

export default function Page() {
  return (
    <div className="min-h-[100dvh] bg-page">
      <div className="mx-auto w-full max-w-[480px] px-6 pb-16 pt-10">
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center text-[13px] font-extrabold uppercase tracking-[1.2px] text-accentDeep focus-ring"
        >
          ← Back
        </Link>

        <h1 className="mt-2 font-serif text-[44px] leading-[52px] text-scriptureInk">
          About
        </h1>

        <div className="mt-4 flex flex-col gap-4 text-[17px] leading-[25px] text-softInk">
          <p>
            We&apos;re so glad you found your way here. This simple app exists for
            one reason: to remind you of who you really are.
          </p>
          <p>
            Following Jesus was never a promise that life would be easy — but it
            is an invitation into something far better. He welcomes you as a
            beloved son or daughter of the God who made the universe, and made
            you.
          </p>
          <p>
            You are seen. You are cared for. You are deeply loved. And the One who
            created you longs to know you.
          </p>
        </div>

        <h2 className="mt-6 font-serif text-2xl text-ink">Contact Us</h2>
        <ContactForm />
      </div>
      <Footer />
    </div>
  );
}
