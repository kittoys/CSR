const test = require("node:test");
const assert = require("node:assert/strict");
const express = require("express");
const request = require("supertest");

const authMiddleware = require("../middleware/authMiddleware");
const db = require("../config/db");

test("GET /api/proposals returns legacy proposals for petugas", async () => {
  const originalVerifyToken = authMiddleware.verifyToken;
  const originalQuery = db.query;

  authMiddleware.verifyToken = (req, res, next) => {
    req.user = { id: 9, role: "petugas" };
    next();
  };

  db.query = async (query) => {
    if (
      typeof query === "string" &&
      query.startsWith("SELECT * FROM donation_proposals")
    ) {
      return [[
        {
          id: 1,
          created_by: 9,
          proposal_name: "Legacy Proposal",
          status: "In Progress",
        },
      ]];
    }

    return [[]];
  };

  const proposalsRouter = require("./proposals");
  const app = express();
  app.use("/api/proposals", proposalsRouter);

  try {
    const response = await request(app).get("/api/proposals");

    assert.equal(response.status, 200);
    assert.equal(response.body.length, 1);
    assert.equal(response.body[0].proposal_name, "Legacy Proposal");
  } finally {
    authMiddleware.verifyToken = originalVerifyToken;
    db.query = originalQuery;
  }
});
