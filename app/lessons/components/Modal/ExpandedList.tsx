// "use client";

// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { LessonList } from "@/app/lessons/components/List";
// import type { Lesson } from "@/types/lessons";
// import type { LessonFormValues } from "@/app/lessons/components/Form";

// interface Props {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   lessons: Lesson[];
//   onUpdate: (id: string, values: LessonFormValues) => void;
//   onDelete: (id: string) => void;
// }

// export function LessonListModal({ open, onOpenChange, lessons, onUpdate, onDelete }: Props) {
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="h-[80vh] w-full flex flex-col border-white/[0.08] bg-[#0f0f0f] p-6 shadow-2xl">
//         <DialogHeader className="shrink-0">
//           <DialogTitle className="text-zinc-100">All lessons</DialogTitle>
//         </DialogHeader>

//         {/* LessonList fills the remaining height */}
//         {/* <div className="flex-1 overflow-hidden"> */}
//           <LessonList
//             lessons={lessons}
//             onUpdate={onUpdate}
//             onDelete={onDelete}
//             expandedView  // signals the list to use full height
//           />
//         {/* </div> */}
//       </DialogContent>
//     </Dialog>
//   );
// }