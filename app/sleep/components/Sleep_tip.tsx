interface SleepTipCardProps {
  icon: string;
  title: string;
  description: string;
}

export default function SleepTipCard({
  icon,
  title,
  description,
}: SleepTipCardProps) {
  return (
    <div className="flex gap-4 rounded-xl border border-white/[0.05] bg-[#131313] p-4 hover:border-indigo-500/20 transition-colors duration-200">
      <span className="text-2xl shrink-0 mt-0.5">{icon}</span>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-zinc-200">{title}</p>
        <p className="text-sm text-zinc-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}