// Test script to verify Gemini API connectivity
// Run with: node test-api.js

const API_KEY = "AIzaSyANI9-knQ6oyQ_itcD3YOorsAjcn87LOuQ";

async function testGeminiAPI() {
  console.log("🔍 Testing Gemini API connection...\n");

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Say hello in one sentence.",
                },
              ],
            },
          ],
        }),
      },
    );

    const data = await response.json();

    if (response.ok) {
      console.log("✅ API Connection Successful!\n");
      console.log("📝 Response:", data.candidates[0].content.parts[0].text);
      console.log("\n✨ Your Gemini API is working correctly!");
    } else {
      console.log("❌ API Error:", response.status, response.statusText);
      console.log("Error details:", JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.log("❌ Network Error:", error.message);
    console.log("\nPossible issues:");
    console.log("1. Check your internet connection");
    console.log("2. Verify API key is correct");
    console.log("3. Check if API is enabled at https://aistudio.google.com/");
  }
}

testGeminiAPI();
