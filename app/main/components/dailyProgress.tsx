import { RING } from "@/constants/temp/temp";
import { Task } from "@/types/Progress/progress";

interface Props {
    tasks: Task[];
}

export default function DailyProgress({ tasks }: Props) {
    const completed = tasks.filter((t) => t.completed).length;
    const progress = tasks.length
        ? Math.round((completed / tasks.length) * 100)
        : 0;

    return (
        <div className="flex items-center gap-4 rounded-2xl border bg-card px-5 py-4">
            <div className="relative size-16 shrink-0">
                <svg viewBox="0 0 64 64" className="size-16 -rotate-90" aria-hidden>
                    <circle
                        cx="32"
                        cy="32"
                        r={RING.radius}
                        fill="none"
                        strokeWidth="6"
                        className="stroke-muted"
                    />
                    <circle
                        cx="32"
                        cy="32"
                        r={RING.radius}
                        fill="none"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={RING.circumference}
                        strokeDashoffset={RING.circumference * (1 - progress / 100)}
                        className="stroke-emerald-400"
                    />
                </svg>

                <span className="absolute inset-0 grid place-items-center text-sm font-semibold">
                    {progress}%
                </span>
            </div>

            <div>
                <p className="text-lg font-medium leading-tight">Daily progress</p>
                <p className="text-muted-foreground">
                    {completed} of {tasks.length} tasks done
                </p>
            </div>
        </div>
    );
}