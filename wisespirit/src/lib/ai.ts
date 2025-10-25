import axios from "axios";

export async function interpretPolicyText(policyText: string) {
  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-latest:generateContent",
      {
        contents: [
          {
            parts: [
              {
                text: `Convert this airline alcohol policy text into JSON with:
                {
                  "minReusePercentage": number,
                  "discardBelow": number,
                  "canCombine": boolean
                }
                Text: """${policyText}"""`,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY!,
        },
      }
    );

    const textResponse =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    
    // Clean up the response - remove markdown code blocks if present
    const cleanedResponse = textResponse
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    return JSON.parse(cleanedResponse);
  } catch (err) {
    console.error("Gemini API error:", err);
    return null;
  }
}
