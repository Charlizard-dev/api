// models/Notification.js - MySQL version
const { query } = require('../config/db');

class Notification {
  // Create notification
  static async create(notificationData) {
    const { userId, title, message, type, isRead = false } = notificationData;
    const sql = `INSERT INTO notifications (userId, title, message, type, isRead) 
                 VALUES (?, ?, ?, ?, ?)`;
    const result = await query(sql, [userId, title, message, type, isRead ? 1 : 0]);
    return await this.findById(result.insertId);
  }

  // Find by ID
  static async findById(id) {
    const sql = 'SELECT * FROM notifications WHERE id = ?';
    const results = await query(sql, [id]);
    return results[0] ? this.toObject(results[0]) : null;
  }

  // Find by user ID
  static async findByUserId(userId) {
    const sql = 'SELECT * FROM notifications WHERE userId = ? ORDER BY createdAt DESC';
    const results = await query(sql, [userId]);
    return results.map(r => this.toObject(r));
  }

  // Find all
  static async find() {
    const sql = 'SELECT * FROM notifications ORDER BY createdAt DESC';
    const results = await query(sql);
    return results.map(r => this.toObject(r));
  }

  // Find one
  static async findOne(conditions) {
    if (conditions.userId) {
      const sql = 'SELECT * FROM notifications WHERE userId = ? ORDER BY createdAt DESC LIMIT 1';
      const results = await query(sql, [conditions.userId]);
      return results[0] ? this.toObject(results[0]) : null;
    }
    return null;
  }

  // Update notification
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
    const sql = `UPDATE notifications SET ${fields.join(', ')} WHERE id = ?`;
    await query(sql, values);
    return await this.findById(id);
  }

  // Mark as read
  static async markAsRead(id) {
    return await this.update(id, { isRead: true });
  }

  // Delete notification
  static async delete(id) {
    const sql = 'DELETE FROM notifications WHERE id = ?';
    await query(sql, [id]);
    return true;
  }

  // Convert to object
  static toObject(row) {
    if (!row) return null;
    return {
      _id: row.id,
      id: row.id,
      userId: row.userId,
      title: row.title,
      message: row.message,
      type: row.type,
      isRead: row.isRead === 1 || row.isRead === true,
      createdAt: row.createdAt
    };
  }
}

module.exports = Notification;
