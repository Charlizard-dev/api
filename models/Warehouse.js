// models/Warehouse.js - MySQL version
const { query } = require('../config/db');

class Warehouse {
  // Create warehouse
  static async create(warehouseData) {
    const {
      warehouseId, name, capacity, spaceUsed, location,
      latitude, longitude, status
    } = warehouseData;

    const sql = `INSERT INTO warehouses (
      warehouseId, name, capacity, spaceUsed, location,
      latitude, longitude, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const result = await query(sql, [
      warehouseId || null, name, capacity, spaceUsed, location,
      latitude || null, longitude || null, status || 'Active'
    ]);

    return await this.findById(result.insertId);
  }

  // Find by ID
  static async findById(id) {
    const sql = 'SELECT * FROM warehouses WHERE id = ?';
    const results = await query(sql, [id]);
    return results[0] ? this.toObject(results[0]) : null;
  }

  // Find by warehouseId
  static async findByWarehouseId(warehouseId) {
    const sql = 'SELECT * FROM warehouses WHERE warehouseId = ?';
    const results = await query(sql, [warehouseId]);
    return results[0] ? this.toObject(results[0]) : null;
  }

  // Find by name
  static async findByName(name) {
    const sql = 'SELECT * FROM warehouses WHERE name = ?';
    const results = await query(sql, [name]);
    return results[0] ? this.toObject(results[0]) : null;
  }

  // Find all
  static async find(conditions = {}) {
    let sql = 'SELECT * FROM warehouses';
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
    if (conditions.name) {
      return await this.findByName(conditions.name);
    }
    if (conditions.warehouseId || conditions.id) {
      return await this.findByWarehouseId(conditions.warehouseId || conditions.id);
    }
    if (conditions.id || conditions._id) {
      return await this.findById(conditions.id || conditions._id);
    }
    return null;
  }

  // Update warehouse
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
    const sql = `UPDATE warehouses SET ${fields.join(', ')} WHERE id = ?`;
    await query(sql, values);
    return await this.findById(id);
  }

  // Save (create or update)
  static async save(warehouseData) {
    if (warehouseData.id) {
      const { id, ...updateData } = warehouseData;
      return await this.update(id, updateData);
    } else {
      return await this.create(warehouseData);
    }
  }

  // Delete warehouse
  static async delete(id) {
    const sql = 'DELETE FROM warehouses WHERE id = ?';
    await query(sql, [id]);
    return true;
  }

  // Convert to object
  static toObject(row) {
    if (!row) return null;
    return {
      _id: row.id,
      id: row.id,
      warehouseId: row.warehouseId,
      name: row.name,
      capacity: row.capacity,
      spaceUsed: row.spaceUsed,
      location: row.location,
      latitude: row.latitude,
      longitude: row.longitude,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }
}

module.exports = Warehouse;
