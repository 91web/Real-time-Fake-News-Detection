"use client";
import React from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { NewsHero, NewsType } from "./static-data/data";

// Array of images for the cards from static data importesd
const images: NewsType[] = NewsHero;

const SlideHero = () => {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          // mb:"5px",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: "regular",
            fontFamily: "lora",
            color: "#344054",
            pt: 10,
            px: 1,
            fontSize: { xs: "32px", md: "40px" },
            width: { xs: "100%", md: "60%" },
          }}
        >
          This system leverage expertise to develop cutting-edge solutions for
          authenticating news and combating misinformation in the digital space
        </Typography>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: "regular",
            fontFamily: "lora",
            color: "#344054",
            fontSize: "16px",
            width: { xs: "85%", md: "100%" },
          }}
        >
          This is the story of it has grown over the years to provide innovative
          and reliable tools that empower users to discern credible information.
        </Typography>
      </Box>
      <Box my={8}>
        {/* Swiper Container */}
        <Swiper
          modules={[Pagination, Autoplay]} // Removed Navigation module to hide arrows
          spaceBetween={8}
          slidesPerView={6}
          loop={true}
          style={{
            height: "220px",
          }}
          autoplay={{ delay: 2500, disableOnInteraction: false }} // Autoplay with a 2.5 second interval
          pagination={{ clickable: true }}
          breakpoints={{
            320: { slidesPerView: 1 }, // 1 slide on very small screens
            600: { slidesPerView: 2 }, // 2 slides on medium screens
            900: { slidesPerView: 3 }, // 3 slides on small desktop screens
            1200: { slidesPerView: 5 }, // 5 slides on larger desktop screens
          }}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <Card elevation={0} sx={{ minWidth: 200, margin: "0 8px" }}>
                <CardMedia
                  sx={{ height: 150, width: 200 }}
                  image={image.src}
                  title={image.title}
                  style={{
                    objectFit: "cover",
                    borderRadius: "10px",
                    padding: 3,
                  }}
                />
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  );
};

export default SlideHero;
