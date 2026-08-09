// src/components/ui/Marquee.jsx
import React from "react";

/**
 * Seamless horizontal ticker. Children are rendered twice and the track slides
 * exactly 50%, so the loop has no visible seam.
 */
export default function Marquee({
  children,
  speed = 38,
  reverse = false,
  className = "",
  itemClassName = "",
  pauseOnHover = true,
}) {
  const items = React.Children.toArray(children);

  return (
    <div className={`group relative flex overflow-hidden mask-fade-x ${className}`}>
      <div
        className={`flex w-max shrink-0 animate-marquee items-center ${
          pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""
        }`}
        style={{
          animationDuration: `${speed}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center" aria-hidden={copy === 1}>
            {items.map((child, i) => (
              <div key={i} className={itemClassName}>
                {child}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
