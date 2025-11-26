// models/Delivery.js - MySQL version
const { query } = require('../config/db');

class Delivery {
  // Create delivery
  static async create(deliveryData) {
    const {
      deliveryId, orderId, driverId, status
    } = deliveryData;

    const sql = `INSERT INTO deliveries (
      deliveryId, orderId, driverId, status
    ) VALUES (?, ?, ?, ?)`;

    const result = await query(sql, [
      deliveryId, orderId || null, driverId || null, status || null
    ]);

    return await this.findById(result.insertId);
  }

  // Find by ID
  static async findById(id) {
    const sql = 'SELECT * FROM deliveries WHERE id = ?';
    const results = await query(sql, [id]);
    return results[0] ? this.toObject(results[0]) : null;
  }

  // Find by deliveryId
  static async findByDeliveryId(deliveryId) {
    const sql = 'SELECT * FROM deliveries WHERE deliveryId = ?';
    const results = await query(sql, [deliveryId]);
    return results[0] ? this.toObject(results[0]) : null;
  }

  // Find all
  static async find(conditions = {}) {
    let sql = 'SELECT * FROM deliveries';
    const params = [];

    if (conditions.driverId) {
      sql += ' WHERE driverId = ?';
      params.push(conditions.driverId);
    }
    if (conditions.status) {
      sql += params.length ? ' AND status = ?' : ' WHERE status = ?';
      params.push(conditions.status);
    }

    sql += ' ORDER BY createdAt DESC';
    const results = await query(sql, params);
    return results.map(r => this.toObject(r));
  }

  // Find one
  static async findOne(conditions) {
    if (conditions.deliveryId) {
      return await this.findByDeliveryId(conditions.deliveryId);
    }
    if (conditions.id || conditions._id) {
      return await this.findById(conditions.id || conditions._id);
    }
    return null;
  }

  // Update delivery
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
    const sql = `UPDATE deliveries SET ${fields.join(', ')} WHERE id = ?`;
    await query(sql, values);
    return await this.findById(id);
  }

  // Save (create or update)
  static async save(deliveryData) {
    if (deliveryData.id) {
      const { id, ...updateData } = deliveryData;
      return await this.update(id, updateData);
    } else {
      return await this.create(deliveryData);
    }
  }

  // Delete delivery
  static async delete(id) {
    const sql = 'DELETE FROM deliveries WHERE id = ?';
    await query(sql, [id]);
    return true;
  }

  // Convert to object
  static toObject(row) {
    if (!row) return null;
    return {
      _id: row.id,
      id: row.id,
      deliveryId: row.deliveryId,
      orderId: row.orderId,
      driverId: row.driverId,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }
}

module.exports = Delivery;
