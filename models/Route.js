// models/Route.js - MySQL version
const { query } = require('../config/db');

class Route {
  // Create route
  static async create(routeData) {
    const {
      routeId, startLocation, endLocation, driverId, status
    } = routeData;

    const sql = `INSERT INTO routes (
      routeId, startLocation, endLocation, driverId, status
    ) VALUES (?, ?, ?, ?, ?)`;

    const result = await query(sql, [
      routeId, startLocation || null, endLocation || null,
      driverId || null, status || null
    ]);

    return await this.findById(result.insertId);
  }

  // Find by ID
  static async findById(id) {
    const sql = 'SELECT * FROM routes WHERE id = ?';
    const results = await query(sql, [id]);
    return results[0] ? this.toObject(results[0]) : null;
  }

  // Find by routeId
  static async findByRouteId(routeId) {
    const sql = 'SELECT * FROM routes WHERE routeId = ?';
    const results = await query(sql, [routeId]);
    return results[0] ? this.toObject(results[0]) : null;
  }

  // Find all
  static async find(conditions = {}) {
    let sql = 'SELECT * FROM routes';
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
    if (conditions.routeId) {
      return await this.findByRouteId(conditions.routeId);
    }
    if (conditions.id || conditions._id) {
      return await this.findById(conditions.id || conditions._id);
    }
    return null;
  }

  // Update route
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
    const sql = `UPDATE routes SET ${fields.join(', ')} WHERE id = ?`;
    await query(sql, values);
    return await this.findById(id);
  }

  // Save (create or update)
  static async save(routeData) {
    if (routeData.id) {
      const { id, ...updateData } = routeData;
      return await this.update(id, updateData);
    } else {
      return await this.create(routeData);
    }
  }

  // Delete route
  static async delete(id) {
    const sql = 'DELETE FROM routes WHERE id = ?';
    await query(sql, [id]);
    return true;
  }

  // Convert to object
  static toObject(row) {
    if (!row) return null;
    return {
      _id: row.id,
      id: row.id,
      routeId: row.routeId,
      startLocation: row.startLocation,
      endLocation: row.endLocation,
      driverId: row.driverId,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }
}

module.exports = Route;
