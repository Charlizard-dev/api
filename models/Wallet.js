// models/Wallet.js - MySQL version
const { query } = require('../config/db');

class Wallet {
  // Create wallet
  static async create(walletData) {
    const { userId, balance = 0 } = walletData;

    const sql = 'INSERT INTO wallets (userId, balance) VALUES (?, ?)';
    const result = await query(sql, [userId, balance]);

    return await this.findById(result.insertId);
  }

  // Find by ID
  static async findById(id) {
    const sql = 'SELECT * FROM wallets WHERE id = ?';
    const results = await query(sql, [id]);
    return results[0] ? await this.toObject(results[0]) : null;
  }

  // Find by userId
  static async findByUserId(userId) {
    const sql = 'SELECT * FROM wallets WHERE userId = ?';
    const results = await query(sql, [userId]);
    return results[0] ? await this.toObject(results[0]) : null;
  }

  // Find or create wallet for user
  static async findOrCreate(userId) {
    let wallet = await this.findByUserId(userId);
    if (!wallet) {
      wallet = await this.create({ userId, balance: 0 });
    }
    return wallet;
  }

  // Find all
  static async find(conditions = {}) {
    let sql = 'SELECT * FROM wallets';
    const params = [];

    if (conditions.userId) {
      sql += ' WHERE userId = ?';
      params.push(conditions.userId);
    }

    sql += ' ORDER BY createdAt DESC';
    const results = await query(sql, params);
    return await Promise.all(results.map(r => this.toObject(r)));
  }

  // Find one
  static async findOne(conditions) {
    if (conditions.userId) {
      return await this.findByUserId(conditions.userId);
    }
    if (conditions.id || conditions._id) {
      return await this.findById(conditions.id || conditions._id);
    }
    return null;
  }

  // Update wallet
  static async update(id, updateData) {
    const fields = [];
    const values = [];

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(updateData[key]);
      }
    });

    if (fields.length === 0) return await this.findById(id);

    values.push(id);
    const sql = `UPDATE wallets SET ${fields.join(', ')} WHERE id = ?`;
    await query(sql, values);
    return await this.findById(id);
  }

  // Add transaction to wallet
  static async addTransaction(walletId, transactionData) {
    const { type, amount, description } = transactionData;
    const sql = `INSERT INTO wallet_transactions (walletId, type, amount, description)
                 VALUES (?, ?, ?, ?)`;
    await query(sql, [walletId, type, amount, description || null]);

    // Update wallet balance
    const wallet = await this.findById(walletId);
    const newBalance = type === 'credit'
      ? parseFloat(wallet.balance) + parseFloat(amount)
      : parseFloat(wallet.balance) - parseFloat(amount);
    
    await this.update(walletId, { balance: newBalance });
    return await this.findById(walletId);
  }

  // Get wallet transactions
  static async getTransactions(walletId) {
    const sql = 'SELECT * FROM wallet_transactions WHERE walletId = ? ORDER BY date DESC';
    return await query(sql, [walletId]);
  }

  // Save (create or update)
  static async save(walletData) {
    if (walletData.id) {
      const { id, ...updateData } = walletData;
      return await this.update(id, updateData);
    } else {
      return await this.create(walletData);
    }
  }

  // Delete wallet
  static async delete(id) {
    const sql = 'DELETE FROM wallets WHERE id = ?';
    await query(sql, [id]);
    return true;
  }

  // Convert to object with transactions
  static async toObject(row) {
    if (!row) return null;
    const transactions = await this.getTransactions(row.id);
    return {
      _id: row.id,
      id: row.id,
      userId: row.userId,
      balance: parseFloat(row.balance),
      transactions: transactions.map(t => ({
        type: t.type,
        amount: parseFloat(t.amount),
        description: t.description,
        date: t.date
      })),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }
}

module.exports = Wallet;
