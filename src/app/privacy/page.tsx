import Link from "next/link";
import Footer from "@/app/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — What God Says About Me",
  description:
    "The privacy policy for the What God Says About Me app and website.",
};

export default function Page() {
  return (
    <div className="flex flex-col w-screen min-h-screen m-0 p-0 justify-between bg-white">
      <div className="h-1.5 bg-gradient-to-r from-slate-400 to-slate-200" />
      <div className="flex-grow w-full max-w-[720px] mx-auto px-6 pt-12 pb-24 text-gray-900 leading-relaxed">
        <Link
          href="/"
          className="touch-pan-y inline-block px-2 py-1 mb-5 font-medium tracking-wider text-gray-700 uppercase text-xxs hover:bg-slate-200 rounded-full"
        >
          <svg
            className="inline-block mr-2 pb-1"
            fill="#000000"
            height="24px"
            width="24px"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 476.213 476.213"
            xmlSpace="preserve"
          >
            <polygon points="476.213,223.107 57.427,223.107 151.82,128.713 130.607,107.5 0,238.106 130.607,368.714 151.82,347.5 57.427,253.107 476.213,253.107 " />
          </svg>
          Back
        </Link>

        <header className="mb-10">
          <p className="uppercase tracking-[1.5px] text-xs font-semibold text-gray-600 mb-2">
            What God Says About Me
          </p>
          <h1 className="text-[clamp(2rem,6vw,3rem)] leading-[1.1] font-extrabold mb-3">
            Privacy Policy
          </h1>
          <p className="text-gray-600 text-[15px]">Effective June 13, 2026</p>
        </header>

        <p className="text-[17px] mb-4">
          We built <strong>What God Says About Me</strong> to do one thing:
          remind you of who God says you are. We want that to feel like a quiet,
          trustworthy place — so we collect almost nothing, and we never sell or
          share what little there is. This page explains exactly what happens to
          your information when you use the app or the website at
          whatgodsaysabout.me.
        </p>

        <div className="bg-gradient-to-r from-slate-100 to-white border-l-[6px] border-slate-400 rounded-lg px-5 py-4 my-6">
          <p className="text-[17px]">
            <strong>The short version:</strong> Your name and personalization
            settings stay on your own device — we never see them. The only
            information that reaches us is what you type into the contact form,
            and we use that solely to write you back. No tracking, no ads, no
            selling your data. Ever.
          </p>
        </div>

        <h2 className="text-2xl font-extrabold mt-10 mb-3">
          What stays on your device
        </h2>
        <p className="text-[17px] mb-4">
          When you turn on personalization, the app saves a few preferences in
          local storage on your phone so it can greet you by name next time:
        </p>
        <ul className="list-disc pl-[22px] text-[17px] space-y-1.5">
          <li>Your first name</li>
          <li>Your gender selection (used to adjust pronouns in the verses)</li>
          <li>Whether personalization is turned on</li>
          <li>
            A short list of recently shown verses, so the app avoids repeats
          </li>
        </ul>
        <p className="text-[17px] mt-4 mb-4">
          This information lives only on your device. It is never transmitted to
          us or to anyone else. If you delete the app, it goes with it. You can
          also clear it any time by turning personalization off or removing the
          app.
        </p>

        <h2 className="text-2xl font-extrabold mt-10 mb-3">
          What you choose to send us
        </h2>
        <p className="text-[17px] mb-4">
          The only information that leaves your device is what you enter into the{" "}
          <strong>Contact</strong> form, and only when you tap Send. That
          includes:
        </p>
        <ul className="list-disc pl-[22px] text-[17px] space-y-1.5">
          <li>Your name</li>
          <li>Your email address</li>
          <li>The message you write</li>
        </ul>
        <p className="text-[17px] mt-4 mb-4">
          We use this strictly to read your message and reply to you. The form
          is delivered through our own mail service at api.paulcushing.dev. We do
          not add you to any marketing list, and we do not share your message
          with third parties.
        </p>

        <h2 className="text-2xl font-extrabold mt-10 mb-3">What we don&apos;t do</h2>
        <ul className="list-disc pl-[22px] text-[17px] space-y-1.5">
          <li>We don&apos;t use analytics or tracking tools.</li>
          <li>We don&apos;t show ads.</li>
          <li>We don&apos;t sell, rent, or trade your information.</li>
          <li>
            We don&apos;t require an account, and we don&apos;t build a profile
            on you.
          </li>
        </ul>

        <h2 className="text-2xl font-extrabold mt-10 mb-3">Verse content</h2>
        <p className="text-[17px] mb-4">
          The app downloads its collection of verses from a static file hosted
          on GitHub Pages. This is a simple, one-way download of public content —
          no personal information is sent in that request.
        </p>

        <h2 className="text-2xl font-extrabold mt-10 mb-3">Third parties</h2>
        <p className="text-[17px] mb-4">
          Because the app is distributed through the Apple App Store and Google
          Play, those platforms may collect their own diagnostic information
          under their respective privacy policies. The contact form is processed
          by our own email infrastructure. We do not integrate any other
          third-party data collectors.
        </p>

        <h2 className="text-2xl font-extrabold mt-10 mb-3">
          Children&apos;s privacy
        </h2>
        <p className="text-[17px] mb-4">
          The app is not directed to children under 13, and we do not knowingly
          collect personal information from them. If you believe a child has sent
          us information through the contact form, please email us and we will
          delete it.
        </p>

        <h2 className="text-2xl font-extrabold mt-10 mb-3">
          How long we keep things
        </h2>
        <p className="text-[17px] mb-4">
          On-device preferences remain until you remove them. Messages sent
          through the contact form are kept only as long as needed to respond to
          you and maintain a reasonable record of our correspondence, after which
          they are deleted.
        </p>

        <h2 className="text-2xl font-extrabold mt-10 mb-3">
          Your choices and rights
        </h2>
        <p className="text-[17px] mb-4">
          You&apos;re in control of your information. You can clear all on-device
          data by turning off personalization or uninstalling the app. To ask
          what contact information we hold about you, or to request that we
          delete it, just email us at the address below and we&apos;ll take care
          of it. Depending on where you live, you may have additional rights
          under laws such as the GDPR or CCPA; we honor those requests.
        </p>

        <h2 className="text-2xl font-extrabold mt-10 mb-3">Security</h2>
        <p className="text-[17px] mb-4">
          All network requests the app makes use encrypted HTTPS connections.
          While no system can promise perfect security, we keep what we handle to
          a bare minimum precisely so there is very little to protect.
        </p>

        <h2 className="text-2xl font-extrabold mt-10 mb-3">
          Changes to this policy
        </h2>
        <p className="text-[17px] mb-4">
          If we ever update this policy, we&apos;ll revise the effective date at
          the top of this page. Meaningful changes will be reflected here before
          they take effect.
        </p>

        <h2 className="text-2xl font-extrabold mt-10 mb-3">Contact us</h2>
        <p className="text-[17px] mb-4">
          Questions about your privacy, or anything else? We&apos;d genuinely
          love to hear from you. Reach us at{" "}
          <a
            href="mailto:paulcushing@ndevrs.com"
            className="underline decoration-slate-400 decoration-2 underline-offset-2 hover:decoration-slate-600"
          >
            paulcushing@ndevrs.com
          </a>
          .
        </p>

        <footer className="mt-16 pt-6 border-t border-gray-200 text-gray-600 text-sm">
          <p>
            What God Says About Me is operated by NDEVRS LLC. &copy; 2026 NDEVRS
            LLC. Built for God&apos;s glory and your joy.
          </p>
        </footer>
      </div>
      <Footer />
    </div>
  );
}
