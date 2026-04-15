interface MyPositionCardProps {
  rank?: number | string;
  userName?: string;
  points?: number | string;
  className?: string;
}

export default function MyPositionCard({
  rank = "-",
  userName = "You",
  points = 0,
  className = "",
}: MyPositionCardProps) {
  return (
    <div
      className={`relative p-4 rounded-2xl bg-linear-to-r from-indigo-600 to-blue-700 text-white shadow-xl flex items-center justify-between ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-black">
          #{rank}
        </div>
        <div>
          <p className="text-[10px] font-bold opacity-70 uppercase leading-none mb-1">Your Position</p>
          <p className="font-bold text-sm leading-none">{userName} (You)</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-bold opacity-70 uppercase leading-none mb-1">Total Pts</p>
        <p className="font-black text-lg leading-none">{points}</p>
      </div>
    </div>
  );
}