// models/VerificationCode.js - MySQL version
const { query } = require('../config/db');

class VerificationCode {
  // Find by email
  static async findByEmail(email) {
    const sql = 'SELECT * FROM verification_codes WHERE email = ?';
    const results = await query(sql, [email]);
    return results[0] || null;
  }

  // Find one and update (upsert)
  static async findOneAndUpdate(conditions, updateData, options = {}) {
    const existing = await this.findByEmail(conditions.email);
    
    if (existing) {
      // Update existing
      const sql = 'UPDATE verification_codes SET code = ?, expiresAt = ? WHERE email = ?';
      await query(sql, [updateData.code, updateData.expiresAt, conditions.email]);
      return await this.findByEmail(conditions.email);
    } else {
      // Insert new
      if (options.upsert) {
        const sql = 'INSERT INTO verification_codes (email, code, expiresAt) VALUES (?, ?, ?)';
        await query(sql, [conditions.email, updateData.code, updateData.expiresAt]);
        return await this.findByEmail(conditions.email);
      }
      return null;
    }
  }

  // Delete expired codes (cleanup)
  static async deleteExpired() {
    const sql = 'DELETE FROM verification_codes WHERE expiresAt < NOW()';
    await query(sql);
    return true;
  }

  // Delete by email
  static async deleteByEmail(email) {
    const sql = 'DELETE FROM verification_codes WHERE email = ?';
    await query(sql, [email]);
    return true;
  }
}

module.exports = VerificationCode;
