export function AmbientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 20% 0%, rgba(13,148,136,0.08), transparent),
            radial-gradient(ellipse 50% 40% at 80% 60%, rgba(124,58,237,0.06), transparent),
            linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)
          `,
        }}
      />
      <div className="absolute -top-[10%] -left-[8%] w-[380px] h-[380px] rounded-full bg-[#0d9488] opacity-[0.06] blur-[100px] animate-[drift1_18s_ease-in-out_infinite]" />
      <div className="absolute top-[40%] -right-[8%] w-[320px] h-[320px] rounded-full bg-[#7c3aed] opacity-[0.05] blur-[100px] animate-[drift2_22s_ease-in-out_infinite]" />
      <div className="absolute bottom-[5%] left-[30%] w-[260px] h-[260px] rounded-full bg-[#d97706] opacity-[0.04] blur-[100px] animate-[drift3_20s_ease-in-out_infinite]" />
    </div>
  );
}
