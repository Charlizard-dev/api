// models/Staff.js - MySQL version
const { query } = require('../config/db');

class Staff {
  // Create staff
  static async create(staffData) {
    const {
      staffId, profilePicture, fullName, contactInfo,
      role, shift, email, baseLocation, attendance
    } = staffData;

    const sql = `INSERT INTO staff (
      staffId, profilePicture, fullName, contactInfo,
      role, shift, email, baseLocation, attendance
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const result = await query(sql, [
      staffId, profilePicture || null, fullName, contactInfo,
      role, shift || null, email, baseLocation, attendance || 'Present'
    ]);

    return await this.findById(result.insertId);
  }

  // Find by ID
  static async findById(id) {
    const sql = 'SELECT * FROM staff WHERE id = ?';
    const results = await query(sql, [id]);
    return results[0] ? this.toObject(results[0]) : null;
  }

  // Find by staffId
  static async findByStaffId(staffId) {
    const sql = 'SELECT * FROM staff WHERE staffId = ?';
    const results = await query(sql, [staffId]);
    return results[0] ? this.toObject(results[0]) : null;
  }

  // Find by email
  static async findByEmail(email) {
    const sql = 'SELECT * FROM staff WHERE email = ?';
    const results = await query(sql, [email]);
    return results[0] ? this.toObject(results[0]) : null;
  }

  // Find all
  static async find(conditions = {}) {
    let sql = 'SELECT * FROM staff';
    const params = [];

    if (conditions.role) {
      sql += ' WHERE role = ?';
      params.push(conditions.role);
    }
    if (conditions.attendance) {
      sql += params.length ? ' AND attendance = ?' : ' WHERE attendance = ?';
      params.push(conditions.attendance);
    }

    sql += ' ORDER BY createdAt DESC';
    const results = await query(sql, params);
    return results.map(r => this.toObject(r));
  }

  // Find one
  static async findOne(conditions) {
    if (conditions.staffId) {
      return await this.findByStaffId(conditions.staffId);
    }
    if (conditions.email) {
      return await this.findByEmail(conditions.email);
    }
    if (conditions.id || conditions._id) {
      return await this.findById(conditions.id || conditions._id);
    }
    return null;
  }

  // Update staff
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
    const sql = `UPDATE staff SET ${fields.join(', ')} WHERE id = ?`;
    await query(sql, values);
    return await this.findById(id);
  }

  // Save (create or update)
  static async save(staffData) {
    if (staffData.id) {
      const { id, ...updateData } = staffData;
      return await this.update(id, updateData);
    } else {
      return await this.create(staffData);
    }
  }

  // Delete staff
  static async delete(id) {
    const sql = 'DELETE FROM staff WHERE id = ?';
    await query(sql, [id]);
    return true;
  }

  // Convert to object
  static toObject(row) {
    if (!row) return null;
    return {
      _id: row.id,
      id: row.id,
      staffId: row.staffId,
      profilePicture: row.profilePicture,
      fullName: row.fullName,
      contactInfo: row.contactInfo,
      role: row.role,
      shift: row.shift,
      email: row.email,
      baseLocation: row.baseLocation,
      attendance: row.attendance,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }
}

module.exports = Staff;
