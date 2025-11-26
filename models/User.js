// models/User.js - MySQL version
const { query } = require('../config/db');

class User {
  // Find user by email
  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const results = await query(sql, [email.toLowerCase().trim()]);
    return results[0] || null;
  }

  // Find user by ID
  static async findById(id) {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const results = await query(sql, [id]);
    return results[0] || null;
  }

  // Find user by customerId
  static async findByCustomerId(customerId) {
    const sql = 'SELECT * FROM users WHERE customerId = ?';
    const results = await query(sql, [customerId]);
    return results[0] || null;
  }

  // Create new user
  static async create(userData) {
    const {
      customerId,
      email,
      password,
      fullName,
      nickName,
      dob,
      phone,
      gender,
      image,
      location_latitude,
      location_longitude,
      location_address
    } = userData;

    const sql = `INSERT INTO users (
      customerId, email, password, fullName, nickName, dob, phone, gender, image,
      location_latitude, location_longitude, location_address
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const result = await query(sql, [
      customerId,
      email.toLowerCase().trim(),
      password,
      fullName || null,
      nickName || null,
      dob || null,
      phone || null,
      gender || null,
      image || null,
      location_latitude || null,
      location_longitude || null,
      location_address || null
    ]);

    return await this.findById(result.insertId);
  }

  // Update user
  static async update(id, updateData) {
    const fields = [];
    const values = [];

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        // Map location object to database fields
        if (key === 'location') {
          if (updateData[key].latitude !== undefined) {
            fields.push('location_latitude = ?');
            values.push(updateData[key].latitude);
          }
          if (updateData[key].longitude !== undefined) {
            fields.push('location_longitude = ?');
            values.push(updateData[key].longitude);
          }
          if (updateData[key].address !== undefined) {
            fields.push('location_address = ?');
            values.push(updateData[key].address);
          }
        } else if (key === 'email') {
          fields.push(`${key} = ?`);
          values.push(updateData[key].toLowerCase().trim());
        } else {
          fields.push(`${key} = ?`);
          values.push(updateData[key]);
        }
      }
    });

    if (fields.length === 0) return await this.findById(id);

    values.push(id);
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    await query(sql, values);
    return await this.findById(id);
  }

  // Save user (alias for update or create)
  static async save(userData) {
    if (userData.id) {
      const { id, ...updateData } = userData;
      return await this.update(id, updateData);
    } else {
      return await this.create(userData);
    }
  }

  // Find all users
  static async findAll() {
    const sql = 'SELECT * FROM users ORDER BY createdAt DESC';
    return await query(sql);
  }

  // Find one user (generic) - supports Mongoose-like syntax
  static async findOne(conditions = {}) {
    let user = null;

    if (conditions.email) {
      user = await this.findByEmail(conditions.email);
    } else if (conditions.customerId) {
      user = await this.findByCustomerId(conditions.customerId);
    } else if (conditions.id || conditions._id) {
      user = await this.findById(conditions.id || conditions._id);
    } else {
      // If no conditions, get the first user (for .sort() compatibility)
      const sql = 'SELECT * FROM users ORDER BY createdAt DESC LIMIT 1';
      const results = await query(sql);
      user = results[0] || null;
    }

    return user ? this.toObject(user) : null;
  }

  // Find one with sort - for User.findOne().sort({ createdAt: -1 })
  static async findOneSorted(sortObj = { createdAt: -1 }) {
    const orderBy = Object.keys(sortObj)[0];
    const direction = sortObj[orderBy] === -1 ? 'DESC' : 'ASC';
    const sql = `SELECT * FROM users ORDER BY ${orderBy} ${direction} LIMIT 1`;
    const results = await query(sql);
    const user = results[0] || null;
    return user ? this.toObject(user) : null;
  }

  // Find one with select (exclude fields) - for .select('-password -__v')
  static async findOneWithSelect(conditions, selectString) {
    const user = await this.findOne(conditions);
    if (!user) return null;

    // Handle .select('-password -__v') syntax
    if (selectString && selectString.includes('-')) {
      const excludeFields = selectString.split(' ').map(f => f.replace('-', '').trim());
      excludeFields.forEach(field => {
        if (field && user[field] !== undefined) {
          delete user[field];
        }
      });
    }
    delete user.__v; // Always remove __v (Mongoose version key)
    return user;
  }

  // Find one and update
  static async findOneAndUpdate(conditions, updateData, options = {}) {
    const user = await this.findOne(conditions);
    if (!user) {
      if (options.upsert) {
        return await this.create({ ...conditions, ...updateData });
      }
      return null;
    }
    return await this.update(user.id, updateData);
  }

  // Delete user
  static async delete(id) {
    const sql = 'DELETE FROM users WHERE id = ?';
    await query(sql, [id]);
    return true;
  }

  // Add token to user
  static async addToken(userId, token) {
    const sql = 'INSERT INTO user_tokens (userId, token) VALUES (?, ?)';
    await query(sql, [userId, token]);
    return true;
  }

  // Get user tokens
  static async getTokens(userId) {
    const sql = 'SELECT token FROM user_tokens WHERE userId = ?';
    const results = await query(sql, [userId]);
    return results.map(r => r.token);
  }

  // Remove token from user
  static async removeToken(userId, token) {
    const sql = 'DELETE FROM user_tokens WHERE userId = ? AND token = ?';
    await query(sql, [userId, token]);
    return true;
  }

  // Convert database row to user object (with location object)
  static toObject(row) {
    if (!row) return null;
    return {
      _id: row.id,
      id: row.id,
      customerId: row.customerId,
      email: row.email,
      password: row.password,
      fullName: row.fullName,
      nickName: row.nickName,
      dob: row.dob,
      phone: row.phone,
      gender: row.gender,
      image: row.image,
      location: {
        latitude: row.location_latitude,
        longitude: row.location_longitude,
        address: row.location_address
      },
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }
}

module.exports = User;
