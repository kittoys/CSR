const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const app = require("./index");

test("GET / returns API status message", async () => {
  const response = await request(app).get("/");

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { message: "CSR API is running" });
});
