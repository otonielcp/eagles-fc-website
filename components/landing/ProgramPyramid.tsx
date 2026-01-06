import React from "react";

type Tier = {
  label: string;
  age?: string;
};

type ProgramPyramidProps = {
  logoSrc?: string; // put your logo in /public and pass "/logo.png"
  tiers?: Tier[];
  className?: string;
};

const GOLD = "#CEB27D";

const DEFAULT_TIERS: Tier[] = [
  { label: "SELECT", age: "(13 - 19)" },
  { label: "COMPETITIVE", age: "(13 - 19)" },
  { label: "JUNIOR ACADEMY", age: "(5 - 8)" },
  { label: "RECREATIONAL" },
];

export function ProgramPyramid({
  logoSrc,
  tiers = DEFAULT_TIERS,
  className = "",
}: ProgramPyramidProps) {
  // Sizing you can tweak
  const baseWidth = 560;     // bottom width
  const topWidth = 280;      // top width
  const triangleHeight = 180;
  const tierHeight = 64;
  const dividerH = 2;
  const gap = 10;

  const tierCount = tiers.length;

  // widths from top (narrow) to bottom (wide)
  const widths = tiers.map((_, idx) => {
    const t = idx / Math.max(1, tierCount - 1); // 0..1
    return Math.round(topWidth + (baseWidth - topWidth) * t);
  });

  return (
    <div className={`w-full flex justify-center ${className}`}>
      <div className="relative w-[720px] max-w-[94vw] rounded-2xl overflow-hidden">
        {/* Background (dark, textured-ish) */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#1b1b1b] via-[#111111] to-[#070707]" />
        <div className="absolute inset-0 -z-10 opacity-30 [background:radial-gradient(ellipse_at_top,_rgba(255,255,255,0.10),_transparent_60%)]" />
        <div className="absolute inset-0 -z-10 opacity-20 [background:radial-gradient(circle_at_20%_40%,_rgba(255,255,255,0.08),_transparent_35%)]" />

        <div className="p-10 sm:p-12">
          <div className="mx-auto flex flex-col items-center">
            {/* Top Triangle */}
            <div
              className="relative flex items-center justify-center"
              style={{
                width: `${topWidth}px`,
                height: `${triangleHeight}px`,
                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
              }}
            >
              {/* Fill */}
              <div className="absolute inset-0" style={{ background: GOLD }} />

              {/* Logo */}
              {logoSrc ? (
                <img
                  src={logoSrc}
                  alt="Logo"
                  className="relative z-10 h-14 w-14 object-contain drop-shadow"
                />
              ) : (
                <div className="relative z-10 text-xs font-semibold tracking-widest text-black/70">
                  LOGO
                </div>
              )}

              {/* Border */}
              <div
                className="absolute inset-0"
                style={{
                  clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                  border: "2px solid rgba(0,0,0,0.25)",
                }}
              />
            </div>

            {/* Divider under triangle */}
            <div
              className="bg-black/40"
              style={{ width: `${topWidth}px`, height: `${dividerH}px` }}
            />

            {/* Tiers */}
            <div className="mt-4 flex flex-col items-center">
              {tiers.map((tier, i) => {
                const w = widths[i];

                return (
                  <div key={`${tier.label}-${i}`} className="flex flex-col items-center">
                    <div
                      className="relative flex items-center justify-center"
                      style={{
                        width: `${w}px`,
                        height: `${tierHeight}px`,
                        clipPath: "polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)",
                      }}
                    >
                      {/* Fill */}
                      <div className="absolute inset-0" style={{ background: GOLD }} />

                      {/* Label */}
                      <div className="relative z-10 flex items-center gap-2 text-center">
                        <span className="text-[12px] sm:text-[13px] font-semibold tracking-[0.25em] text-black/75">
                          {tier.label}
                        </span>
                        {tier.age ? (
                          <span className="text-[12px] sm:text-[13px] font-semibold tracking-[0.25em] text-black/60">
                            {tier.age}
                          </span>
                        ) : null}
                      </div>

                      {/* Border */}
                      <div
                        className="absolute inset-0"
                        style={{
                          clipPath: "polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)",
                          border: "2px solid rgba(0,0,0,0.25)",
                        }}
                      />
                    </div>

                    {/* Small gap line between tiers */}
                    {i !== tiers.length - 1 ? (
                      <div
                        className="bg-black/35"
                        style={{
                          width: `${Math.max(120, w - 56)}px`,
                          height: `${dividerH}px`,
                          marginTop: `${gap}px`,
                        }}
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Optional caption/footer */}
          {/* <div className="mt-8 text-center text-xs tracking-widest text-white/60">
            YOUR CAPTION HERE
          </div> */}
        </div>
      </div>
    </div>
  );
}

