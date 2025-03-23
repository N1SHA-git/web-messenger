export function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div
        className="size-7 border-4 border-zinc-300 border-t-transparent border-r-transparent rounded-full animate-spin"
        style={{ animationDuration: "0.3s" }}
      ></div>
    </div>
  );
}
