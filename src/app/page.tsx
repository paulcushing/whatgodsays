import Link from "next/link";
import Personalization from "@/app/personalization";
import LoadData from "@/app/loadData";

export default function Home() {
  return (
    <div className="flex flex-col w-screen min-h-screen m-0 p-0 justify-between">
      <LoadData />
      <section className="flex flex-col flex-grow w-screen m-0 p-0 overflow-hidden bg-white lg:flex-row sm:mx-auto min-h-screen">
        <div className="flex justify-end p-8 bg-white lg:py-32 lg:px-16 lg:pl-10 lg:w-1/2">
          <div className="flex flex-col items-start justify-center w-full lg:max-w-lg">
            <p className="inline-block px-2 py-1 mb-5 font-medium tracking-wider text-gray-900 uppercase bg-gray-200 rounded-full text-xxs">
              Do you <i>really</i> know...
            </p>
            <h5 className="mb-3 text-3xl font-extrabold leading-none sm:text-4xl lg:text-7xl">
              Who Am I?
            </h5>
            <p className="py-5 mb-5 text-gray-600 lg:text-xl">
              Sometimes it helps to be reminded of who we REALLY are, rather
              than what others have told us. Here is a beautiful sample of what{" "}
              <span className="font-bold">Jesus</span> says about YOU, along
              with the verses.
            </p>

            <Personalization />
            <div className="flex items-center mt-6">
              <Link
                href="/1"
                className="touch-pan-y inline-flex items-center justify-center h-12 px-6 mr-6 font-medium tracking-wide text-white transition duration-200 bg-gray-900 rounded-lg hover:bg-gray-900 focus"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
        <div className="h-80 lg:h-screen lg:scale-105 lg:w-1/2 overflow-hidden bg-[url('/images/bible.jpg')] bg-center bg-no-repeat bg-cover">
          <p>&nbsp;</p>
        </div>
      </section>
      <footer className="py-10 bg-black z-10">
        <div className="px-10 mx-auto max-w-7xl">
          <div className="flex flex-col justify-between text-center md:flex-row">
            <p className="order-last text-sm leading-tight text-gray-400 md:order-first">
              Built for God&apos;s glory and YOUR joy!
            </p>
            <ul className="flex flex-row justify-center pb-3 -ml-4 -mr-4 text-sm">
              <li>{/* <ContactForm /> */}</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
