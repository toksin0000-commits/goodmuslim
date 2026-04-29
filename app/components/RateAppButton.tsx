"use client";

export default function RateAppButton({ label }: { label: string }) {
  const handleRate = () => {
    window.open(
      "https://play.google.com/store/apps/details?id=com.toksin.goodmuslim&reviewId=0",
      "_blank"
    );
  };

  return (
    <button
      onClick={handleRate}
      className="
        py-2 px-3 bg-[#2d5a27] text-white rounded-md border border-white shadow-sm 
        font-medium hover:bg-opacity-80 transition text-sm
        ml-auto mr-0
        rtl:ml-0 rtl:mr-auto
      "
    >
      ⭐ {label}
    </button>
  );
}
