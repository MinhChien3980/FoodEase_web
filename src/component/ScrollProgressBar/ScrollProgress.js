// components/ScrollProgressBar/ScrollProgress.js
"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import styles from "./ScrollProgress.module.css";

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.00001,
  });

  return (
    <motion.div
      className={styles["progress-bar"]}
      style={{
        scaleX,
      }}
    />
  );
};

export default ScrollProgress;
