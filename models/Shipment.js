// models/Shipment.js - MySQL version
const { query } = require('../config/db');

class Shipment {
  // Create shipment
  static async create(shipmentData) {
    const {
      shipmentId, senderName, senderPhone, receiverName, receiverPhone,
      start, end, parcelWeight, packageType, cost, eta, notes,
      status, driverId, dateShipped, deliveredAt, routeId,
      trackingNumber, driverName
    } = shipmentData;

    const sql = `INSERT INTO shipments (
      shipmentId, senderName, senderPhone, receiverName, receiverPhone,
      start, end, parcelWeight, packageType, cost, eta, notes,
      status, driverId, dateShipped, deliveredAt, routeId,
      trackingNumber, driverName
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const result = await query(sql, [
      shipmentId, senderName, senderPhone, receiverName, receiverPhone,
      start, end, parcelWeight, packageType, cost, eta, notes || '',
      status || 'Pending', driverId || null, dateShipped || null,
      deliveredAt || null, routeId || null, trackingNumber || null,
      driverName || 'Unassigned'
    ]);

    return await this.findById(result.insertId);
  }

  // Find by ID
  static async findById(id) {
    const sql = 'SELECT * FROM shipments WHERE id = ?';
    const results = await query(sql, [id]);
    return results[0] ? this.toObject(results[0]) : null;
  }

  // Find by shipmentId
  static async findByShipmentId(shipmentId) {
    const sql = 'SELECT * FROM shipments WHERE shipmentId = ?';
    const results = await query(sql, [shipmentId]);
    return results[0] ? this.toObject(results[0]) : null;
  }

  // Find by driver
  static async findByDriverId(driverId) {
    const sql = 'SELECT * FROM shipments WHERE driverId = ? ORDER BY createdAt DESC';
    const results = await query(sql, [driverId]);
    return results.map(r => this.toObject(r));
  }

  // Find all
  static async find(conditions = {}) {
    let sql = 'SELECT * FROM shipments';
    const params = [];

    if (conditions.status) {
      sql += ' WHERE status = ?';
      params.push(conditions.status);
    }
    if (conditions.driver) {
      sql += params.length ? ' AND driverId = ?' : ' WHERE driverId = ?';
      params.push(conditions.driver);
    }

    sql += ' ORDER BY createdAt DESC';
    const results = await query(sql, params);
    return results.map(r => this.toObject(r));
  }

  // Find one
  static async findOne(conditions) {
    if (conditions.shipmentId) {
      return await this.findByShipmentId(conditions.shipmentId);
    }
    if (conditions.id || conditions._id) {
      return await this.findById(conditions.id || conditions._id);
    }
    return null;
  }

  // Update shipment
  static async update(id, updateData) {
    const fields = [];
    const values = [];

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        // Map driver ObjectId to driverId
        if (key === 'driver') {
          fields.push('driverId = ?');
          values.push(updateData[key]);
        } else {
          fields.push(`${key} = ?`);
          values.push(updateData[key]);
        }
      }
    });

    if (fields.length === 0) return await this.findById(id);

    values.push(id);
    const sql = `UPDATE shipments SET ${fields.join(', ')} WHERE id = ?`;
    await query(sql, values);
    return await this.findById(id);
  }

  // Save (create or update)
  static async save(shipmentData) {
    if (shipmentData.id) {
      const { id, ...updateData } = shipmentData;
      return await this.update(id, updateData);
    } else {
      return await this.create(shipmentData);
    }
  }

  // Add order to shipment
  static async addOrder(shipmentId, orderId) {
    const sql = 'INSERT INTO shipment_orders (shipmentId, orderId) VALUES (?, ?)';
    await query(sql, [shipmentId, orderId]);
    return true;
  }

  // Get shipment orders
  static async getOrders(shipmentId) {
    const sql = `SELECT o.* FROM orders o
                 INNER JOIN shipment_orders so ON o.id = so.orderId
                 WHERE so.shipmentId = ?`;
    const results = await query(sql, [shipmentId]);
    return results;
  }

  // Delete shipment
  static async delete(id) {
    const sql = 'DELETE FROM shipments WHERE id = ?';
    await query(sql, [id]);
    return true;
  }

  // Convert to object
  static toObject(row) {
    if (!row) return null;
    return {
      _id: row.id,
      id: row.id,
      shipmentId: row.shipmentId,
      senderName: row.senderName,
      senderPhone: row.senderPhone,
      receiverName: row.receiverName,
      receiverPhone: row.receiverPhone,
      start: row.start,
      end: row.end,
      parcelWeight: row.parcelWeight,
      packageType: row.packageType,
      cost: row.cost,
      eta: row.eta,
      notes: row.notes,
      status: row.status,
      driver: row.driverId, // Map driverId to driver for compatibility
      driverId: row.driverId,
      dateShipped: row.dateShipped,
      deliveredAt: row.deliveredAt,
      routeId: row.routeId,
      trackingNumber: row.trackingNumber,
      driverName: row.driverName,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }
}

module.exports = Shipment;
