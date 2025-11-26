// models/Role.js - MySQL version
const { query } = require('../config/db');

class Role {
  // Create role
  static async create(roleData) {
    const { role, description, permissions } = roleData;

    const sql = `INSERT INTO roles (role, description, permissions)
                 VALUES (?, ?, ?)`;

    const result = await query(sql, [
      role, description || null,
      permissions ? JSON.stringify(permissions) : JSON.stringify([])
    ]);

    return await this.findById(result.insertId);
  }

  // Find by ID
  static async findById(id) {
    const sql = 'SELECT * FROM roles WHERE id = ?';
    const results = await query(sql, [id]);
    return results[0] ? this.toObject(results[0]) : null;
  }

  // Find by role name
  static async findByRole(roleName) {
    const sql = 'SELECT * FROM roles WHERE role = ?';
    const results = await query(sql, [roleName]);
    return results[0] ? this.toObject(results[0]) : null;
  }

  // Find all
  static async find() {
    const sql = 'SELECT * FROM roles ORDER BY createdAt DESC';
    const results = await query(sql);
    return results.map(r => this.toObject(r));
  }

  // Find one
  static async findOne(conditions) {
    if (conditions.role) {
      return await this.findByRole(conditions.role);
    }
    if (conditions.id || conditions._id) {
      return await this.findById(conditions.id || conditions._id);
    }
    return null;
  }

  // Update role
  static async update(id, updateData) {
    const fields = [];
    const values = [];

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        if (key === 'permissions') {
          fields.push('permissions = ?');
          values.push(JSON.stringify(updateData[key]));
        } else {
          fields.push(`${key} = ?`);
          values.push(updateData[key]);
        }
      }
    });

    if (fields.length === 0) return await this.findById(id);

    values.push(id);
    const sql = `UPDATE roles SET ${fields.join(', ')} WHERE id = ?`;
    await query(sql, values);
    return await this.findById(id);
  }

  // Save (create or update)
  static async save(roleData) {
    if (roleData.id) {
      const { id, ...updateData } = roleData;
      return await this.update(id, updateData);
    } else {
      return await this.create(roleData);
    }
  }

  // Delete role
  static async delete(id) {
    const sql = 'DELETE FROM roles WHERE id = ?';
    await query(sql, [id]);
    return true;
  }

  // Convert to object
  static toObject(row) {
    if (!row) return null;
    return {
      _id: row.id,
      id: row.id,
      role: row.role,
      description: row.description,
      permissions: row.permissions ? JSON.parse(row.permissions) : [],
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }
}

module.exports = Role;
