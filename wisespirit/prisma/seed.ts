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
        policyText: `ALCOHOL BOTTLE HANDLING POLICY - BRITISH AIRWAYS CATERING SERVICES

Section 4.2: Partial Bottle Management
- Bottles containing 60% or more of original volume: REUSE for same flight or next available service
- Bottles containing 30-59% of original volume: COMBINE with other bottles of same brand and type
- Bottles containing less than 30% of original volume: DISCARD immediately for safety and quality reasons
- All combining operations must be documented with batch numbers and staff signatures
- Exception: Premium spirits (single malt, vintage wines) may be reused down to 40% volume
- All decisions must be logged in the catering management system within 2 hours of service completion

Quality Control: Any bottle showing signs of contamination, tampering, or improper storage must be discarded regardless of volume percentage.`,
      },
      {
        airlineName: "Emirates",
        policyText: `EMIRATES IN-FLIGHT BEVERAGE POLICY - PARTIAL CONSUMPTION

1. Reuse Criteria: Any alcoholic beverage bottle with 70% or more of its original volume remaining may be resealed and reused on subsequent flights.
2. Discard Threshold: Bottles with less than 25% volume remaining must be discarded.
3. Combination: Combining contents of identical beverage types (same brand, same vintage) is permitted if the combined volume exceeds 50% and is properly logged.
4. Documentation: All reuse and combination actions require entry into the inventory system, noting volume, date, and staff ID.
5. Quality Assurance: All bottles must undergo visual inspection before reuse. Any signs of contamination, oxidation, or tampering result in immediate discard.
6. Storage: Reusable bottles stored in climate-controlled secure area with proper security seals.`,
      },
      {
        airlineName: "Singapore Airlines",
        policyText: `SINGAPORE AIRLINES - ALCOHOL SERVICE GUIDELINES

- Bottles with 50% or more liquid remaining are eligible for reuse.
- Bottles with less than 20% liquid remaining must be discarded.
- Combining contents from different bottles is strictly prohibited to maintain quality and brand integrity.
- All decisions are final and must be recorded in the catering management system.
- Premium spirits (vintage wines, aged spirits) may be considered for reuse down to 30% volume with supervisor approval.
- All reusable bottles must have new security seals applied before returning to inventory.`,
      },
      {
        airlineName: "Qatar Airways",
        policyText: `QATAR AIRWAYS - ALCOHOLIC BEVERAGE MANAGEMENT STANDARDS

Section 3: Partial Bottle Handling Procedures
- REUSE authorization: Bottles maintaining 65% or greater volume can be recapped and restocked for future service
- COMBINE protocol: Bottles containing between 35% and 64% volume may be combined with identical products (same brand, type, and batch code) with management approval
- DISCARD requirement: Any bottle below 35% volume must be removed from inventory and discarded immediately
- Special Handling: Premium and vintage spirits (single malts, aged spirits over 12 years) have extended reuse allowance down to 40% volume
- Labeling: All reused or combined bottles must have new seals applied with current date stamp and processing staff signature
- Quality Control: Visual inspection required for all bottles before reuse; any signs of oxidation, contamination, or tampering result in immediate discard
- Documentation: Complete inventory log entry required including original volume, current volume, action taken, staff ID, and timestamp

Storage: All processed bottles must be stored in climate-controlled inventory area with proper security seals.
Compliance: All alcohol handling decisions are subject to audit by quality assurance team.`,
      },
      {
        airlineName: "Swiss International Air Lines",
        policyText: `SWISS INTERNATIONAL AIR LINES - ALCOHOLIC BEVERAGE OPERATIONS MANUAL

Partial Consumption Policy:
- Reuse Standard: Bottles with minimum 55% remaining liquid after service are eligible for reseal and reuse
- Discard Threshold: Bottles containing less than 22% of original volume must be immediately removed from service and discarded for quality and hygiene reasons
- Combining Prohibition: Swiss International strictly prohibits combining partial bottles to maintain product quality, brand integrity, and prevent cross-contamination risks
- Premium Exception: Exceptionally expensive spirits (defined as >$100 retail per bottle) may be evaluated by shift supervisor for potential reuse down to 40% volume on a case-by-case basis
- Security Sealing: All reused bottles require new tamper-evident seals with date and shift identifier before returning to inventory
- Documentation: Mandatory logging in catering management system including bottle barcode scan, volume measurement, action decision, and supervisory approval signature
- Storage Protocol: Reusable bottles stored in designated secured area separate from new stock, organized by flight assignment schedule
- Quality Assurance: All bottles undergo visual and olfactory inspection; any concerns about flavor, appearance, or container integrity result in discard regardless of volume

Compliance: All alcohol handling decisions are subject to audit by compliance officers. Unauthorized combination of partial bottles is considered a critical procedural violation.
Traceability: Complete audit trail required for all alcohol handling decisions including timestamps, staff identification, and supervisory sign-off.`,
      },
      {
        airlineName: "Delta Air Lines",
        policyText: `DELTA AIR LINES - ALCOHOLIC BEVERAGE INVENTORY MANAGEMENT POLICY

Guideline 5.3: Handling of Partially Consumed Products
- Reuse Authorization: Bottles retaining 60% or more of initial volume may be secured with tamper-evident seals and returned to inventory for future flight provisioning
- Combining Policy: Delta permits combining contents from matching bottles (identical brand, type, and production batch) when both bottles individually contain at least 25% volume, provided the combined volume meets or exceeds 50%
- Discard Mandate: Bottles with less than 25% volume remaining must be removed from service and discarded through approved waste management procedures
- Premium Spirits Provision: High-value spirits (retail value exceeding $75 USD) allow extended reuse threshold to 35% minimum volume with supervisory approval
- Labeling Requirements: All reused or combined bottles require updated label indicating: date of processing, staff initials, original fill date, and combined volume percentage
- Inventory Tracking: Each bottle transaction must be logged in the Enterprise Resource Planning system with barcode scan, volume measurement (verified by second staff member), and decision rationale
- Safety Protocols: Staff handling partial bottles must verify seal integrity, check for signs of contamination or improper storage, and document any deviations from standard procedures
- Storage Standards: Processed bottles stored in climate-controlled secure facility, rotated by processing date to ensure first-in-first-out service allocation
- Compliance: All alcohol handling procedures are subject to random audit by quality assurance team. Unauthorized handling or documentation failures result in disciplinary action per Delta Operational Standards Manual.

Financial Impact: Proper partial bottle management reduces waste and operational costs while maintaining service quality standards expected by Delta passengers.
Documentation: Complete audit trail required for all decisions including timestamp, staff ID, volume measurements, and supervisory approval when applicable.`,
      },
    ],
  });
  console.log("✅ Seed data inserted: 7 airlines added to database");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
