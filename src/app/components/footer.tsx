"use client";

import { Box, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import CopyrightIcon from "@mui/icons-material/Copyright";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: "#000",
        color: "white",
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="body1"
            align="center"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CopyrightIcon sx={{ mr: 1 }} /> {new Date().getFullYear()}{" "}
            Real-Time Fake News Detection for Nigerian Digital Platforms
          </Typography>
          <Typography variant="body2" align="center" sx={{ mt: 1 }}>
            All rights reserved || Yusuf Babatunde
          </Typography>
        </motion.div>
      </Container>
    </Box>
  );
}
