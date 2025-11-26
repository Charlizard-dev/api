// models/WarehouseStaff.js - MySQL version
const { query } = require('../config/db');

class WarehouseStaff {
  // Create warehouse staff
  static async create(warehouseStaffData) {
    const {
      warehouseStaffId, warehouseId, staffId, role
    } = warehouseStaffData;

    const sql = `INSERT INTO warehouse_staff (
      warehouseStaffId, warehouseId, staffId, role
    ) VALUES (?, ?, ?, ?)`;

    const result = await query(sql, [
      warehouseStaffId, warehouseId, staffId, role || null
    ]);

    return await this.findById(result.insertId);
  }

  // Find by ID
  static async findById(id) {
    const sql = 'SELECT * FROM warehouse_staff WHERE id = ?';
    const results = await query(sql, [id]);
    return results[0] ? this.toObject(results[0]) : null;
  }

  // Find by warehouseStaffId
  static async findByWarehouseStaffId(warehouseStaffId) {
    const sql = 'SELECT * FROM warehouse_staff WHERE warehouseStaffId = ?';
    const results = await query(sql, [warehouseStaffId]);
    return results[0] ? this.toObject(results[0]) : null;
  }

  // Find by warehouseId
  static async findByWarehouseId(warehouseId) {
    const sql = 'SELECT * FROM warehouse_staff WHERE warehouseId = ?';
    const results = await query(sql, [warehouseId]);
    return results.map(r => this.toObject(r));
  }

  // Find by staffId
  static async findByStaffId(staffId) {
    const sql = 'SELECT * FROM warehouse_staff WHERE staffId = ?';
    const results = await query(sql, [staffId]);
    return results.map(r => this.toObject(r));
  }

  // Find all
  static async find(conditions = {}) {
    let sql = 'SELECT * FROM warehouse_staff';
    const params = [];

    if (conditions.warehouseId) {
      sql += ' WHERE warehouseId = ?';
      params.push(conditions.warehouseId);
    }
    if (conditions.staffId) {
      sql += params.length ? ' AND staffId = ?' : ' WHERE staffId = ?';
      params.push(conditions.staffId);
    }

    sql += ' ORDER BY createdAt DESC';
    const results = await query(sql, params);
    return results.map(r => this.toObject(r));
  }

  // Find one
  static async findOne(conditions) {
    if (conditions.warehouseStaffId) {
      return await this.findByWarehouseStaffId(conditions.warehouseStaffId);
    }
    if (conditions.id || conditions._id) {
      return await this.findById(conditions.id || conditions._id);
    }
    return null;
  }

  // Update warehouse staff
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
    const sql = `UPDATE warehouse_staff SET ${fields.join(', ')} WHERE id = ?`;
    await query(sql, values);
    return await this.findById(id);
  }

  // Save (create or update)
  static async save(warehouseStaffData) {
    if (warehouseStaffData.id) {
      const { id, ...updateData } = warehouseStaffData;
      return await this.update(id, updateData);
    } else {
      return await this.create(warehouseStaffData);
    }
  }

  // Delete warehouse staff
  static async delete(id) {
    const sql = 'DELETE FROM warehouse_staff WHERE id = ?';
    await query(sql, [id]);
    return true;
  }

  // Convert to object
  static toObject(row) {
    if (!row) return null;
    return {
      _id: row.id,
      id: row.id,
      warehouseStaffId: row.warehouseStaffId,
      warehouseId: row.warehouseId,
      staffId: row.staffId,
      role: row.role,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }
}

module.exports = WarehouseStaff;
