// models/Token.js - MySQL version
const { query } = require('../config/db');

class Token {
  // Create token
  static async create(tokenData) {
    const { userId, token, expiresAt } = tokenData;
    const sql = 'INSERT INTO tokens (userId, token, expiresAt) VALUES (?, ?, ?)';
    const result = await query(sql, [userId, token, expiresAt || null]);
    return await this.findById(result.insertId);
  }

  // Find by ID
  static async findById(id) {
    const sql = 'SELECT * FROM tokens WHERE id = ?';
    const results = await query(sql, [id]);
    return results[0] || null;
  }

  // Find by token string
  static async findByToken(tokenString) {
    const sql = 'SELECT * FROM tokens WHERE token = ?';
    const results = await query(sql, [tokenString]);
    return results[0] || null;
  }

  // Find by user ID
  static async findByUserId(userId) {
    const sql = 'SELECT * FROM tokens WHERE userId = ?';
    return await query(sql, [userId]);
  }

  // Delete token
  static async delete(tokenString) {
    const sql = 'DELETE FROM tokens WHERE token = ?';
    await query(sql, [tokenString]);
    return true;
  }

  // Delete expired tokens
  static async deleteExpired() {
    const sql = 'DELETE FROM tokens WHERE expiresAt IS NOT NULL AND expiresAt < NOW()';
    await query(sql);
    return true;
  }

  // Find one
  static async findOne(conditions) {
    if (conditions.token) {
      return await this.findByToken(conditions.token);
    }
    if (conditions.userId) {
      const tokens = await this.findByUserId(conditions.userId);
      return tokens[0] || null;
    }
    return null;
  }
}

module.exports = Token;
