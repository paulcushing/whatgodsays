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
          <p className="text-gray-600 text-[15px]">Effective June 19, 2026</p>
        </header>

        <p className="text-[17px] mb-4">
          We built <strong>What God Says About Me</strong> to do one thing:
          remind you of who God says you are. We want that to feel like a quiet,
          trustworthy place — so your personal experience stays in your own
          browser. This page explains exactly what happens to your information
          when you use the website at whatgodsaysabout.me.
        </p>

        <div className="bg-gradient-to-r from-slate-100 to-white border-l-[6px] border-slate-400 rounded-lg px-5 py-4 my-6">
          <p className="text-[17px]">
            <strong>The short version:</strong> Your name, personalization
            settings, saved truths, custom promises, and journal reflections
            stay in your own browser — we never see them. We use
            privacy-friendly, cookieless analytics to understand overall usage,
            but there are no accounts, no ads, and we never sell your data. Ever.
          </p>
        </div>

        <h2 className="text-2xl font-extrabold mt-10 mb-3">
          What stays in your browser
        </h2>
        <p className="text-[17px] mb-4">
          The site saves preferences and user-created content in your
          browser&apos;s local storage so it can remember your experience:
        </p>
        <ul className="list-disc pl-[22px] text-[17px] space-y-1.5">
          <li>Your first name</li>
          <li>Your gender selection (used to adjust pronouns in the verses)</li>
          <li>Whether personalization is turned on</li>
          <li>Your saved truth IDs</li>
          <li>Your custom truths and custom struggle responses</li>
          <li>Your journal reflections, including prompts and entry dates</li>
          <li>
            A cached copy of the public truth and struggle content, plus a
            content check timestamp and ETag
          </li>
        </ul>
        <p className="text-[17px] mt-4 mb-4">
          This information lives only in your browser. It is never transmitted to
          NDEVRS LLC. You can clear it any time from Settings, delete individual
          journal reflections, or clear your browser&apos;s site data.
        </p>

        <h2 className="text-2xl font-extrabold mt-10 mb-3">Analytics</h2>
        <p className="text-[17px] mb-4">
          To understand how the site is used overall, we use Vercel Web
          Analytics and Speed Insights. These are privacy-friendly tools: they
          measure aggregate traffic and page performance without using cookies,
          without storing personal identifiers, and without building an
          advertising profile of you. The analytics never include your name,
          personalization settings, saved truths, custom content, or journal
          reflections — those stay in your browser.
        </p>

        <h2 className="text-2xl font-extrabold mt-10 mb-3">What we don&apos;t do</h2>
        <ul className="list-disc pl-[22px] text-[17px] space-y-1.5">
          <li>We don&apos;t show ads.</li>
          <li>We don&apos;t sell, rent, or trade your information.</li>
          <li>We don&apos;t use advertising or cross-site tracking cookies.</li>
          <li>
            We don&apos;t require an account, and we don&apos;t build a profile
            on you.
          </li>
        </ul>

        <h2 className="text-2xl font-extrabold mt-10 mb-3">Verse content</h2>
        <p className="text-[17px] mb-4">
          The site includes a built-in collection of truths, Scripture
          references, reflection prompts, and struggle responses. It may also
          check{" "}
          <a
            href="https://whatgodsaysabout.me/content.json"
            className="underline decoration-slate-400 decoration-2 underline-offset-2 hover:decoration-slate-600"
          >
            whatgodsaysabout.me/content.json
          </a>{" "}
          for updated public content. That request is a simple download of a
          static JSON file. The site may send a standard ETag header so it can
          avoid downloading the same file again, but it does not send your name,
          personalization settings, saved truths, custom content, or journal
          entries with that request.
        </p>

        <h2 className="text-2xl font-extrabold mt-10 mb-3">
          Sharing and links
        </h2>
        <p className="text-[17px] mb-4">
          When you copy or share a built-in truth, the site creates a link such
          as whatgodsaysabout.me/t/example-id and uses your browser&apos;s
          clipboard or share feature. Those tools are provided by your browser
          and operating system. Custom promises are shared as plain text rather
          than uploaded to us. If you select a Scripture reference, the site
          opens Bible.com in a new tab; Bible.com handles that visit under its
          own privacy policy.
        </p>

        <h2 className="text-2xl font-extrabold mt-10 mb-3">Third parties</h2>
        <p className="text-[17px] mb-4">
          This website is hosted on Vercel, which processes basic request data
          (such as your IP address) to serve the site and provide the
          privacy-friendly analytics described above, under its own privacy
          policy. Fonts are bundled and served from our own site, so your browser
          does not connect to a third-party font provider. We do not integrate
          any advertising or other third-party data collection tools.
        </p>

        <h2 className="text-2xl font-extrabold mt-10 mb-3">
          Children&apos;s privacy
        </h2>
        <p className="text-[17px] mb-4">
          The site is not directed to children under 13, and we do not knowingly
          collect personal information from them.
        </p>

        <h2 className="text-2xl font-extrabold mt-10 mb-3">
          How long we keep things
        </h2>
        <p className="text-[17px] mb-4">
          Because your personal data stays in your browser, NDEVRS LLC does not
          keep a copy of it. Preferences and user-created content remain until
          you remove them or clear your browser&apos;s site data. Aggregate,
          anonymous analytics data is retained by Vercel under its own retention
          policies.
        </p>

        <h2 className="text-2xl font-extrabold mt-10 mb-3">
          Your choices and rights
        </h2>
        <p className="text-[17px] mb-4">
          You&apos;re in control of your information. You can clear all site data
          from Settings, turn off personalization, delete individual journal
          reflections, or clear your browser&apos;s site data. Depending on where
          you live, you may have additional rights under laws such as the GDPR or
          CCPA. Since we do not keep a server-side account or database of your
          personal data, most access or deletion requests can be handled directly
          in your browser, but we will still honor applicable privacy requests.
        </p>

        <h2 className="text-2xl font-extrabold mt-10 mb-3">Security</h2>
        <p className="text-[17px] mb-4">
          All network requests the site makes use encrypted HTTPS connections.
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
