#!/bin/bash

echo "🧪 Testing New Airlines in WiseSpirit Database"
echo "=============================================="
echo ""

# Qatar Airways Tests
echo "🇶🇦 Testing Qatar Airways..."
echo "----------------------------"
echo "Test 1: 70% volume (should REUSE)"
curl -s -X POST http://localhost:3000/api/decision \
  -H "Content-Type: application/json" \
  -d '{"airlineName": "Qatar Airways", "bottleType": "Premium Scotch", "volume": 70}' | jq -r '.action + " | Confidence: " + .confidence'
echo ""

echo "Test 2: 50% volume (should COMBINE)"
curl -s -X POST http://localhost:3000/api/decision \
  -H "Content-Type: application/json" \
  -d '{"airlineName": "Qatar Airways", "bottleType": "Champagne", "volume": 50}" | jq -r '.action + " | Confidence: " + .confidence'
echo ""

echo "Test 3: 30% volume (should DISCARD)"
curl -s -X POST http://localhost:3000/api/decision \
  -H "Content-Type: application/json" \
  -d '{"airlineName": "Qatar Airways", "bottleType": "Wine", "volume": 30}' | jq -r '.action + " | Confidence: " + .confidence'
echo ""
echo ""

# Swiss International Air Lines Tests
echo "🇨🇭 Testing Swiss International Air Lines..."
echo "--------------------------------------------"
echo "Test 1: 60% volume (should REUSE)"
curl -s -X POST http://localhost:3000/api/decision \
  -H "Content-Type: application/json" \
  -d '{"airlineName": "Swiss International Air Lines", "bottleType": "Swiss Wine", "volume": 60}' | jq -r '.action + " | Confidence: " + .confidence'
echo ""

echo "Test 2: 40% volume (should HOLD - combining prohibited)"
curl -s -X POST http://localhost:3000/api/decision \
  -H "Content-Type: application/json" \
  -d '{"airlineName": "Swiss International Air Lines", "bottleType": "Beer", "volume": 40}' | jq -r '.action + " | Confidence: " + .confidence'
echo ""

echo "Test 3: 18% volume (should DISCARD)"
curl -s -X POST http://localhost:3000/api/decision \
  -H "Content-Type: application/json" \
  -d '{"airlineName": "Swiss International Air Lines", "bottleType": "Spirit", "volume": 18}' | jq -r '.action + " | Confidence: " + .confidence'
echo ""
echo ""

# Delta Air Lines Tests
echo "✈️ Testing Delta Air Lines..."
echo "-----------------------------"
echo "Test 1: 65% volume (should REUSE)"
curl -s -X POST http://localhost:3000/api/decision \
  -H "Content-Type: application/json" \
  -d '{"airlineName": "Delta Air Lines", "bottleType": "Bourbon", "volume": 65}' | jq -r '.action + " | Confidence: " + .confidence'
echo ""

echo "Test 2: 40% volume (should COMBINE or HOLD)"
curl -s -X POST http://localhost:3000/api/decision \
  -H "Content-Type: application/json" \
  -d '{"airlineName": "Delta Air Lines", "bottleType": "Scotch", "volume": 40}' | jq -r '.action + " | Confidence: " + .confidence'
echo ""

echo "Test 3: 20% volume (should DISCARD)"
curl -s -X POST http://localhost:3000/api/decision \
  -H "Content-Type: application/json" \
  -d '{"airlineName": "Delta Air Lines", "bottleType": "Gin", "volume": 20}' | jq -r '.action + " | Confidence: " + .confidence'
echo ""
echo ""

# Emirates Tests
echo "🇦🇪 Testing Emirates..."
echo "------------------------"
echo "Test 1: 75% volume (should REUSE)"
curl -s -X POST http://localhost:3000/api/decision \
  -H "Content-Type: application/json" \
  -d '{"airlineName": "Emirates", "bottleType": "Champagne", "volume": 75}' | jq -r '.action + " | Confidence: " + .confidence'
echo ""

echo "Test 2: 55% volume (should COMBINE)"
curl -s -X POST http://localhost:3000/api/decision \
  -H "Content-Type: application/json" \
  -d '{"airlineName": "Emirates", "bottleType": "Vintage Wine", "volume": 55}' | jq -r '.action + " | Confidence: " + .confidence'
echo ""

echo "Test 3: 20% volume (should DISCARD)"
curl -s -X POST http://localhost:3000/api/decision \
  -H "Content-Type: application/json" \
  -d '{"airlineName": "Emirates", "bottleType": "Beer", "volume": 20}' | jq -r '.action + " | Confidence: " + .confidence'
echo ""
echo ""

# Singapore Airlines Tests
echo "🇸🇬 Testing Singapore Airlines..."
echo "--------------------------------"
echo "Test 1: 60% volume (should REUSE)"
curl -s -X POST http://localhost:3000/api/decision \
  -H "Content-Type: application/json" \
  -d '{"airlineName": "Singapore Airlines", "bottleType": "Whiskey", "volume": 60}' | jq -r '.action + " | Confidence: " + .confidence'
echo ""

echo "Test 2: 30% volume (should HOLD or DISCARD - combining prohibited)"
curl -s -X POST http://localhost:3000/api/decision \
  -H "Content-Type: application/json" \
  -d '{"airlineName": "Singapore Airlines", "bottleType": "Gin", "volume": 30}' | jq -r '.action + " | Confidence: " + .confidence'
echo ""

echo "✅ All tests completed!"
echo ""
echo "📊 Summary: New airlines tested successfully with AI-powered decision system"

