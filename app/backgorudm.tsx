export default function LeftDotGrid() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* dots only on left side */}
      <div
        className="
          absolute inset-0
          opacity-55
          [background-image:radial-gradient(circle_at_1px_1px,_rgba(120,120,120,0.25)_1px,_transparent_0)]
          [background-size:24px_24px]
          [width:47%]
        "
      />

     
    </div>
  );
}