"use client";

import { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { motion, AnimatePresence } from "framer-motion";
import FakeNewsDetector from "./components/fakenews-detection";
import LoadingScreen from "./components/loading-screen";
import Footer from "./components/footer";
import FAppBar from "./components/appbar";
import SlideHero from "./components/news-logo";

const theme = createTheme();

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AnimatePresence>
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <FAppBar />
            <SlideHero />
            <Container
              maxWidth="md"
              sx={{ flex: 1, display: "flex", flexDirection: "column" }}
            >
              <Box sx={{ my: 4 }}>
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  ></Box>
                </motion.div>
                <FakeNewsDetector />
              </Box>
            </Container>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </ThemeProvider>
  );
}
