import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Paper from "@mui/material/Paper";
import Collapse from "@mui/material/Collapse";
import Badge from "@mui/material/Badge";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import HelpIcon from "@mui/icons-material/Help";
import WarningIcon from "@mui/icons-material/Warning";
import ClearIcon from "@mui/icons-material/Clear";
import RefreshIcon from "@mui/icons-material/Refresh";
import SaveIcon from "@mui/icons-material/Save";
import HistoryIcon from "@mui/icons-material/History";

interface AnalysisResult {
  sentiment: "positive" | "negative" | "neutral" | "misleading" | "real";
  confidence: number;
  explanation: string;
  classification: "Authentic" | "Genuine" | "Neutral" | "Misleading" | "False";
  detectedLanguage?: string;
  timestamp?: string;
}

interface HistoryItem extends AnalysisResult {
  text: string;
  fullText: string;
  url?: string;
}

const FakeNewsDetector: React.FC = () => {
  // State management
  const [text, setText] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [language, setLanguage] = useState<string>("en");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(false);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("sentiment_history");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }

    const savedApiKey = localStorage.getItem("gemini_api_key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("sentiment_history", JSON.stringify(history));
    }
  }, [history]);

  const handleLanguageChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value as string);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value);
  };

  const saveApiKey = () => {
    if (!apiKey.trim()) {
      setError("Please enter a valid API key");
      return;
    }

    localStorage.setItem("gemini_api_key", apiKey);
    setShowApiKeyInput(false);
  };

  const clearInput = () => {
    setText("");
    setUrl("");
    setResult(null);
    setError(null);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("sentiment_history");
  };

  const loadHistoryItem = (historyItem: HistoryItem) => {
    setText(historyItem.fullText);
    setUrl(historyItem.url || "");
    setResult({
      sentiment: historyItem.sentiment,
      confidence: historyItem.confidence,
      explanation: historyItem.explanation,
      classification: historyItem.classification,
      detectedLanguage: historyItem.detectedLanguage,
    });
    setShowHistory(false);
  };

  const analyzeSentiment = async (): Promise<void> => {
    if (!text.trim()) {
      setError("Please enter some news to verify");
      return;
    }

    if (!apiKey) {
      setError("Please enter your Gemini API key");
      setShowApiKeyInput(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Gemini API endpoint - using gemini-2.0-flash model
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      // Build prompt
      const prompt = `
Analyze the following news for sentiment and fact accuracy in ${language}.
Classify it as exactly one of these categories: "Authentic", "Genuine", "Neutral", "Misleading", or "False",
and classify it as exactly one of these categories: "positive", "negative", or "neutral".
Also provide a confidence score between 0 and 1.
Provide a one-paragraph explanation for your classification.
Format your response as a JSON object with the following structure:
{
  "classification": "Authentic",
  "sentiment": "positive",
  "confidence": 0.85,
  "explanation": "Your detailed explanation..."
}
Only return the JSON object, nothing else.
News to analyze: "${text}"
      `.trim();

      // Call Gemini API
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "API request failed");
      }

      const data = await response.json();

      // Extract candidate response
      const textResponse = data.candidates[0].content.parts[0].text;

      // Find the JSON object (in case there's extra text)
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Invalid response format from API");
      }

      const jsonResponse = JSON.parse(jsonMatch[0]);

      // Validate and process response
      const validSentiments = [
        "positive",
        "negative",
        "neutral",
        "misleading",
        "real",
      ];
      const sentiment = jsonResponse.sentiment?.toLowerCase();
      if (!sentiment || !validSentiments.includes(sentiment)) {
        throw new Error("Invalid sentiment value in API response");
      }

      let confidence = jsonResponse.confidence;
      if (typeof confidence !== "number" || confidence < 0 || confidence > 1) {
        confidence = 0.7;
      }

      const analysisResult: AnalysisResult = {
        sentiment: sentiment as AnalysisResult["sentiment"],
        confidence,
        explanation: jsonResponse.explanation || "No explanation provided",
        classification: jsonResponse.classification || "Neutral",
      };

      setResult(analysisResult);

      // Add to history
      const historyItem: HistoryItem = {
        ...analysisResult,
        text: text.length > 50 ? `${text.substring(0, 50)}...` : text,
        fullText: text,
        url: url,
        timestamp: new Date().toISOString(),
      };

      setHistory((prev) => [historyItem, ...prev.slice(0, 9)]);
    } catch (err) {
      console.error("Error in analyzeSentiment:", err);
      setError(
        err instanceof Error ? err.message : "Failed to analyze sentiment"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getSentimentIcon = () => {
    if (!result) return null;


    switch (result.sentiment) {
      case "positive":
        return (
          <CheckCircleIcon color="success" fontSize="large" sx={{ mr: 1 }} />
        );
      case "negative":
        return <ErrorIcon color="error" fontSize="large" sx={{ mr: 1 }} />;
      case "neutral":
        return <HelpIcon color="info" fontSize="large" sx={{ mr: 1 }} />;
      case "misleading":
        return <WarningIcon color="warning" fontSize="large" sx={{ mr: 1 }} />;
      case "real":
        return (
          <CheckCircleIcon color="success" fontSize="large" sx={{ mr: 1 }} />
        );
      default:
        return <HelpIcon color="action" fontSize="large" sx={{ mr: 1 }} />;
    }
  };

  const getSentimentColor = () => {
    if (!result) return "inherit";

    switch (result.sentiment) {
      case "positive":
        return "success.main";
      case "negative":
        return "error.main";
      case "neutral":
        return "info.main";
      case "misleading":
        return "warning.main";
      case "real":
        return "success.main";
      default:
        return "text.primary";
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Fake News Detector
          </Typography>

          {/* API Key Input */}
          {showApiKeyInput && (
            <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                fullWidth
                label="Gemini API Key"
                type="password"
                value={apiKey}
                onChange={handleApiKeyChange}
                size="small"
              />
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={saveApiKey}
              >
                Save
              </Button>
            </Box>
          )}

          {/* Language Selector */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Analysis Language</InputLabel>
            <Select
              value={language}
              label="Analysis Language"
              onChange={handleLanguageChange}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="ig">Igbo</MenuItem>
              <MenuItem value="ha">Hausa</MenuItem>
              <MenuItem value="yo">Yoruba</MenuItem>
              <MenuItem value="pcm">Nigerian Pidgin</MenuItem>
            </Select>
          </FormControl>

          {/* Text Input */}
          <TextField
            fullWidth
            multiline
            rows={6}
            label={`News content to analyze (in ${language.toUpperCase()})`}
            value={text}
            onChange={handleTextChange}
            sx={{ mb: 2 }}
          />

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Button
              variant="contained"
              onClick={analyzeSentiment}
              disabled={isLoading || !text.trim()}
              startIcon={
                isLoading ? <CircularProgress size={20} /> : <RefreshIcon />
              }
            >
              {isLoading ? "Analyzing..." : "Analyze News"}
            </Button>
            <Button
              variant="outlined"
              onClick={clearInput}
              startIcon={<ClearIcon />}
            >
              Clear
            </Button>
            <Button
              variant="outlined"
              onClick={() => setShowHistory(!showHistory)}
              startIcon={<HistoryIcon />}
            >
              History ({history.length})
            </Button>
          </Box>

          {/* Error Display */}
          {error && (
            <Snackbar
              open={!!error}
              autoHideDuration={6000}
              onClose={() => setError(null)}
              message={error}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            />
          )}

          {/* Results Display */}
          {result && (
            <Paper
              elevation={2}
              sx={{
                p: 2,
                mt: 2,
                borderLeft: `4px solid`,
                borderColor: getSentimentColor(),
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                {getSentimentIcon()}
                <Typography variant="h6" color={getSentimentColor()}>
                  {result.classification}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography variant="subtitle1" sx={{ mr: 1 }}>
                  Confidence:
                </Typography>
                <Badge
                  badgeContent={`${Math.round(result.confidence * 100)}%`}
                  color="primary"
                />
              </Box>
              {result.detectedLanguage && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Detected Language: {result.detectedLanguage.toUpperCase()}
                </Typography>
              )}
              <Typography variant="body1" sx={{ mt: 1 }}>
                {result.explanation}
              </Typography>
            </Paper>
          )}

          {/* History Panel */}
          <Collapse in={showHistory}>
            <Box sx={{ mt: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="h6">Analysis History</Typography>
                <Button
                  size="small"
                  onClick={clearHistory}
                  disabled={history.length === 0}
                >
                  Clear History
                </Button>
              </Box>
              <Divider />
              {history.length > 0 ? (
                <List dense>
                  {history.map((item, index) => (
                    <ListItemButton
                      key={index}
                      onClick={() => loadHistoryItem(item)}
                      sx={{
                        borderLeft: `4px solid`,
                        borderColor:
                          item.sentiment === "positive"
                            ? "success.main"
                            : item.sentiment === "negative"
                            ? "error.main"
                            : item.sentiment === "neutral"
                            ? "info.main"
                            : "warning.main",
                        mb: 1,
                      }}
                    >
                      <ListItemIcon>
                        {item.sentiment === "positive" ? (
                          <CheckCircleIcon color="success" />
                        ) : item.sentiment === "negative" ? (
                          <ErrorIcon color="error" />
                        ) : (
                          <HelpIcon color="info" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        secondary={
                          <>
                            {item.url && (
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.secondary"
                                sx={{ display: "block" }}
                              >
                                {item.url}
                              </Typography>
                            )}
                            {`${item.classification} (${Math.round(
                              item.confidence * 100
                            )}% confidence)`}
                          </>
                        }
                      />
                    </ListItemButton>
                  ))}
                </List>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  No history yet. Analyze some news to see results here.
                </Typography>
              )}
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FakeNewsDetector;
