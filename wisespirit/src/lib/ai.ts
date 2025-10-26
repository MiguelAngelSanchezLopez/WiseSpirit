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

export async function generateDetailedDecision(
  airlineName: string,
  bottleType: string,
  volume: number,
  policy: any
) {
  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-latest:generateContent",
      {
        contents: [
          {
            parts: [
              {
                text: `You are an expert airline catering operations manager. Analyze this alcohol bottle handling scenario and provide a comprehensive decision with detailed instructions for the operator.

AIRLINE: ${airlineName}
BOTTLE TYPE: ${bottleType}
REMAINING VOLUME: ${volume}%
POLICY RULES:
- Reuse threshold: ${policy.minReusePercentage || 'Not specified'}%
- Discard threshold: ${policy.discardBelow || 'Not specified'}%
- Can combine bottles: ${policy.canCombine ? 'Yes' : 'No'}
${policy.policyText ? `- Additional policy: ${policy.policyText}` : ''}

Provide your response as JSON with this exact structure:
{
  "action": "REUSE|DISCARD|COMBINE|HOLD FOR REVIEW",
  "confidence": "HIGH|MEDIUM|LOW",
  "reasoning": "Brief explanation of why this decision was made",
  "operatorInstructions": "Step-by-step instructions for the operator",
  "safetyNotes": "Any safety considerations or warnings",
  "nextSteps": "What should happen next in the process"
}

Consider:
- Volume percentage relative to thresholds
- Bottle type (premium spirits vs standard beverages)
- Airline-specific policies and quality standards
- Safety and hygiene requirements
- Operational efficiency
- Cost considerations

Be specific and actionable in your instructions.`,
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
