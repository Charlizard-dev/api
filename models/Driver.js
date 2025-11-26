// models/Driver.js - MySQL version
const { query } = require('../config/db');

class Driver {
  // Create driver
  static async create(driverData) {
    const {
      driverId, username, email, phone, password,
      vehicleType, vehicleNumber, idProof, status, fcmToken
    } = driverData;

    const sql = `INSERT INTO drivers (
      driverId, username, email, phone, password,
      vehicleType, vehicleNumber, idProof, status, fcmToken
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const result = await query(sql, [
      driverId, username.trim(), email.toLowerCase().trim(), phone.trim(), password,
      vehicleType, vehicleNumber.toUpperCase().trim(), idProof,
      status || 'pending', fcmToken || null
    ]);

    return await this.findById(result.insertId);
  }

  // Find by ID
  static async findById(id) {
    const sql = 'SELECT * FROM drivers WHERE id = ?';
    const results = await query(sql, [id]);
    return results[0] ? this.toObject(results[0]) : null;
  }

  // Find by driverId
  static async findByDriverId(driverId) {
    const sql = 'SELECT * FROM drivers WHERE driverId = ?';
    const results = await query(sql, [driverId]);
    return results[0] ? this.toObject(results[0]) : null;
  }

  // Find by email
  static async findByEmail(email) {
    const sql = 'SELECT * FROM drivers WHERE email = ?';
    const results = await query(sql, [email.toLowerCase().trim()]);
    return results[0] ? this.toObject(results[0]) : null;
  }

  // Find by vehicle number
  static async findByVehicleNumber(vehicleNumber) {
    const sql = 'SELECT * FROM drivers WHERE vehicleNumber = ?';
    const results = await query(sql, [vehicleNumber.toUpperCase().trim()]);
    return results[0] ? this.toObject(results[0]) : null;
  }

  // Find all
  static async find(conditions = {}) {
    let sql = 'SELECT * FROM drivers';
    const params = [];

    if (conditions.status) {
      sql += ' WHERE status = ?';
      params.push(conditions.status);
    }

    sql += ' ORDER BY createdAt DESC';
    const results = await query(sql, params);
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
    if (conditions.vehicleNumber) {
      return await this.findByVehicleNumber(conditions.vehicleNumber);
    }
    if (conditions.id || conditions._id) {
      return await this.findById(conditions.id || conditions._id);
    }
    return null;
  }

  // Update driver
  static async update(id, updateData) {
    const fields = [];
    const values = [];

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = ?`);
        if (key === 'email') {
          values.push(updateData[key].toLowerCase().trim());
        } else if (key === 'vehicleNumber') {
          values.push(updateData[key].toUpperCase().trim());
        } else {
          values.push(updateData[key]);
        }
      }
    });

    if (fields.length === 0) return await this.findById(id);

    values.push(id);
    const sql = `UPDATE drivers SET ${fields.join(', ')} WHERE id = ?`;
    await query(sql, values);
    return await this.findById(id);
  }

  // Save (create or update)
  static async save(driverData) {
    if (driverData.id) {
      const { id, ...updateData } = driverData;
      return await this.update(id, updateData);
    } else {
      return await this.create(driverData);
    }
  }

  // Delete driver
  static async delete(id) {
    const sql = 'DELETE FROM drivers WHERE id = ?';
    await query(sql, [id]);
    return true;
  }

  // Find by status
  static async findByStatus(status) {
    const sql = 'SELECT * FROM drivers WHERE status = ? ORDER BY createdAt DESC';
    const results = await query(sql, [status]);
    return results.map(r => this.toObject(r));
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
      fcmToken: row.fcmToken,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }
}

module.exports = Driver;
