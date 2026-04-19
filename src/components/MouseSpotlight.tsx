import { useEffect, useRef } from "react";

const MouseSpotlight = () => {
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (spotRef.current) {
        spotRef.current.style.left = `${e.clientX}px`;
        spotRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      ref={spotRef}
      className="fixed pointer-events-none z-0"
      style={{
        width: 600,
        height: 600,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)",
        transform: "translate(-50%, -50%)",
        transition: "left 0.1s ease, top 0.1s ease",
      }}
    />
  );
};

export default MouseSpotlight;
