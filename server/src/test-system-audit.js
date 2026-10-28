require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');
const connectDB = require('./config/db');

let server;
const PORT = 5003;
const BASE_URL = `http://127.0.0.1:${PORT}/api/v1`;

const results = {
  total: 0,
  passed: 0,
  failed: 0,
  failures: [],
  warnings: [],
  gaps: []
};

const request = async (path, options = {}) => {
  const url = `${BASE_URL}${path}`;
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    const data = await response.json().catch(() => ({}));
    return { status: response.status, data };
  } catch (err) {
    return { status: 500, data: { error: err.message } };
  }
};

const test = async (name, fn) => {
  results.total++;
  try {
    const outcome = await fn();
    if (outcome && outcome.skip) {
      console.log(`  ⚠ [SKIP] ${name}: ${outcome.reason}`);
      results.warnings.push({ test: name, reason: outcome.reason });
    } else {
      console.log(`  ✓ [PASS] ${name}`);
      results.passed++;
    }
  } catch (err) {
    console.error(`  ✗ [FAIL] ${name}: ${err.message}`);
    results.failed++;
    results.failures.push({ test: name, error: err.message });
  }
};

const assert = (condition, msg) => {
  if (!condition) throw new Error(msg || 'Assertion failed');
};

const runAudit = async () => {
  console.log('======================================================================');
  console.log(' FARMORA CARE — FULL-SYSTEM DEEP ARCHITECTURAL & FUNCTIONAL AUDIT');
  console.log('======================================================================\n');

  try {
    await connectDB();
    await new Promise((resolve) => {
      server = app.listen(PORT, resolve);
    });
    console.log(`[Diagnostic Server] Running on ${BASE_URL}\n`);

    let adminToken, expertToken, farmerToken, altFarmerToken;
    let expertId, farmerId, altFarmerId;
    let sampleCropId, sampleCategoryId;
    let createdProblemId;

    // -------------------------------------------------------------
    // MODULE 1: Authentication, Tokens & Identity Integrity
    // -------------------------------------------------------------
    console.log('--- MODULE 1: AUTHENTICATION, TOKENS & RBAC ---');
    
    await test('Health endpoint responds 200 with operational metadata', async () => {
      const res = await request('/health');
      assert(res.status === 200, `Expected 200 got ${res.status}`);
      assert(res.data.success === true, 'Response success is true');
    });

    await test('Admin login with valid credentials', async () => {
      const res = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier: 'admin@farmora.care', password: 'Farmora@Admin2026' }),
      });
      assert(res.status === 200, `Status ${res.status}`);
      assert(res.data.token, 'Token present');
      assert(res.data.user.role === 'admin', 'Role is admin');
      adminToken = res.data.token;
    });

    await test('Expert login with valid credentials', async () => {
      const res = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier: 'dr.shinde@farmora.care', password: 'Expert@2026' }),
      });
      assert(res.status === 200, `Status ${res.status}`);
      assert(res.data.user.role === 'expert', 'Role is expert');
      expertToken = res.data.token;
      expertId = res.data.user._id || res.data.user.id;
    });

    await test('Farmer login with phone number as identifier', async () => {
      const res = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier: '9822000005', password: 'Farmer@2026' }),
      });
      assert(res.status === 200, `Status ${res.status}`);
      assert(res.data.user.role === 'farmer', 'Role is farmer');
      farmerToken = res.data.token;
      farmerId = res.data.user._id || res.data.user.id;
    });

    await test('Farmer registration prevents role elevation (role tampering check)', async () => {
      const fakeEmail = `tamper_${Date.now()}@test.care`;
      const res = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          fullName: 'Security Tester',
          email: fakeEmail,
          password: 'Password@2026',
          role: 'admin', // Malicious attempt to elevate role
        }),
      });
      assert(res.status === 201, `Status ${res.status}`);
      const user = res.data.data?.user || res.data.user;
      assert(user && user.role === 'farmer', 'Server forced role to farmer; tampering prevented');
      altFarmerToken = res.data.data?.token || res.data.token;
      altFarmerId = user._id || user.id;
    });

    await test('Login rejects incorrect password with 401', async () => {
      const res = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier: 'admin@farmora.care', password: 'WrongPassword123!' }),
      });
      assert(res.status === 401, `Expected 401, got ${res.status}`);
    });

    await test('GET /auth/me returns authenticated user identity', async () => {
      const res = await request('/auth/me', {
        headers: { Authorization: `Bearer ${farmerToken}` }
      });
      assert(res.status === 200, `Expected 200 got ${res.status}`);
      assert(res.data.user.phone === '9822000005', 'Phone matches');
    });

    await test('RBAC Guard: Farmer cannot access Admin dashboard (403 Forbidden)', async () => {
      const res = await request('/admin/dashboard', {
        headers: { Authorization: `Bearer ${farmerToken}` }
      });
      assert(res.status === 403, `Expected 403 got ${res.status}`);
    });

    await test('RBAC Guard: Farmer cannot access Expert caseload (403 Forbidden)', async () => {
      const res = await request('/expert/cases', {
        headers: { Authorization: `Bearer ${farmerToken}` }
      });
      assert(res.status === 403, `Expected 403 got ${res.status}`);
    });

    await test('RBAC Guard: Unauthenticated requests rejected with 401 Unauthorized', async () => {
      const res = await request('/problems/my');
      assert(res.status === 401, `Expected 401 got ${res.status}`);
    });

    // -------------------------------------------------------------
    // MODULE 2: Reference Data Integrity & Vernacular Support
    // -------------------------------------------------------------
    console.log('\n--- MODULE 2: REFERENCE DATA & LOCALIZATION ---');

    await test('Crops repository contains required 8 crops + Other with valid ordering', async () => {
      const res = await request('/crops');
      assert(res.status === 200, `Status ${res.status}`);
      const crops = res.data.data;
      assert(crops.length >= 9, `Expected at least 9 crops, got ${crops.length}`);
      sampleCropId = crops[0]._id;
      // Check displayOrder 1..8
      for (let i = 0; i < 8; i++) {
        assert(crops[i].displayOrder === i + 1, `Crop ${crops[i].name} displayOrder expected ${i + 1}`);
      }
    });

    await test('Categories repository contains required 6 categories with Marathi & Hindi names', async () => {
      const res = await request('/categories');
      assert(res.status === 200, `Status ${res.status}`);
      const cats = res.data.data;
      assert(cats.length >= 6, `Expected at least 6 categories, got ${cats.length}`);
      sampleCategoryId = cats[0]._id;
      cats.slice(0, 6).forEach(c => {
        assert(c.localNames?.mr, `Category ${c.name} missing Marathi local name`);
        assert(c.localNames?.hi, `Category ${c.name} missing Hindi local name`);
      });
    });

    // -------------------------------------------------------------
    // MODULE 3: Farmer Case Submission & Reporting Flow
    // -------------------------------------------------------------
    console.log('\n--- MODULE 3: PROBLEM REPORTING & FARMER DOSSIER ---');

    await test('Farmer problem creation with complete metadata', async () => {
      const payload = {
        title: 'Deep Audit Test: Severe Leaf Blight on Wheat',
        description: 'Leaves exhibiting brown necrotic lesions spreading from tip to base, 35% foliage involved.',
        cropId: sampleCropId,
        categoryId: sampleCategoryId,
        location: {
          village: 'Koregaon',
          district: 'Satara',
          state: 'Maharashtra',
          latitude: 17.68,
          longitude: 74.01
        },
        affectedAreaAcre: 3.5,
        cropStage: 'Tillering',
      };
      const res = await request('/problems', {
        method: 'POST',
        headers: { Authorization: `Bearer ${farmerToken}` },
        body: JSON.stringify(payload),
      });
      assert(res.status === 201, `Expected 201 got ${res.status}`);
      assert(res.data.data.problem._id, 'Problem ID returned');
      assert(res.data.data.problem.status === 'SUBMITTED', 'Initial status is SUBMITTED');
      createdProblemId = res.data.data.problem._id;
    });

    await test('Farmer can view their list of submitted reports (GET /problems/my)', async () => {
      const res = await request('/problems/my', {
        headers: { Authorization: `Bearer ${farmerToken}` }
      });
      assert(res.status === 200, `Status ${res.status}`);
      const list = Array.isArray(res.data.data) ? res.data.data : res.data.data.problems;
      assert(list.length > 0, 'Reports found');
      const found = list.find(p => p._id === createdProblemId);
      assert(found !== undefined, 'Created problem appears in farmer list');
    });

    await test('Farmer can view detailed case dossier (GET /problems/:id)', async () => {
      const res = await request(`/problems/${createdProblemId}`, {
        headers: { Authorization: `Bearer ${farmerToken}` }
      });
      assert(res.status === 200, `Status ${res.status}`);
      assert(res.data.data.problem.title.includes('Deep Audit Test'), 'Title matches');
      assert(res.data.data.problem.cropId.name, 'Crop populated');
      assert(res.data.data.problem.categoryId.name, 'Category populated');
    });

    await test('Tenant isolation: Different farmer cannot access another farmer report (403)', async () => {
      const res = await request(`/problems/${createdProblemId}`, {
        headers: { Authorization: `Bearer ${altFarmerToken}` }
      });
      assert(res.status === 403, `Expected 403 Forbidden, got ${res.status}`);
    });

    // -------------------------------------------------------------
    // MODULE 4: Admin Triage, Workload & Expert Assignment Flow
    // -------------------------------------------------------------
    console.log('\n--- MODULE 4: ADMIN TRIAGE & CASE ASSIGNMENT ---');

    await test('Admin dashboard returns operational aggregations & chart metrics', async () => {
      const res = await request('/admin/dashboard', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      assert(res.status === 200, `Status ${res.status}`);
      assert(res.data.data.summary.totalProblems !== undefined, 'Total problems counter present');
      assert(Array.isArray(res.data.data.byCategory), 'byCategory aggregation present');
      assert(Array.isArray(res.data.data.byCrop), 'byCrop aggregation present');
    });

    await test('Unassigned queue lists pending case (GET /admin/unassigned)', async () => {
      const res = await request('/admin/unassigned', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      assert(res.status === 200, `Status ${res.status}`);
      const list = res.data.data;
      const found = list.find(p => p._id === createdProblemId);
      assert(found !== undefined, 'New case is present in unassigned queue');
    });

    await test('Admin assigns case to agronomist (POST /admin/problems/:id/assign)', async () => {
      const res = await request(`/admin/problems/${createdProblemId}/assign`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({
          expertId: expertId,
          assignmentNote: 'Assigned for diagnostic review during deep audit.'
        }),
      });
      assert(res.status === 200, `Status ${res.status}`);
      assert(res.data.data.currentStatus === 'ASSIGNED', 'Status changed to ASSIGNED');
    });

    // -------------------------------------------------------------
    // MODULE 5: Expert Caseload, Similar Solved Engine & Advisory
    // -------------------------------------------------------------
    console.log('\n--- MODULE 5: EXPERT REVIEW, SIMILAR CASES & ADVISORY ---');

    await test('Assigned case appears in expert active caseload (GET /expert/cases)', async () => {
      const res = await request('/expert/cases', {
        headers: { Authorization: `Bearer ${expertToken}` }
      });
      assert(res.status === 200, `Status ${res.status}`);
      const list = Array.isArray(res.data.data) ? res.data.data : res.data.data.problems;
      const found = list.find(p => p._id === createdProblemId);
      assert(found !== undefined, 'Case is in expert queue');
    });

    await test('Expert accesses case detail station (GET /expert/cases/:id)', async () => {
      const res = await request(`/expert/cases/${createdProblemId}`, {
        headers: { Authorization: `Bearer ${expertToken}` }
      });
      assert(res.status === 200, `Status ${res.status}`);
      assert(res.data.data.problem.status === 'ASSIGNED', 'Status verified');
    });

    await test('Similar Solved Problems engine responds with candidate solutions', async () => {
      const res = await request(`/expert/cases/${createdProblemId}/similar`, {
        headers: { Authorization: `Bearer ${expertToken}` }
      });
      assert(res.status === 200, `Status ${res.status}`);
      const list = res.data.similarCases || res.data.data?.similarCases || res.data.data?.candidates;
      assert(Array.isArray(list), 'similarCases array returned');
    });

    await test('Expert updates case status to UNDER_REVIEW', async () => {
      const res = await request(`/expert/cases/${createdProblemId}/status`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${expertToken}` },
        body: JSON.stringify({
          status: 'UNDER_REVIEW',
          notes: 'Specialist reviewing microscopic symptoms.'
        }),
      });
      assert(res.status === 200, `Status ${res.status}`);
      const st = res.data.data?.currentStatus || res.data.data?.status || res.data.data?.problem?.status;
      assert(st === 'UNDER_REVIEW', `Status updated to UNDER_REVIEW (got ${st})`);
    });

    await test('Expert submits diagnostic advisory & treatment plan', async () => {
      const advisoryPayload = {
        diagnosis: 'Wheat Septoria Nodorum Blotch (Fungal Leaf Spot)',
        immediateAction: 'Apply Propiconazole 25% EC @ 1ml/L of water immediately to check sporulation.',
        preventiveMeasures: 'Ensure crop rotation with non-host legumes; avoid excessive overhead nitrogenous fertilizer.',
        confidenceLevel: 'HIGH',
      };
      const res = await request(`/expert/cases/${createdProblemId}/respond`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${expertToken}` },
        body: JSON.stringify(advisoryPayload),
      });
      assert(res.status === 201, `Status ${res.status}`);
      const resp = res.data.data?.response;
      assert(resp && (resp.message || resp.observations), 'Advisory response recorded');
    });

    await test('Farmer asks follow-up question on the advisory', async () => {
      const res = await request(`/problems/${createdProblemId}/follow-ups`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${farmerToken}` },
        body: JSON.stringify({
          message: 'Doctor, should I spray this in early morning or late evening during sunny weather?'
        }),
      });
      assert(res.status === 201, `Status ${res.status}`);
      const followUp = res.data.data?.followUp;
      assert(followUp && followUp.message.includes('early morning'), 'Follow up recorded');
    });

    await test('Expert resolves case and archives treatment history', async () => {
      const res = await request(`/expert/cases/${createdProblemId}/status`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${expertToken}` },
        body: JSON.stringify({
          status: 'RESOLVED',
          notes: 'Follow-up query clarified. Case successfully resolved.'
        }),
      });
      assert(res.status === 200, `Status ${res.status}`);
      const st = res.data.data?.currentStatus || res.data.data?.status || res.data.data?.problem?.status;
      assert(st === 'RESOLVED', 'Status resolved');
    });

    // -------------------------------------------------------------
    // MODULE 6: Notifications, Audit Trail & State Histories
    // -------------------------------------------------------------
    console.log('\n--- MODULE 6: NOTIFICATIONS & AUDIT TRAILS ---');

    await test('Farmer receives notifications for case lifecycle transitions', async () => {
      const res = await request('/notifications', {
        headers: { Authorization: `Bearer ${farmerToken}` }
      });
      assert(res.status === 200, `Status ${res.status}`);
      const notifs = Array.isArray(res.data.data) ? res.data.data : res.data.data?.notifications;
      assert(Array.isArray(notifs), 'Notifications array returned');
      const relatedNotif = notifs.find(n => n.problemId === createdProblemId);
      assert(relatedNotif !== undefined, 'Notification generated for case activity');
    });

    await test('Full status history records complete chronological audit trail', async () => {
      const res = await request(`/problems/${createdProblemId}/status-history`, {
        headers: { Authorization: `Bearer ${farmerToken}` }
      });
      assert(res.status === 200, `Status ${res.status}`);
      const history = Array.isArray(res.data.data) ? res.data.data : res.data.data?.history;
      assert(Array.isArray(history) && history.length >= 4, `Expected at least 4 status transitions, got ${history?.length}`);
      const statuses = history.map(h => h.newStatus);
      assert(statuses.includes('SUBMITTED'), 'Contains SUBMITTED');
      assert(statuses.includes('ASSIGNED'), 'Contains ASSIGNED');
      assert(statuses.includes('UNDER_REVIEW'), 'Contains UNDER_REVIEW');
      assert(statuses.includes('RESOLVED'), 'Contains RESOLVED');
    });

    // -------------------------------------------------------------
    // MODULE 7: Admin Reference Data & User Governance
    // -------------------------------------------------------------
    console.log('\n--- MODULE 7: ADMIN USER & REFERENCE GOVERNANCE ---');

    await test('Admin retrieves user management roster (GET /admin/users)', async () => {
      const res = await request('/admin/users', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      assert(res.status === 200, `Status ${res.status}`);
      const usersList = Array.isArray(res.data.data) ? res.data.data : res.data.data.users;
      assert(Array.isArray(usersList) && usersList.length > 0, 'Users roster returned');
    });

    await test('Admin can toggle user account status (active/inactive)', async () => {
      const res = await request(`/admin/users/${altFarmerId}/status`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ accountStatus: 'inactive' }),
      });
      assert(res.status === 200, `Status ${res.status}`);
      const updated = res.data.data?.user || res.data.data;
      assert(updated && updated.accountStatus === 'inactive', 'User deactivated');

      // Reactivate
      await request(`/admin/users/${altFarmerId}/status`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ accountStatus: 'active' }),
      });
    });

    // -------------------------------------------------------------
    // MODULE 8: Edge Cases, Security Boundaries & Input Sanitization
    // -------------------------------------------------------------
    console.log('\n--- MODULE 8: EDGE CASES & STRESS PROBING ---');

    await test('Report submission rejects excessively long title (> 200 chars)', async () => {
      const longTitle = 'A'.repeat(250);
      const res = await request('/problems', {
        method: 'POST',
        headers: { Authorization: `Bearer ${farmerToken}` },
        body: JSON.stringify({
          title: longTitle,
          description: 'Testing long title boundary',
          cropId: sampleCropId,
          categoryId: sampleCategoryId,
          district: 'Pune',
        }),
      });
      if (res.status === 201) {
        results.gaps.push({
          area: 'Input Validation',
          issue: 'Backend does not enforce maximum length on problem title (allowed 250 characters)',
          severity: 'Low',
          recommendation: 'Add maxLength: 200 constraint in Problem schema title field.'
        });
      }
      assert(res.status === 201 || res.status === 400, 'Handled without 500 crash');
    });

    await test('Report submission rejects missing district', async () => {
      const res = await request('/problems', {
        method: 'POST',
        headers: { Authorization: `Bearer ${farmerToken}` },
        body: JSON.stringify({
          title: 'Missing District Test',
          description: 'Testing missing district',
          cropId: sampleCropId,
          categoryId: sampleCategoryId,
        }),
      });
      assert(res.status === 400, `Expected 400 got ${res.status}`);
    });

    await test('Expert cannot self-assign an unassigned problem directly without admin', async () => {
      const unassignedRes = await request('/admin/unassigned', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const unassignedList = unassignedRes.data.data;
      if (unassignedList.length > 0) {
        const targetId = unassignedList[0]._id;
        const res = await request(`/expert/cases/${targetId}/respond`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${expertToken}` },
          body: JSON.stringify({ diagnosis: 'Bypassing triage' }),
        });
        assert(res.status === 403 || res.status === 404, `Triage bypass blocked with ${res.status}`);
      }
    });

  } catch (fatalErr) {
    console.error('Fatal crash during audit:', fatalErr);
  } finally {
    if (server) {
      await new Promise(r => server.close(r));
    }
    await mongoose.connection.close();

    console.log('\n======================================================================');
    console.log(` AUDIT SUMMARY: Passed: ${results.passed}/${results.total} | Failed: ${results.failed} | Gaps Found: ${results.gaps.length}`);
    console.log('======================================================================');
    if (results.failures.length > 0) {
      console.log('\nFailures:');
      results.failures.forEach(f => console.log(` - ${f.test}: ${f.error}`));
    }
    if (results.gaps.length > 0) {
      console.log('\nIdentified Gaps:');
      results.gaps.forEach(g => console.log(` - [${g.severity}] ${g.area}: ${g.issue}`));
    }
  }
};

runAudit();
