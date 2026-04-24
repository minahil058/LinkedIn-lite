import React, { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring, useTransform, motion } from "framer-motion";

const AnimatedCounter = ({ value, duration = 1.5, suffix = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  // Parse the number from strings like "2M+", "500k+", "24/7"
  const numericValue = parseInt(value.replace(/[^0-9]/g, "")) || 0;
  
  const count = useMotionValue(0);
  const springValue = useSpring(count, {
    stiffness: 100,
    damping: 30,
    duration: duration * 1000
  });

  const displayValue = useTransform(springValue, (latest) => {
    const formatted = Math.floor(latest);
    if (value.includes("k")) return formatted + "k" + suffix;
    if (value.includes("M")) return formatted + "M" + suffix;
    if (value.includes("/")) return "24/7"; // Special case for support
    return formatted + suffix;
  });

  useEffect(() => {
    if (isInView) {
      count.set(numericValue);
    }
  }, [isInView, count, numericValue]);

  return (
    <motion.span ref={ref} className="tabular-nums">
      {displayValue}
    </motion.span>
  );
};

export default AnimatedCounter;
