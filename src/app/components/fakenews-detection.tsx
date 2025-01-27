"use client";

import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/system";
import { motion, AnimatePresence } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import HelpIcon from "@mui/icons-material/Help";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const ResultBox = styled(motion.div)<{ result: string | null }>(
  ({ theme, result }) => {
    let backgroundColor = theme.palette.grey[100];
    let borderColor = theme.palette.grey[300];
    let color = theme.palette.text.primary;

    if (result?.includes("Authentic") || result?.includes("Genuine")) {
      backgroundColor = theme.palette.success.light;
      borderColor = theme.palette.success.main;
      color = theme.palette.success.dark;
    } else if (result?.includes("Neutral") || result?.includes("Uncertain")) {
      backgroundColor = theme.palette.warning.light;
      borderColor = theme.palette.warning.main;
      color = theme.palette.warning.dark;
    } else if (result?.includes("Misleading") || result?.includes("False")) {
      backgroundColor = theme.palette.error.light;
      borderColor = theme.palette.error.main;
      color = theme.palette.error.dark;
    }

    return {
      backgroundColor,
      borderLeft: `4px solid ${borderColor}`,
      color,
      padding: theme.spacing(2),
      borderRadius: theme.shape.borderRadius,
      marginTop: theme.spacing(2),
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(1.5),
      },
    };
  }
);

function TypeWriter({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text]);

  useEffect(() => {
    setDisplayText("");
    setCurrentIndex(0);
  }, []);

  return <span>{displayText}</span>;
}

async function analyzeSentiment(
  text: string
): Promise<{ sentiment: string; analysis: string }> {
  const apiKey = "5ee387c588b59c2cf2a1ee9448d54628";
  if (!apiKey) {
    throw new Error("API key is not set");
  }

  const url = `https://api.meaningcloud.com/sentiment-2.1?key=${apiKey}&txt=${encodeURIComponent(
    text
  )}&lang=en`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data || !data.score_tag) {
      throw new Error("Invalid response from API");
    }

    const sentiment = data.score_tag;
    let result = "";
    let analysis = "";

    switch (sentiment) {
      case "P+":
        result = "Authentic and Verified News!";
        analysis =
          "This news content has been classified as authentic. The analysis indicates that it is accurate, credible, and trustworthy, reflecting positive developments that can inspire and engage the community. This outcome reaffirms the importance of sharing verified information to build a well-informed society.";
        break;
      case "P":
        result = "Genuine News Content!";
        analysis =
          "The analysis shows that this content is genuine and reliable. It reflects accurate and trustworthy information without any misleading intent. This classification provides assurance that the content aligns with the values of honesty and factual reporting, supporting informed decision-making and public trust.";
        break;
      case "NEU":
        result =
          "Uncertain News Content, Make sure you comfirm the source of this informations!";
        analysis =
          "This content has been classified as neutral, indicating moderate certainty in its authenticity. It does not show clear signs of being misleading or completely reliable. This suggests that further investigation or verification may be necessary to understand its context and credibility fully. Stay cautious and verify the source before sharing.";
        break;
      case "N":
        result = "Misleading or Fake News Detected!";
        analysis =
          "The analysis classifies this content as misleading or fake. It may contain inaccuracies or deceptive information intended to mislead readers. It's crucial to avoid sharing such content and to rely on credible sources for accurate information. Always verify the authenticity of such news to combat misinformation effectively.";
        break;
      case "N+":
        result = "Highly Misleading or False News!";
        analysis =
          "This news content has been classified as completely false or intentionally misleading. It may include fabricated information designed to deceive readers. Disseminating such content can harm societal trust and foster misinformation. Verify the information with trusted sources and avoid sharing it.";
        break;
      default:
        result = "Uncertain or Inconclusive Content!";
        analysis =
          "The analysis could not determine the authenticity of this content. It is highly recommended that the source be scrutinized and the claims verified with credible references before considering them trustworthy. This highlights the importance of careful evaluation in ambiguous cases.";
    }

    return { sentiment: result, analysis };
  } catch (error) {
    console.error("Error in Verifying:", error);
    throw error;
  }
}

export default function FakeNewsDetector() {
  const [content, setContent] = useState("");
  const [result, setResult] = useState<{
    sentiment: string;
    analysis: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    severity: "error" | "warning" | "info" | "success";
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() === "") {
      setAlert({
        message: "Please enter some text to Verify.",
        severity: "warning",
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    setAlert(null);
    try {
      const analysisResult = await analyzeSentiment(content);
      setResult(analysisResult);
    } catch (error) {
      console.error("Error Verifying the News:", error);
      setAlert({
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearScreen = () => {
    setContent("");
    setResult(null);
    setAlert(null);
  };

  const getResultIcon = (sentiment: string) => {
    if (sentiment.includes("Authentic") || sentiment.includes("Genuine")) {
      return <CheckCircleIcon fontSize="large" color="success" />;
    } else if (
      sentiment.includes("Neutral") ||
      sentiment.includes("Uncertain")
    ) {
      return <WarningIcon fontSize="large" color="warning" />;
    } else if (
      sentiment.includes("Misleading") ||
      sentiment.includes("False")
    ) {
      return <ErrorIcon fontSize="large" color="error" />;
    } else {
      return <HelpIcon fontSize="large" color="action" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <StyledPaper elevation={3}>
        <AnimatePresence>
          {alert && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Alert
                severity={alert.severity}
                onClose={() => setAlert(null)}
                sx={{ mb: 2 }}
              >
                {alert.message}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={5}
            variant="outlined"
            label="Input your News Content below!"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type the NEWS here!"
            margin="normal"
          />
          <Box
            sx={{
              mt: 2,
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
              fullWidth={true}
              sx={{
                flex: { sm: 1 },
                textTransform: "none",
                bgcolor: "#000",
              }}
              startIcon={
                isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <SearchIcon />
                )
              }
            >
              {isLoading ? "Detecting..." : "Verify News Contents"}
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              onClick={clearScreen}
              fullWidth={true}
              sx={{ flex: { sm: 1 }, textTransform: "none" }}
              startIcon={<ClearIcon />}
            >
              Clear Screen
            </Button>
          </Box>
        </form>
        <AnimatePresence mode="wait">
          {result && (
            <ResultBox
              result={result.sentiment}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Box display="flex" alignItems="center" mb={2}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  {getResultIcon(result.sentiment)}
                </motion.div>
                <Typography variant="h6" sx={{ ml: 2 }}>
                  Detection Result
                </Typography>
              </Box>
              <Typography variant="subtitle1" gutterBottom>
                <TypeWriter text={result.sentiment} />
              </Typography>
              <Typography variant="body1">
                <TypeWriter text={result.analysis} />
              </Typography>
            </ResultBox>
          )}
        </AnimatePresence>
      </StyledPaper>
    </motion.div>
  );
}
