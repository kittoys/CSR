const fs = require('fs');
const path = require('path');
const pool = require('../src/config/db');

async function loadHistoricalData() {
  try {
    console.log('📂 Loading historical data from data_realistis_csr_2023_2025.sql...');
    
    // Read SQL file from root
    const sqlFile = path.join(__dirname, '../../data_realistis_csr_2023_2025.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    // Split by semicolon and filter empty statements
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`Found ${statements.length} SQL statements`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      try {
        await pool.query(stmt);
        if ((i + 1) % 10 === 0) {
          console.log(`✓ Executed ${i + 1}/${statements.length} statements`);
        }
      } catch (err) {
        if (!err.message.includes('already exists')) {
          console.warn(`⚠️  Statement ${i + 1} warning:`, err.message.substring(0, 100));
        }
      }
    }
    
    console.log('✅ Historical data loaded successfully!');
    
    // Verify count
    const [rows] = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(DISTINCT DATE_FORMAT(COALESCE(proposal_date, created_at), '%Y-%m')) as months,
        MIN(COALESCE(proposal_date, created_at)) as earliest,
        MAX(COALESCE(proposal_date, created_at)) as latest
      FROM donation_proposals
    `);
    
    console.log(`\n📊 Database status:`);
    console.log(`   Total proposals: ${rows[0].total}`);
    console.log(`   Unique months: ${rows[0].months}`);
    console.log(`   Date range: ${rows[0].earliest} to ${rows[0].latest}`);
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error loading data:', err.message);
    process.exit(1);
  }
}

loadHistoricalData();
