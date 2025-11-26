// models/tracking.js - MySQL version
const { query } = require('../config/db');

class Tracking {
  // Create tracking
  static async create(trackingData) {
    const {
      routeId, trackingId, start, end, latitude, longitude,
      startLatitude, startLongitude, status
    } = trackingData;

    const sql = `INSERT INTO tracking (
      routeId, trackingId, start, end, latitude, longitude,
      startLatitude, startLongitude, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const result = await query(sql, [
      routeId || null, trackingId || null, start || null, end || null,
      latitude || null, longitude || null, startLatitude || null,
      startLongitude || null, status || null
    ]);

    return await this.findById(result.insertId);
  }

  // Find by ID
  static async findById(id) {
    const sql = 'SELECT * FROM tracking WHERE id = ?';
    const results = await query(sql, [id]);
    return results[0] ? this.toObject(results[0]) : null;
  }

  // Find by routeId
  static async findByRouteId(routeId) {
    const sql = 'SELECT * FROM tracking WHERE routeId = ?';
    const results = await query(sql, [routeId]);
    return results[0] ? this.toObject(results[0]) : null;
  }

  // Find by trackingId
  static async findByTrackingId(trackingId) {
    const sql = 'SELECT * FROM tracking WHERE trackingId = ?';
    const results = await query(sql, [trackingId]);
    return results[0] ? this.toObject(results[0]) : null;
  }

  // Find all
  static async find(conditions = {}) {
    let sql = 'SELECT * FROM tracking';
    const params = [];

    if (conditions.routeId) {
      sql += ' WHERE routeId = ?';
      params.push(conditions.routeId);
    }
    if (conditions.trackingId) {
      sql += params.length ? ' AND trackingId = ?' : ' WHERE trackingId = ?';
      params.push(conditions.trackingId);
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
    if (conditions.trackingId) {
      return await this.findByTrackingId(conditions.trackingId);
    }
    if (conditions.id || conditions._id) {
      return await this.findById(conditions.id || conditions._id);
    }
    return null;
  }

  // Update tracking
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
    const sql = `UPDATE tracking SET ${fields.join(', ')} WHERE id = ?`;
    await query(sql, values);
    return await this.findById(id);
  }

  // Save (create or update)
  static async save(trackingData) {
    if (trackingData.id) {
      const { id, ...updateData } = trackingData;
      return await this.update(id, updateData);
    } else {
      return await this.create(trackingData);
    }
  }

  // Delete tracking
  static async delete(id) {
    const sql = 'DELETE FROM tracking WHERE id = ?';
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
      trackingId: row.trackingId,
      start: row.start,
      end: row.end,
      latitude: row.latitude,
      longitude: row.longitude,
      startLatitude: row.startLatitude,
      startLongitude: row.startLongitude,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }
}

module.exports = Tracking;
