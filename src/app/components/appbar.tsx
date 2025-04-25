"use client";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { motion } from "framer-motion";
import { styled } from "@mui/system";
import Image from "next/image";
import News from "../../assests/img/news-logo.png";

const ColorfulBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1, 2),
  boxShadow: "#009",
  width: "38%",
  maxWidth: 400,
}));

const FAppBar = () => {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Box bgcolor={"#000"}>
        <Toolbar>
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            style={{ width: "100%" }}
          >
            <ColorfulBox>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box display={{ xs: "none", sm: "block" }}>
                  <Image
                    src={News}
                    alt="News"
                    height={40}
                    width={40}
                    style={{ borderRadius: 10 }}
                  />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: { xs: "10px", sm: "20px" },
                    }}
                  >
                    Real-Time Fake News Detection
                  </Typography>
                </Box>
              </Box>
            </ColorfulBox>
          </motion.div>
        </Toolbar>
      </Box>
    </AppBar>
  );
};

export default FAppBar;
