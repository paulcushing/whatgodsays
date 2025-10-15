"use client";

const getNextPage = (current: number, length: number, randomize: boolean) => {
  if (randomize) {
    let randomPage = Math.floor(Math.random() * length);
    while (current === randomPage + 1) {
      randomPage = Math.floor(Math.random() * length);
    }
    return "/" + (randomPage + 1).toString();
  } else {
    return current < length ? "/" + (current + 1).toString() : "/1";
  }
};

export default function Begin() {
  const start = () => {
    // set default to randomize
    localStorage.setItem("order", "random");
    const data = localStorage.getItem("data");

    const parsedData = data ? JSON.parse(data) : [];

    const nextPage = getNextPage(1, parsedData.length, true);
    window.location.href = nextPage;
  };

  return (
    <button
      onClick={() => start()}
      className="touch-pan-y inline-flex items-center justify-center h-12 px-6 mr-6 font-medium tracking-wide text-white transition duration-200 bg-gray-900 rounded-lg hover:bg-gray-900 focus"
    >
      Get started
    </button>
  );
}
