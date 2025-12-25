export default function Spinner({ text = "Loading..." }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      <span className="text-white text-sm">{text}</span>
    </div>
  );
}
