"use client";
import { useState, useEffect, useRef } from "react";
import LoadData from "../loadData";
import Error from "next/error";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Verse({ params }: { params: { slug: string } }) {
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  const verseContainerRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // This useEffect is needed to apply the `focus` class on each verse to ensure they receive the same focus styles.
  // This waits for the `isClient` state to be set so that we know the first component update has completed.
  useEffect(() => {
    if (verseContainerRef.current) {
      const element: HTMLDivElement = verseContainerRef.current;
      Object.values(element.children).forEach((child) => {
        if (child.tagName === "A")
          child.classList.add(
            "focus",
            "duration-200",
            "rounded-lg",
            "transition"
          );
      });
    }
  }, [isClient]);

  const { slug } = params;
  const page = parseInt(slug);
  const data = isClient ? localStorage.getItem("data") : null;

  if (!data) {
    return <LoadData />;
  }

  const personalize = localStorage.getItem("personalize") === "true";
  const name = localStorage.getItem("name") || "";
  const gender = localStorage.getItem("gender") || "male";
  // TODO: Setting to random until other orders are implemented
  const randomize = localStorage.getItem("order") === "random" || true;

  const parsedData = JSON.parse(data);
  const { feminine, masculine, neutral, verse } = parsedData[page - 1];

  let randomPage = Math.floor(Math.random() * parsedData.length);
  while (page === randomPage + 1) {
    randomPage = Math.floor(Math.random() * parsedData.length);
  }

  const nextPage = randomize
    ? "/" + (randomPage + 1).toString()
    : "/" + (parseInt(slug) + 1).toString();

  const shareData = {
    title: "What God Says About Me",
    text: "A reminder of who God says you are.",
    url: "https://whatgodsaysabout.me/" + slug,
  };

  const canShare = navigator.canShare(shareData);

  const shareThis = async () => {
    const shareData = {
      title: "What God Says About Me",
      text: "A reminder of who God says you are.",
      url: "https://whatgodsaysabout.me/" + slug,
    };

    try {
      await navigator.share(shareData);
      console.log("Shared successfully");
    } catch (err: unknown) {
      if (err instanceof Error && err.toString().includes("AbortError")) {
        console.log("Share cancelled");
        return true;
      }
      console.log("Share error: " + err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col w-full min-h-screen m-0 p-0 justify-between mb-24">
        <section className="flex flex-col w-full overflow-hidden bg-white sm:mx-auto mb-auto">
          <div className="flex justify-center p-8 bg-white lg:py-16 lg:px-2 lg:pl-10">
            <div className="flex flex-col items-start justify-center w-full lg:max-w-2xl">
              <p className="py-5 mb-5 text-gray-600 text-3xl lg:text-6xl">
                <span className="font-bold">
                  {personalize
                    ? gender === "female"
                      ? feminine.replaceAll("{name}", name)
                      : masculine.replaceAll("{name}", name)
                    : neutral}
                </span>
              </p>
              <div
                ref={verseContainerRef}
                className="py-5 mb-5 text-gray-900 underline text-xl lg:text-2xl"
                dangerouslySetInnerHTML={{ __html: verse }}
              ></div>
              {canShare && (
                <button
                  className="py-5 mb-5 text-gray-500 text-xl lg:text-2xl duration-200 rounded-lg transition focus"
                  onClick={shareThis}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="inline"
                    height="1em"
                    viewBox="0 0 576 512"
                    fill="currentColor"
                  >
                    <path d="M400 255.4V240 208c0-8.8-7.2-16-16-16H352 336 289.5c-50.9 0-93.9 33.5-108.3 79.6c-3.3-9.4-5.2-19.8-5.2-31.6c0-61.9 50.1-112 112-112h48 16 32c8.8 0 16-7.2 16-16V80 64.6L506 160 400 255.4zM336 240h16v48c0 17.7 14.3 32 32 32h3.7c7.9 0 15.5-2.9 21.4-8.2l139-125.1c7.6-6.8 11.9-16.5 11.9-26.7s-4.3-19.9-11.9-26.7L409.9 8.9C403.5 3.2 395.3 0 386.7 0C367.5 0 352 15.5 352 34.7V80H336 304 288c-88.4 0-160 71.6-160 160c0 60.4 34.6 99.1 63.9 120.9c5.9 4.4 11.5 8.1 16.7 11.2c4.4 2.7 8.5 4.9 11.9 6.6c3.4 1.7 6.2 3 8.2 3.9c2.2 1 4.6 1.4 7.1 1.4h2.5c9.8 0 17.8-8 17.8-17.8c0-7.8-5.3-14.7-11.6-19.5l0 0c-.4-.3-.7-.5-1.1-.8c-1.7-1.1-3.4-2.5-5-4.1c-.8-.8-1.7-1.6-2.5-2.6s-1.6-1.9-2.4-2.9c-1.8-2.5-3.5-5.3-5-8.5c-2.6-6-4.3-13.3-4.3-22.4c0-36.1 29.3-65.5 65.5-65.5H304h32zM72 32C32.2 32 0 64.2 0 104V440c0 39.8 32.2 72 72 72H408c39.8 0 72-32.2 72-72V376c0-13.3-10.7-24-24-24s-24 10.7-24 24v64c0 13.3-10.7 24-24 24H72c-13.3 0-24-10.7-24-24V104c0-13.3 10.7-24 24-24h64c13.3 0 24-10.7 24-24s-10.7-24-24-24H72z" />
                  </svg>
                  Share this with a friend
                </button>
              )}
            </div>
          </div>
        </section>
        <section className="flex flex-col w-full overflow-hidden fixed left-0 bottom-0 sm:mx-auto">
          <div className="flex justify-center p-8 bg-white">
            <div className="flex flex-col items-start justify-center w-full lg:max-w-lg">
              <div className="flex w-full justify-between">
                <button
                  onClick={() => router.back()}
                  aria-label="Back"
                  className="touch-pan-y inline-flex items-center justify-center h-12 px-6 mr-2 font-medium tracking-wide text-white transition duration-200 bg-gray-900 rounded-lg hover:bg-gray-900 focus"
                >
                  Back
                </button>
                <a
                  href="/"
                  aria-label="Return Home"
                  className="duration-200 rounded-lg touch-pan-y tracking-wide transition focus"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="3em"
                    viewBox="0 0 576 512"
                  >
                    <path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
                  </svg>
                </a>
                <a
                  href={nextPage}
                  className="touch-pan-y inline-flex items-center justify-center h-12 px-6 ml-2 font-medium tracking-wide text-white transition duration-200 bg-gray-900 rounded-lg hover:bg-gray-900 focus"
                  data-rounded="rounded-lg"
                  data-primary="gray-900"
                  aria-label="Next"
                >
                  Next
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
