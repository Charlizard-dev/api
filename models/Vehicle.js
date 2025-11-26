// models/Vehicle.js - MySQL version
const { query } = require('../config/db');

class Vehicle {
  // Create vehicle
  static async create(vehicleData) {
    const {
      vehicleId, driverId, vehicleType, vehicleNumber, status
    } = vehicleData;

    const sql = `INSERT INTO vehicles (
      vehicleId, driverId, vehicleType, vehicleNumber, status
    ) VALUES (?, ?, ?, ?, ?)`;

    const result = await query(sql, [
      vehicleId, driverId || null, vehicleType || null,
      vehicleNumber || null, status || null
    ]);

    return await this.findById(result.insertId);
  }

  // Find by ID
  static async findById(id) {
    const sql = 'SELECT * FROM vehicles WHERE id = ?';
    const results = await query(sql, [id]);
    return results[0] ? this.toObject(results[0]) : null;
  }

  // Find by vehicleId
  static async findByVehicleId(vehicleId) {
    const sql = 'SELECT * FROM vehicles WHERE vehicleId = ?';
    const results = await query(sql, [vehicleId]);
    return results[0] ? this.toObject(results[0]) : null;
  }

  // Find by driver
  static async findByDriverId(driverId) {
    const sql = 'SELECT * FROM vehicles WHERE driverId = ?';
    const results = await query(sql, [driverId]);
    return results.map(r => this.toObject(r));
  }

  // Find all
  static async find(conditions = {}) {
    let sql = 'SELECT * FROM vehicles';
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
    if (conditions.vehicleId) {
      return await this.findByVehicleId(conditions.vehicleId);
    }
    if (conditions.id || conditions._id) {
      return await this.findById(conditions.id || conditions._id);
    }
    return null;
  }

  // Update vehicle
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
    const sql = `UPDATE vehicles SET ${fields.join(', ')} WHERE id = ?`;
    await query(sql, values);
    return await this.findById(id);
  }

  // Save (create or update)
  static async save(vehicleData) {
    if (vehicleData.id) {
      const { id, ...updateData } = vehicleData;
      return await this.update(id, updateData);
    } else {
      return await this.create(vehicleData);
    }
  }

  // Delete vehicle
  static async delete(id) {
    const sql = 'DELETE FROM vehicles WHERE id = ?';
    await query(sql, [id]);
    return true;
  }

  // Convert to object
  static toObject(row) {
    if (!row) return null;
    return {
      _id: row.id,
      id: row.id,
      vehicleId: row.vehicleId,
      driverId: row.driverId,
      vehicleType: row.vehicleType,
      vehicleNumber: row.vehicleNumber,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }
}

module.exports = Vehicle;
