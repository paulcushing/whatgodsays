import Personalization from "@/app/personalization";
import LoadData from "@/app/loadData";
import Begin from "@/app/begin";
import Footer from "@/app/footer";

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
              <Begin />
            </div>
          </div>
        </div>
        <div className="h-80 lg:h-screen lg:scale-105 lg:w-1/2 overflow-hidden bg-[url('/images/bible.jpg')] bg-center bg-no-repeat bg-cover">
          <p>&nbsp;</p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
