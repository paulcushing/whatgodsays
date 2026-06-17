export function Toast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="pointer-events-none fixed inset-x-6 bottom-28 z-50 flex justify-center">
      <span className="rounded-full bg-scriptureInk px-[22px] py-[11px] text-[13px] font-bold text-page shadow-soft">
        {message}
      </span>
    </div>
  );
}
