const mysql = require("mysql2/promise");
require("dotenv").config();

function normalizeEnvValue(value) {
  if (typeof value !== "string") return "";

  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("${") && trimmed.endsWith("}")) return "";
  return trimmed;
}

function readEnvValue(...keys) {
  for (const key of keys) {
    const value = normalizeEnvValue(process.env[key]);
    if (value) {
      return value;
    }
  }
  return "";
}

function readDatabaseUrlConfig() {
  const rawUrl = readEnvValue("DATABASE_URL", "MYSQL_URL");
  if (!rawUrl) return null;

  try {
    const url = new URL(rawUrl);
    return {
      host: normalizeEnvValue(url.hostname),
      port: Number(url.port || 3306),
      user: decodeURIComponent(url.username || ""),
      password: decodeURIComponent(url.password || ""),
      database: normalizeEnvValue(url.pathname.replace(/^\/+/, "")),
    };
  } catch (error) {
    console.warn("⚠️ Unable to parse DATABASE_URL/MYSQL_URL:", error.message);
    return null;
  }
}

const databaseUrlConfig = readDatabaseUrlConfig();

const dbConfig = {
  host:
    databaseUrlConfig?.host || readEnvValue("DB_HOST", "MYSQLHOST", "MYSQL_HOST"),
  port:
    databaseUrlConfig?.port ||
    Number(readEnvValue("DB_PORT", "MYSQLPORT", "MYSQL_PORT") || 3306),
  user: databaseUrlConfig?.user || readEnvValue("DB_USER", "MYSQLUSER", "MYSQL_USER"),
  password:
    databaseUrlConfig?.password ||
    readEnvValue("DB_PASSWORD", "MYSQLPASSWORD", "MYSQL_PASSWORD"),
  database:
    databaseUrlConfig?.database ||
    readEnvValue("DB_NAME", "MYSQLDATABASE", "MYSQL_DB", "MYSQL_DATABASE"),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = mysql.createPool(dbConfig);

async function connectDB() {
  if (!dbConfig.host || !dbConfig.user || !dbConfig.database) {
    console.error("====================================");
    console.error("❌ Missing database environment variables");
    console.error(
      "Set DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME or MYSQLHOST/MYSQLPORT/MYSQLUSER/MYSQLPASSWORD/MYSQLDATABASE",
    );
    console.error("====================================");
    process.exit(1);
  }

  try {
    const connection = await pool.getConnection();

    console.log("====================================");
    console.log("✅ Database Connected Successfully");
    console.log(`Host     : ${dbConfig.host}`);
    console.log(`Port     : ${dbConfig.port}`);
    console.log(`Database : ${dbConfig.database}`);
    console.log(`User     : ${dbConfig.user}`);
    console.log("====================================");

    connection.release();
  } catch (err) {
    console.error("====================================");
    console.error("❌ Database Connection Failed");
    console.error(`Host     : ${dbConfig.host}`);
    console.error(`Port     : ${dbConfig.port}`);
    console.error(`Database : ${dbConfig.database}`);
    console.error(err);
    console.error("====================================");

    process.exit(1);
  }
}

pool.connectDB = connectDB;

module.exports = pool;
