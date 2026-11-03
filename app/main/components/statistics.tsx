// export default function statistics() {

//     return (
//         <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
//           {cards.map(({ label, href, value, note, icon: Icon, iconColor, bar, pct }) => (
//             <Link
//               key={label}
//               href={href}
//               className={`${CARD} group block p-6 text-left transition-colors hover:bg-[#1a1d20] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60`}
//             >
//               <div className="flex items-center justify-between">
//                 <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.05]">
//                   <Icon className={`h-5 w-5 ${iconColor}`} strokeWidth={1.6} />
//                 </span>
//                 <ChevronRight className="h-4 w-4 text-zinc-600 transition-colors group-hover:text-zinc-300" />
//               </div>
//               <p className="mt-6 text-zinc-500">{label}</p>
//               <p className="mt-1 text-3xl font-semibold tracking-tight">{value}</p>
//               <p className="mt-1 text-sm text-zinc-600">{note}</p>
//               <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
//                 <div className={`h-full rounded-full ${bar}`} style={{ width: `${pct}%` }} />
//               </div>
//             </Link>
//           ))}
//         </div>
//     )
// }