require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');

let server;
const PORT = 5001;
const BASE_URL = `http://127.0.0.1:${PORT}/api/v1`;

const request = async (path, options = {}) => {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const data = await response.json();
  return { status: response.status, data };
};

const runTests = async () => {
  console.log('--- STARTING FARMORA CARE API VERIFICATION SUITE ---');
  try {
    await connectDB();
    await new Promise((resolve) => {
      server = app.listen(PORT, resolve);
    });
    console.log(`[Test Runner] Test server running on ${BASE_URL}`);

    // 1. Health check
    const health = await request('/health');
    console.assert(health.status === 200, 'Health check should return 200');
    console.log('✓ Health check passed');

    // 2. Login as Admin
    const adminLogin = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier: 'admin@farmora.care', password: 'Farmora@Admin2026' }),
    });
    console.assert(adminLogin.status === 200 && adminLogin.data.data.token, 'Admin login failed');
    const adminToken = adminLogin.data.data.token;
    console.log('✓ Admin login passed');

    // 3. Login as Expert
    const expertLogin = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier: 'dr.shinde@farmora.care', password: 'Expert@2026' }),
    });
    console.assert(expertLogin.status === 200 && expertLogin.data.data.token, 'Expert login failed');
    const expertToken = expertLogin.data.data.token;
    console.log('✓ Expert login passed');

    // 4. Farmer Registration (Verify role tampering prevention)
    const farmerReg = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        fullName: 'Test Harvester',
        email: `tester_${Date.now()}@farmora.care`,
        phone: `9899${Math.floor(100000 + Math.random() * 900000)}`,
        password: 'Password@2026',
        role: 'admin', // Malicious attempt to elevate role
      }),
    });
    console.assert(farmerReg.status === 201, 'Registration should succeed');
    console.assert(farmerReg.data.data.user.role === 'farmer', 'Public registration MUST NOT allow admin role elevation');
    const farmerToken = farmerReg.data.data.token;
    console.log('✓ Farmer registration and RBAC enforcement passed');

    // 5. Fetch Crops and Categories
    const cropsRes = await request('/crops');
    const categoriesRes = await request('/categories');
    console.assert(cropsRes.data.data.length > 0, 'Crops list should not be empty');
    console.assert(categoriesRes.data.data.length > 0, 'Categories list should not be empty');
    const sampleCrop = cropsRes.data.data.find(c => c.name === 'Capsicum') || cropsRes.data.data[0];
    const sampleCategory = categoriesRes.data.data.find(c => c.name === 'Crop diseases' || c.name === 'Crop Disease') || categoriesRes.data.data[0];
    console.log(`✓ Reference data verified (${cropsRes.data.data.length} crops, ${categoriesRes.data.data.length} categories)`);

    // 6. Farmer submits problem report
    const newProblemRes = await request('/problems', {
      method: 'POST',
      headers: { Authorization: `Bearer ${farmerToken}` },
      body: JSON.stringify({
        title: 'Severe aphid infestation and leaf curl on polyhouse capsicum',
        cropId: sampleCrop._id,
        categoryId: sampleCategory._id,
        description: 'Leaves are curling upward with sticky honeydew secretion and small green aphids along the veins.',
        district: 'Solapur',
        village: 'Karmala',
      }),
    });
    console.assert(newProblemRes.status === 201, 'Report creation should return 201');
    const createdProblem = newProblemRes.data.data.problem;
    console.assert(createdProblem.status === 'SUBMITTED', 'Initial status must be SUBMITTED');
    console.log(`✓ Farmer report created: ${createdProblem.reportNumber} (Status: ${createdProblem.status})`);

    // 7. Verify RBAC: Farmer cannot access admin dashboard
    const forbiddenRes = await request('/admin/dashboard', {
      headers: { Authorization: `Bearer ${farmerToken}` },
    });
    console.assert(forbiddenRes.status === 403, 'Farmer accessing admin route must be 403 Forbidden');
    console.log('✓ RBAC route guard blocked unauthorized role access');

    // 8. Admin assigns report to Dr. Shinde
    const assignRes = await request(`/admin/problems/${createdProblem._id}/assign`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        expertId: expertLogin.data.data.user._id,
        assignmentNote: 'Assigned for urgent polyhouse virus diagnostics.',
      }),
    });
    console.assert(assignRes.status === 200, 'Assignment should return 200');
    console.log(`✓ Admin successfully assigned case to expert`);

    // 9. Expert retrieves Similar Solved Problems for this case
    const similarRes = await request(`/expert/problems/${createdProblem._id}/similar-cases`, {
      headers: { Authorization: `Bearer ${expertToken}` },
    });
    console.assert(similarRes.status === 200, 'Similar cases query should return 200');
    console.assert(similarRes.data.data.totalFound >= 1, 'Similar solved cases should match historical capsicum case');
    const topMatch = similarRes.data.data.candidates[0];
    console.log(`✓ Similar Solved Problems Engine matched case ${topMatch.reportNumber} with score ${topMatch.matchScore}%`);
    console.log(`   Explanation: ${topMatch.matchDetails.explanation}`);

    // 10. Expert provides response & recommendation
    const expertResponseRes = await request(`/expert/problems/${createdProblem._id}/responses`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${expertToken}` },
      body: JSON.stringify({
        responseType: 'EXPERT_RECOMMENDATION',
        message: 'Identified as severe aphid vector infestation leading to viral transmission.',
        observations: 'High honeydew and nymph clusters observed.',
        recommendations: [
          'Erect yellow sticky cards at canopy level (15 cards/acre).',
          'Apply Acetamiprid 20% SP @ 0.5g/L during non-foraging hours.',
        ],
        precautionaryNotes: 'Wash spraying equipment thoroughly before and after treatment.',
      }),
    });
    console.assert(expertResponseRes.status === 201, 'Expert response creation should return 201');
    console.assert(expertResponseRes.data.data.currentStatus === 'RESPONSE_PROVIDED', 'Status should update to RESPONSE_PROVIDED');
    console.log(`✓ Expert response recorded. Status updated to RESPONSE_PROVIDED`);

    // 11. Farmer views responses and sends follow-up
    const responsesListRes = await request(`/problems/${createdProblem._id}/responses`, {
      headers: { Authorization: `Bearer ${farmerToken}` },
    });
    console.assert(responsesListRes.data.data.length >= 1, 'Farmer should see expert response');

    const followUpRes = await request(`/problems/${createdProblem._id}/follow-ups`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${farmerToken}` },
      body: JSON.stringify({
        message: 'Yellow sticky cards installed. Number of winged aphids has reduced noticeably.',
        issuePersists: false,
      }),
    });
    console.assert(followUpRes.status === 201, 'Farmer follow-up should succeed');
    console.log(`✓ Farmer follow-up recorded successfully`);

    // 12. Expert resolves the case
    const resolveRes = await request(`/expert/problems/${createdProblem._id}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${expertToken}` },
      body: JSON.stringify({
        status: 'RESOLVED',
        reason: 'Pest vector successfully controlled and new leaf flushes are healthy.',
      }),
    });
    console.assert(resolveRes.status === 200, 'Resolving case should return 200');
    console.log(`✓ Expert resolved case ${createdProblem.reportNumber}`);

    // 13. Admin Dashboard Analytics check
    const dashboardRes = await request('/admin/dashboard', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.assert(dashboardRes.status === 200, 'Admin dashboard should return 200');
    const { summary, charts } = dashboardRes.data.data;
    console.assert(summary.totalProblems >= 4, 'Summary must reflect stored problems');
    console.assert(charts.byCategory.length > 0, 'Chart aggregates must have category data');
    console.log(`✓ Admin real database aggregates verified (Total: ${summary.totalProblems}, Resolved: ${summary.resolvedProblems})`);

    console.log('\n--- ALL BACKEND SUITE TESTS PASSED SUCCESSFULLY! ---');
    server.close();
    process.exit(0);
  } catch (err) {
    console.error('Test Suite Failed:', err);
    if (server) server.close();
    process.exit(1);
  }
};

runTests();
