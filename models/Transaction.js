// models/Transaction.js - MySQL version
const { query } = require('../config/db');

class Transaction {
  // Create transaction
  static async create(transactionData) {
    const {
      txnId, customer, type, orderId, amount, method, date, status
    } = transactionData;

    const sql = `INSERT INTO transactions (
      txnId, customer, type, orderId, amount, method, date, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const result = await query(sql, [
      txnId, customer || null, type, orderId || null,
      amount || null, method || null, date || new Date(),
      status || 'Pending'
    ]);

    return await this.findById(result.insertId);
  }

  // Find by ID
  static async findById(id) {
    const sql = 'SELECT * FROM transactions WHERE id = ?';
    const results = await query(sql, [id]);
    return results[0] ? this.toObject(results[0]) : null;
  }

  // Find by txnId
  static async findByTxnId(txnId) {
    const sql = 'SELECT * FROM transactions WHERE txnId = ?';
    const results = await query(sql, [txnId]);
    return results[0] ? this.toObject(results[0]) : null;
  }

  // Find all
  static async find(conditions = {}) {
    let sql = 'SELECT * FROM transactions';
    const params = [];

    if (conditions.customer) {
      sql += ' WHERE customer = ?';
      params.push(conditions.customer);
    }
    if (conditions.status) {
      sql += params.length ? ' AND status = ?' : ' WHERE status = ?';
      params.push(conditions.status);
    }
    if (conditions.type) {
      sql += params.length ? ' AND type = ?' : ' WHERE type = ?';
      params.push(conditions.type);
    }

    sql += ' ORDER BY date DESC';
    const results = await query(sql, params);
    return results.map(r => this.toObject(r));
  }

  // Find one
  static async findOne(conditions) {
    if (conditions.txnId) {
      return await this.findByTxnId(conditions.txnId);
    }
    if (conditions.id || conditions._id) {
      return await this.findById(conditions.id || conditions._id);
    }
    return null;
  }

  // Update transaction
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
    const sql = `UPDATE transactions SET ${fields.join(', ')} WHERE id = ?`;
    await query(sql, values);
    return await this.findById(id);
  }

  // Save (create or update)
  static async save(transactionData) {
    if (transactionData.id) {
      const { id, ...updateData } = transactionData;
      return await this.update(id, updateData);
    } else {
      return await this.create(transactionData);
    }
  }

  // Delete transaction
  static async delete(id) {
    const sql = 'DELETE FROM transactions WHERE id = ?';
    await query(sql, [id]);
    return true;
  }

  // Convert to object
  static toObject(row) {
    if (!row) return null;
    return {
      _id: row.id,
      id: row.id,
      txnId: row.txnId,
      customer: row.customer,
      type: row.type,
      orderId: row.orderId,
      amount: row.amount,
      method: row.method,
      date: row.date,
      status: row.status
    };
  }
}

module.exports = Transaction;
