export function Loader() {
  const bars = [0, 1, 2, 3, 4];

  return (
    <div
      className="flex items-center justify-center gap-1.5 h-10"
      role="status"
    >
      {bars.map((i) => (
        <div
          key={i}
          className="w-1.5 rounded-full bg-blue-500 animate-bounce"
          style={{
            animationDelay: `${i * 0.15}s`,

            height: i === 2 ? "100%" : i === 1 || i === 3 ? "70%" : "40%",

            animationDuration: "1s",
          }}
        />
      ))}
    </div>
  );
}
