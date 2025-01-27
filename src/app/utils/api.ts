export async function analyzeSentiment(text: string): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_MEANINGCLOUD_API_KEY;
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

    switch (sentiment) {
      case "P+":
        return "Authentic and Verified News!";
      case "P":
        return "Genuine News Content!";
      case "NEU":
        return "Neutral or Uncertain News Content!";
      case "N":
        return "Misleading or Fake News Detected!";
      case "N+":
        return "Highly Misleading or False News!";
      default:
        return "Uncertain or Inconclusive Content!";
    }
  } catch (error) {
    console.error("Error in analyzeSentiment:", error);
    throw error;
  }
}
