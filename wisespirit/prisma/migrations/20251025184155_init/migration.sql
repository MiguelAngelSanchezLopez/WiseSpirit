-- CreateTable
CREATE TABLE "AirlinePolicy" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "airlineName" TEXT NOT NULL,
    "minReusePercentage" INTEGER,
    "discardBelow" INTEGER,
    "canCombine" BOOLEAN NOT NULL DEFAULT false,
    "policyText" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DecisionLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "airlineName" TEXT NOT NULL,
    "bottleType" TEXT NOT NULL,
    "volume" INTEGER NOT NULL,
    "decision" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "AirlinePolicy_airlineName_key" ON "AirlinePolicy"("airlineName");
