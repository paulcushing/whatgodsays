"use client";

export default function Begin() {
  const start = () => {
    // set default to randomize
    localStorage.setItem("order", "random");
    const data = localStorage.getItem("data");

    const parsedData = data ? JSON.parse(data) : [];

    const randomPage = Math.floor(Math.random() * parsedData.length);
    const nextPage = "/" + (randomPage + 1).toString();
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
