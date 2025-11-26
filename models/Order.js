// models/Order.js - MySQL version
const { query } = require('../config/db');

class Order {
  // Create order
  static async create(orderData) {
    const {
      orderId, senderName, senderPhone, senderEmail, customerId,
      receiverName, receiverPhone, deliveryAddress, packageType,
      weight, dimensions, deliveryType, pickupDate, totalAmount,
      timeSlot, notes, cost, status, location_lat, location_lon
    } = orderData;

    const sql = `INSERT INTO orders (
      orderId, senderName, senderPhone, senderEmail, customerId,
      receiverName, receiverPhone, deliveryAddress, packageType,
      weight, dimensions, deliveryType, pickupDate, totalAmount,
      timeSlot, notes, cost, status, location_lat, location_lon
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const result = await query(sql, [
      orderId, senderName || null, senderPhone || null, senderEmail || null,
      customerId || null, receiverName || null, receiverPhone || null,
      deliveryAddress || null, packageType || null, weight || null,
      dimensions || null, deliveryType || 'standard', pickupDate || null,
      totalAmount || null, timeSlot || null, notes || null, cost || null,
      status || 'Pending', location_lat || null, location_lon || null
    ]);

    return await this.findById(result.insertId);
  }

  // Find by ID
  static async findById(id) {
    const sql = 'SELECT * FROM orders WHERE id = ?';
    const results = await query(sql, [id]);
    return results[0] ? this.toObject(results[0]) : null;
  }

  // Find by orderId
  static async findByOrderId(orderId) {
    const sql = 'SELECT * FROM orders WHERE orderId = ?';
    const results = await query(sql, [orderId]);
    return results[0] ? this.toObject(results[0]) : null;
  }

  // Find by customerId
  static async findByCustomerId(customerId) {
    const sql = 'SELECT * FROM orders WHERE customerId = ? ORDER BY createdAt DESC';
    const results = await query(sql, [customerId]);
    return results.map(r => this.toObject(r));
  }

  // Find all
  static async find(conditions = {}) {
    let sql = 'SELECT * FROM orders';
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
    if (conditions.orderId) {
      return await this.findByOrderId(conditions.orderId);
    }
    if (conditions.id || conditions._id) {
      return await this.findById(conditions.id || conditions._id);
    }
    return null;
  }

  // Update order
  static async update(id, updateData) {
    const fields = [];
    const values = [];

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        if (key === 'location') {
          if (updateData[key].lat !== undefined) {
            fields.push('location_lat = ?');
            values.push(updateData[key].lat);
          }
          if (updateData[key].lon !== undefined) {
            fields.push('location_lon = ?');
            values.push(updateData[key].lon);
          }
        } else {
          fields.push(`${key} = ?`);
          values.push(updateData[key]);
        }
      }
    });

    if (fields.length === 0) return await this.findById(id);

    values.push(id);
    const sql = `UPDATE orders SET ${fields.join(', ')} WHERE id = ?`;
    await query(sql, values);
    return await this.findById(id);
  }

  // Save (create or update)
  static async save(orderData) {
    if (orderData.id) {
      const { id, ...updateData } = orderData;
      return await this.update(id, updateData);
    } else {
      return await this.create(orderData);
    }
  }

  // Delete order
  static async delete(id) {
    const sql = 'DELETE FROM orders WHERE id = ?';
    await query(sql, [id]);
    return true;
  }

  // Convert to object
  static toObject(row) {
    if (!row) return null;
    return {
      _id: row.id,
      id: row.id,
      orderId: row.orderId,
      senderName: row.senderName,
      senderPhone: row.senderPhone,
      senderEmail: row.senderEmail,
      customerId: row.customerId,
      receiverName: row.receiverName,
      receiverPhone: row.receiverPhone,
      deliveryAddress: row.deliveryAddress,
      packageType: row.packageType,
      weight: row.weight,
      dimensions: row.dimensions,
      deliveryType: row.deliveryType,
      pickupDate: row.pickupDate,
      totalAmount: row.totalAmount,
      timeSlot: row.timeSlot,
      notes: row.notes,
      cost: row.cost,
      status: row.status,
      location: {
        lat: row.location_lat,
        lon: row.location_lon
      },
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }
}

module.exports = Order;
