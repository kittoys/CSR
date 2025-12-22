async function testAPI() {
  const API_BASE = "http://localhost:5000/api";

  console.log("🧪 Testing CSR API Endpoints\n");
  console.log("═".repeat(50));

  try {
    // Test 1: Check if API is running
    console.log("\n1️⃣  Testing API Connection...");
    const response = await fetch("http://localhost:5000");
    const data = await response.json();
    console.log("✅ API is running");
    console.log("   Response:", data);

    // Test 2: Get all proposals
    console.log("\n2️⃣  Testing GET /api/proposals...");
    const proposalsRes = await fetch(`${API_BASE}/proposals`);
    const proposalsData = await proposalsRes.json();
    console.log(`✅ Found ${proposalsData.length} proposals`);

    if (proposalsData.length > 0) {
      const first = proposalsData[0];
      console.log(`   Sample: ${first.case_id} - ${first.proposal_name}`);
      console.log(`   Budget: Rp${first.budget}`);
      console.log(`   Status: ${first.status}`);
    }

    // Test 3: Get proposal statistics
    console.log("\n3️⃣  Testing GET /api/proposals/stats/summary...");
    const statsRes = await fetch(`${API_BASE}/proposals/stats/summary`);
    const statsData = await statsRes.json();
    console.log("✅ Statistics retrieved");
    console.log(`   Total Proposals: ${statsData.total_proposals}`);
    console.log(`   In Progress: ${statsData.in_progress}`);
    console.log(`   Siap Diambil: ${statsData.waiting}`);
    console.log(`   Done: ${statsData.completed}`);
    console.log(`   Total Budget: Rp${statsData.total_budget}`);

    console.log("\n═".repeat(50));
    console.log("✅ All API endpoints are working correctly!\n");
    console.log("🎉 Dashboard should load without errors now.\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error:", error.message);

    if (
      error.code === "ECONNREFUSED" ||
      error.message.includes("ECONNREFUSED")
    ) {
      console.error("\n⚠️  Backend is not running!");
      console.error("   Please start backend first:");
      console.error("   cd c:\\Users\\HYPE AMD\\CSR\\csr-backend");
      console.error("   npm start");
    }

    process.exit(1);
  }
}

testAPI();
