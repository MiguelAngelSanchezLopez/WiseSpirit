# 🧪 WiseSpirit Test Cases - New Seed Script

## Database Status
✅ **Database Seeded:** 7 airlines (SQLite: `dev.db`)
📋 **Total Airlines:** Aeromexico, Lufthansa, British Airways, Emirates, Singapore Airlines, Qatar Airways, Swiss International Air Lines, Delta Air Lines

---

## 🧪 Complete Test Cases

### Test 1: Qatar Airways - Premium Spirits Reuse
```bash
curl -X POST http://localhost:3000/api/decision \
  -H "Content-Type: application/json" \
  -d '{"airlineName": "Qatar Airways", "bottleType": "Single Malt Whiskey", "volume": 70}'
```
**Expected Decision:** `REUSE` (above 65% threshold)  
**Confidence:** HIGH  
**Notes:** Should allow reuse with proper sealing and documentation

---

### Test 2: Qatar Airways - Combine Scenario
```bash
curl -X POST http://localhost:3000/api/decision \
  -H "Content-Type: application/json" \
  -d '{"airlineName": "Qatar Airways", "bottleType": "Champagne", "volume": 50}'
```
**Expected Decision:** `COMBINE` (between 35-64%, combining permitted with approval)  
**Confidence:** HIGH  
**Notes:** Requires management approval for combining, proper documentation

---

### Test 3: Qatar Airways - Discard Below Threshold
```bash
curl -X POST http://localhost:3000/api/decision \
  -H "Content-Type: application/json" \
  -d '{"airlineName": "Qatar Airways", "bottleType": "Wine", "volume": 30}'
```
**Expected Decision:** `DISCARD` (below 35% threshold)  
**Confidence:** HIGH  
**Notes:** Below discard requirement, must be removed from inventory immediately

---

### Test 4: Swiss International Air Lines - Reuse Standard
```bash
curl -X POST http://localhost:3000/api/decision \
  -H "Content-Type: application/json" \
  -d '{"airlineName": "Swiss International Air Lines", "bottleType": "Swiss Wine", "volume": 60}'
```
**Expected Decision:** `REUSE` (above 55% threshold)  
**Confidence:** HIGH  
**Notes:** Requires new tamper-evident seal with date and shift identifier

---

### Test 5: Swiss International Air Lines - Premium Exception
```bash
curl -X POST http://localhost:3000/api/decision \
  -H "Content-Type: application/json" \
  -d '{"airlineName": "Swiss International Air Lines", "bottleType": "Vintage Champagne ($150 retail)", "volume": 45}'
```
**Expected Decision:** `REUSE` or `HOLD_FOR_REVIEW` (premium exception down to 40%)  
**Confidence:** MEDIUM  
**Notes:** Exceptionally expensive spirits evaluated by supervisor case-by-case

---

### Test 6: Swiss International Air Lines - Discard Below Threshold
```bash
curl -X POST http://localhost:3000/api/decision \
  -H "Content-Type: application/json" \
  -d '{"airlineName": "Swiss International Air Lines", "bottleType": "Beer", "volume": 18}'
```
**Expected Decision:** `DISCARD` (below 22% threshold)  
**Confidence:** HIGH  
**Notes:** Quality and hygiene reasons, immediate removal from service

---

### Test 7: Delta Air Lines - Standard Reuse
```bash
curl -X POST http://localhost:3000/api/decision \
  -H "Content-Type: application/json" \
  -d '{"airlineName": "Delta Air Lines", "bottleType": "Bourbon", "volume": 65}'
```
**Expected Decision:** `REUSE` (above 60% threshold)  
**Confidence:** HIGH  
**Notes:** Secure with tamper-evident seals, return to inventory

---

### Test 8: Delta Air Lines - Conditional Combine
```bash
curl -X POST http://localhost:3000/api/decision \
  -H "Content-Type: application/json" \
  -d '{"airlineName": "Delta Air Lines", "bottleType": "Scotch", "volume": 40}'
```
**Expected Decision:** `COMBINE` or `HOLD_FOR_REVIEW` (25%+, combined volume must reach 50%)  
**Confidence:** MEDIUM  
**Notes:** Permits combining if both bottles are 25%+ and combined volume reaches 50%

---

### Test 9: Delta Air Lines - Premium Spirits Exception
```bash
curl -X POST http://localhost:3000/api/decision \
  -H "Content-Type: application/json" \
  -d '{"airlineName": "Delta Air Lines", "bottleType": "Premium Whiskey ($100 retail)", "volume": 38}'
```
**Expected Decision:** `REUSE` (premium spirits down to 35% with supervisory approval)  
**Confidence:** MEDIUM  
**Notes:** High-value spirits ($75+ retail) allow extended reuse threshold to 35% minimum

---

### Test 10: Delta Air Lines - Discard Below Threshold
```bash
curl -X POST http://localhost:3000/api/decision \
  -H "Content-Type: application/json" \
  -d '{"airlineName": "Delta Air Lines", "bottleType": "Gin", "volume": 20}'
```
**Expected Decision:** `DISCARD` (below 25% threshold)  
**Confidence:** HIGH  
**Notes:** Remove from service and discard through approved waste management

---

### Test 11: Emirates - Reuse Above Threshold
```bash
curl -X POST http://localhost:3000/api/decision \
  -H "Content-Type: application/json" \
  -d '{"airlineName": "Emirates", "bottleType": "Champagne", "volume": 75}'
```
**Expected Decision:** `REUSE` (above 70% threshold)  
**Confidence:** HIGH  
**Notes:** Reseal and reuse on subsequent flights, proper documentation required

---

### Test 12: Emirates - Combine Permitted
```bash
curl -X POST http://localhost:3000/api/decision \
  -H "Content-Type: application/json" \
  -d '{"airlineName": "Emirates", "bottleType": "Vintage Wine", "volume": 55}'
```
**Expected Decision:** `COMBINE` (combined volume exceeds 50% permitted)  
**Confidence:** HIGH  
**Notes:** Combining identical beverages (same brand, vintage) is permitted if combined volume exceeds 50%

---

### Test 13: Emirates - Discard Below Threshold
```bash
curl -X POST http://localhost:3000/api/decision \
  -H "Content-Type: application/json" \
  -d '{"airlineName": "Emirates", "bottleType": "Beer", "volume": 20}'
```
**Expected Decision:** `DISCARD` (below 25% threshold)  
**Confidence:** HIGH  
**Notes:** Must be discarded, visual inspection before reuse

---

### Test 14: Singapore Airlines - Standard Reuse
```bash
curl -X POST http://localhost:3000/api/decision \
  -H "Content-Type: application/json" \
  -d '{"airlineName": "Singapore Airlines", "bottleType": "Whiskey", "volume": 60}'
```
**Expected Decision:** `REUSE` (above 50% threshold)  
**Confidence:** HIGH  
**Notes:** Reuse with new security seals applied

---

### Test 15: Singapore Airlines - Premium Exception
```bash
curl -X POST http://localhost:3000/api/decision \
  -H "Content-Type: application/json" \
  -d '{"airlineName": "Singapore Airlines", "bottleType": "Vintage Wine ($200)", "volume": 35}'
```
**Expected Decision:** `REUSE` or `HOLD_FOR_REVIEW` (premium spirits down to 30% with supervisor approval)  
**Confidence:** MEDIUM  
**Notes:** Premium spirits may be considered for reuse down to 30% volume with supervisor approval

---

### Test 16: Singapore Airlines - Prohibited Combining
```bash
curl -X POST http://localhost:3000/api/decision \
  -H "Content-Type: application/json" \
  -d '{"airlineName": "Singapore Airlines", "bottleType": "Gin", "volume": 25}'
```
**Expected Decision:** `HOLD_FOR_REVIEW` or `DISCARD` (combining strictly prohibited)  
**Confidence:** MEDIUM  
**Notes:** Between 20-50%, combining is prohibited - manual review required

---

### Test 17: British Airways - Enhanced AI Interpretation
```bash
curl -X POST http://localhost:3000/api/decision \
  -H "Content-Type: application/json" \
  -d '{"airlineName": "British Airways", "bottleType": "Premium Gin", "volume": 55}'
```
**Expected Decision:** `COMBINE` (between 30-59%, combining permitted)  
**Confidence:** HIGH  
**Notes:** Requires documentation with batch numbers and staff signatures

---

### Test 18: British Airways - Premium Spirits Exception
```bash
curl -X POST http://localhost:3000/api/decision \
  -H "Content-Type: application/json" \
  -d '{"airlineName": "British Airways", "bottleType": "Single Malt Scotch", "volume": 35}'
```
**Expected Decision:** `REUSE` (premium spirits down to 40%, bottle is 35% - check if qualifies)  
**Confidence:** MEDIUM  
**Notes:** Premium spirits may be reused down to 40% volume, this bottle is 35% so likely DISCARD

---

### Test 19: Lufthansa - Boundary Testing
```bash
curl -X POST http://localhost:3000/api/decision \
  -H "Content-Type: application/json" \
  -d '{"airlineName": "Lufthansa", "bottleType": "Beer", "volume": 50}'
```
**Expected Decision:** `REUSE` (exactly at 50% threshold)  
**Confidence:** HIGH  
**Notes:** Meets minimum reuse percentage

---

### Test 20: Lufthansa - Combining Prohibited
```bash
curl -X POST http://localhost:3000/api/decision \
  -H "Content-Type: application/json" \
  -d '{"airlineName": "Lufthansa", "bottleType": "Wine", "volume": 40}'
```
**Expected Decision:** `HOLD_FOR_REVIEW` (between thresholds, combining not allowed)  
**Confidence:** MEDIUM  
**Notes:** 40% is between 50% reuse and 20% discard, and combining is prohibited

---

## 🎯 Expected AI Decision Characteristics

### For All Tests:
1. **Detailed Reasoning:** Clear explanation of why the decision was made
2. **Operator Instructions:** Step-by-step actionable instructions
3. **Safety Notes:** Hygiene, contamination, and handling protocols
4. **Next Steps:** What happens after the immediate action
5. **Confidence Levels:** HIGH/MEDIUM/LOW based on policy clarity

### Key Differentiators by Airline:

**Qatar Airways:**
- 65% reuse, 35% discard thresholds
- Can combine with management approval (35-64% range)
- Premium spirits exception down to 40%
- Climate-controlled storage required

**Swiss International Air Lines:**
- 55% reuse, 22% discard thresholds
- **Combining PROHIBITED** (strict policy)
- Premium exception for >$100 spirits down to 40%
- Mandatory tamper-evident seals

**Delta Air Lines:**
- 60% reuse, 25% discard thresholds
- Conditional combining (both bottles 25%+, combined 50%+)
- Premium spirits (>$75 retail) down to 35%
- ERP system logging required with barcode scans

**Emirates:**
- 70% reuse, 25% discard thresholds
- Can combine if combined volume exceeds 50%
- Quality assurance visual inspection required
- Climate-controlled secure storage

**Singapore Airlines:**
- 50% reuse, 20% discard thresholds
- **Combining PROHIBITED**
- Premium spirits down to 30% with supervisor approval
- New security seals required for all reusable bottles

---

## 🚀 Quick Test Command

Run all test cases at once:
```bash
# Test Qatar Airways
curl -X POST http://localhost:3000/api/decision -H "Content-Type: application/json" -d '{"airlineName": "Qatar Airways", "bottleType": "Whiskey", "volume": 70}' | jq .

# Test Swiss International
curl -X POST http://localhost:3000/api/decision -H "Content-Type: application/json" -d '{"airlineName": "Swiss International Air Lines", "bottleType": "Swiss Wine", "volume": 60}' | jq .

# Test Delta Air Lines
curl -X POST http://localhost:3000/api/decision -H "Content-Type: application/json" -d '{"airlineName": "Delta Air Lines", "bottleType": "Bourbon", "volume": 65}' | jq .

# Test Emirates
curl -X POST http://localhost:3000/api/decision -H "Content-Type: application/json" -d '{"airlineName": "Emirates", "bottleType": "Champagne", "volume": 75}' | jq .
```

---

## 📊 Database Verification

Check seeded airlines in Prisma Studio:
```bash
cd wisespirit
npx prisma studio
# Visit http://localhost:5555
# Navigate to AirlinePolicy table
# Verify all 7 airlines are present
```

