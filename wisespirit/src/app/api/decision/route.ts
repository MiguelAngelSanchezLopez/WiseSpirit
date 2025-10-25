import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { interpretPolicyText, generateDetailedDecision } from "@/lib/ai";

export async function POST(req: Request) {
  const { airlineName, bottleType, volume } = await req.json();

  try {
    let policy = await prisma.airlinePolicy.findUnique({ where: { airlineName } });

    if (!policy) {
      return NextResponse.json({ error: "No policy found for this airline" }, { status: 404 });
    }

    // If policy has text but no structured rules, interpret it first
    if (!policy.minReusePercentage && policy.policyText) {
      const aiRules = await interpretPolicyText(policy.policyText);
      if (aiRules) {
        policy = await prisma.airlinePolicy.update({
          where: { id: policy.id },
          data: {
            minReusePercentage: aiRules.minReusePercentage,
            discardBelow: aiRules.discardBelow,
            canCombine: aiRules.canCombine,
          },
        });
      }
    }

    // Generate comprehensive AI-powered decision
    const detailedDecision = await generateDetailedDecision(airlineName, bottleType, volume, policy);
    
    if (!detailedDecision) {
      // Fallback to simple logic if AI fails
      let decision = "Hold for review";
      if (policy.discardBelow && volume < policy.discardBelow) {
        decision = "Discard";
      } else if (policy.minReusePercentage && volume >= policy.minReusePercentage) {
        decision = "Reuse";
      } else if (policy.canCombine && volume >= (policy.discardBelow || 0)) {
        decision = "Combine";
      }
      
      await prisma.decisionLog.create({
        data: { airlineName, bottleType, volume, decision },
      });

      return NextResponse.json({ 
        decision,
        confidence: "LOW",
        reasoning: "Fallback decision due to AI unavailability",
        operatorInstructions: "Please review this bottle manually and follow standard procedures.",
        safetyNotes: "Ensure proper handling and hygiene protocols are followed.",
        nextSteps: "Manual review required"
      });
    }

    // Log the decision
    await prisma.decisionLog.create({
      data: { 
        airlineName, 
        bottleType, 
        volume, 
        decision: detailedDecision.action 
      },
    });

    return NextResponse.json(detailedDecision);
  } catch (err) {
    console.error("Decision route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
