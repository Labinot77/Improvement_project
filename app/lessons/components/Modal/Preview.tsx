
import { Lesson } from "@/types/lessons"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Plus } from "lucide-react";

interface Props {
    lesson: Lesson;
    onOpenChange: (open: boolean) => void;
    open: boolean
}

export default  function Preview({ lesson, onOpenChange, open }: Props) {

    return (
         <Dialog open={open} onOpenChange={onOpenChange}>
      {/* The [&>button] classes restyle shadcn's built-in close button to match the design */}
      <DialogContent
        className="gap-0 overflow-hidden rounded-[24px] border-white/[0.11] bg-[#191a1f] p-0 shadow-[0_32px_100px_rgba(0,0,0,.7)] sm:max-w-lg [&>button]:right-5 [&>button]:top-[22px] [&>button]:grid [&>button]:size-8 [&>button]:place-items-center [&>button]:rounded-full [&>button]:bg-white/[0.06] [&>button]:text-white/50 [&>button]:opacity-100 [&>button]:transition [&>button]:hover:rotate-90 [&>button]:hover:bg-white/[0.1] [&>button]:hover:text-white"
      >
        {/* Green glow */}
        <div className="pointer-events-none absolute -right-16 -top-20 size-44 rounded-full bg-[#55c487]/15 blur-3xl" />

        <DialogHeader className="relative flex-row items-center gap-3 border-b border-white/[0.07] p-5 pr-16 text-left">
          <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#55c487]/10 text-[#72d9a0]">
            <Plus className="size-4" />
          </div>
          <div>
            <DialogTitle className="text-lg font-semibold text-zinc-100">
              {lesson.title}
            </DialogTitle>
            <DialogDescription className="mt-0.5 text-[10px] text-white/30">
                T details of this lesson.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="">
            {lesson.title}
            <p>{lesson.body}</p>
         </div>
      </DialogContent>
    </Dialog>
    )
}