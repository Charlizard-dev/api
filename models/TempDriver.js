// models/TempDriver.js - MySQL version
const { query } = require('../config/db');

class TempDriver {
  // Create temp driver
  static async create(tempDriverData) {
    const {
      driverId, username, email, phone, password,
      vehicleType, vehicleNumber, idProof, status
    } = tempDriverData;

    const sql = `INSERT INTO temp_drivers (
      driverId, username, email, phone, password,
      vehicleType, vehicleNumber, idProof, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const result = await query(sql, [
      driverId, username.trim(), email.toLowerCase().trim(), phone.trim(), password,
      vehicleType, vehicleNumber.toUpperCase().trim(), idProof,
      status || 'pending'
    ]);

    return await this.findById(result.insertId);
  }

  // Find by ID
  static async findById(id) {
    const sql = 'SELECT * FROM temp_drivers WHERE id = ?';
    const results = await query(sql, [id]);
    return results[0] ? this.toObject(results[0]) : null;
  }

  // Find by driverId
  static async findByDriverId(driverId) {
    const sql = 'SELECT * FROM temp_drivers WHERE driverId = ?';
    const results = await query(sql, [driverId]);
    return results[0] ? this.toObject(results[0]) : null;
  }

  // Find by email
  static async findByEmail(email) {
    const sql = 'SELECT * FROM temp_drivers WHERE email = ?';
    const results = await query(sql, [email.toLowerCase().trim()]);
    return results[0] ? this.toObject(results[0]) : null;
  }

  // Find all
  static async find() {
    const sql = 'SELECT * FROM temp_drivers ORDER BY createdAt DESC';
    const results = await query(sql);
    return results.map(r => this.toObject(r));
  }

  // Find one
  static async findOne(conditions) {
    if (conditions.driverId) {
      return await this.findByDriverId(conditions.driverId);
    }
    if (conditions.email) {
      return await this.findByEmail(conditions.email);
    }
    if (conditions.id || conditions._id) {
      return await this.findById(conditions.id || conditions._id);
    }
    return null;
  }

  // Delete temp driver
  static async delete(id) {
    const sql = 'DELETE FROM temp_drivers WHERE id = ?';
    await query(sql, [id]);
    return true;
  }

  // Delete expired (older than 1 hour)
  static async deleteExpired() {
    const sql = 'DELETE FROM temp_drivers WHERE createdAt < DATE_SUB(NOW(), INTERVAL 1 HOUR)';
    await query(sql);
    return true;
  }

  // Convert to object
  static toObject(row) {
    if (!row) return null;
    return {
      _id: row.id,
      id: row.id,
      driverId: row.driverId,
      username: row.username,
      email: row.email,
      phone: row.phone,
      password: row.password,
      vehicleType: row.vehicleType,
      vehicleNumber: row.vehicleNumber,
      idProof: row.idProof,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }
}

module.exports = TempDriver;
