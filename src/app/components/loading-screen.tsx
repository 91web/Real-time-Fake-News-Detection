"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import News from "../../assests/img/news-logo.png";
import Image from "next/image";

export default function LoadingScreen() {
  const [text, setText] = useState("");
  const fullText = "R eal-time Fake News Detection system";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText((prev) => prev + fullText[index]);
      index++;
      if (index === fullText.length) {
        clearInterval(interval);
      }
    }, 100); // Adjust typing speed here

    return () => clearInterval(interval);
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center"
    >
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 60,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <Image
            src={News}
            alt="News logo"
            width={100}
            height={100}
            style={{ borderRadius: 15 }}
          />
        </motion.div>
      </Box>
      <Typography variant="h6" color="#000" gutterBottom>
        {text}
      </Typography>
      <Box sx={{ width: "80%", maxWidth: 300 }}>
        <LinearProgress sx={{ bgcolor: "#000" }} />
      </Box>
    </motion.div>
  );
}
