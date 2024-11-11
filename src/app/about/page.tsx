import ContactForm from "@/app/contactform";
import Link from "next/link";
import Footer from "@/app/footer";

export default function Page() {
  return (
    <div className="flex flex-col w-screen min-h-screen m-0 p-0 justify-between">
      <section className="flex flex-col flex-grow w-screen m-0 p-0 overflow-hidden bg-white lg:flex-row sm:mx-auto min-h-screen">
        <div className="flex justify-end p-8 bg-white lg:pb-32 lg:pt-6 lg:px-16 lg:pl-10 lg:w-1/2">
          <div className="flex flex-col items-start justify-center w-full lg:max-w-lg">
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
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 476.213 476.213"
                xmlSpace="preserve"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <polygon points="476.213,223.107 57.427,223.107 151.82,128.713 130.607,107.5 0,238.106 130.607,368.714 151.82,347.5 57.427,253.107 476.213,253.107 "></polygon>{" "}
                </g>
              </svg>
              Back
            </Link>

            <h5 className="mb-3 text-3xl font-extrabold leading-none sm:text-4xl lg:text-7xl">
              About
            </h5>
            <p className="py-5 mb-5 text-gray-600 lg:text-xl w-full">
              We are super excited that you&apos;ve found yourself here. This
              super simple web app has just one purpose. It&apos;s here to
              remind you that you are SO loved. Jesus didn&apos;t promise His
              followers a life of ease, but He did offer us adoption as sons and
              daughters of the Father and Creator of the universe. God made you.
              God cares about you, God loves you, and He wants a relationship
              with you.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-start justify-center w-full lg:w-1/2 lg:max-w-2xl">
          <ContactForm />
        </div>
      </section>
      <Footer />
    </div>
  );
}
