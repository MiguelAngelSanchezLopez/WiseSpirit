import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Clear existing data first
  await prisma.decisionLog.deleteMany();
  await prisma.airlinePolicy.deleteMany();
  
  await prisma.airlinePolicy.createMany({
    data: [
      {
        airlineName: "Aeromexico",
        minReusePercentage: 40,
        discardBelow: 30,
        canCombine: true,
      },
      {
        airlineName: "Lufthansa",
        minReusePercentage: 50,
        discardBelow: 20,
        canCombine: false,
      },
      {
        airlineName: "British Airways",
        policyText:
          "Reuse bottles only if more than half full. Discard below 50%. Combining bottles is permitted.",
      },
    ],
  });
  console.log("✅ Seed data inserted");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
