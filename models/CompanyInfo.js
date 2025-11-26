// models/CompanyInfo.js - MySQL version
const { query } = require('../config/db');

class CompanyInfo {
  // Create company info
  static async create(companyData) {
    const {
      logo, companyName, email, phone, address,
      currency, timezone, language
    } = companyData;

    const sql = `INSERT INTO company_info (
      logo, companyName, email, phone, address,
      currency, timezone, language
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const result = await query(sql, [
      logo || null, companyName, email, phone, address,
      currency, timezone, language
    ]);

    return await this.findById(result.insertId);
  }

  // Find by ID
  static async findById(id) {
    const sql = 'SELECT * FROM company_info WHERE id = ?';
    const results = await query(sql, [id]);
    return results[0] ? this.toObject(results[0]) : null;
  }

  // Find first (usually only one company info)
  static async findOne() {
    const sql = 'SELECT * FROM company_info ORDER BY id LIMIT 1';
    const results = await query(sql);
    return results[0] ? this.toObject(results[0]) : null;
  }

  // Find all
  static async find() {
    const sql = 'SELECT * FROM company_info ORDER BY createdAt DESC';
    const results = await query(sql);
    return results.map(r => this.toObject(r));
  }

  // Update company info
  static async update(id, updateData) {
    const fields = [];
    const values = [];

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        // Handle nested preferences object
        if (key === 'preferences') {
          if (updateData[key].currency !== undefined) {
            fields.push('currency = ?');
            values.push(updateData[key].currency);
          }
          if (updateData[key].timezone !== undefined) {
            fields.push('timezone = ?');
            values.push(updateData[key].timezone);
          }
          if (updateData[key].language !== undefined) {
            fields.push('language = ?');
            values.push(updateData[key].language);
          }
        } else {
          fields.push(`${key} = ?`);
          values.push(updateData[key]);
        }
      }
    });

    if (fields.length === 0) return await this.findById(id);

    values.push(id);
    const sql = `UPDATE company_info SET ${fields.join(', ')} WHERE id = ?`;
    await query(sql, values);
    return await this.findById(id);
  }

  // Save (create or update)
  static async save(companyData) {
    if (companyData.id) {
      const { id, ...updateData } = companyData;
      return await this.update(id, updateData);
    } else {
      return await this.create(companyData);
    }
  }

  // Delete company info
  static async delete(id) {
    const sql = 'DELETE FROM company_info WHERE id = ?';
    await query(sql, [id]);
    return true;
  }

  // Convert to object
  static toObject(row) {
    if (!row) return null;
    return {
      _id: row.id,
      id: row.id,
      logo: row.logo,
      companyName: row.companyName,
      email: row.email,
      phone: row.phone,
      address: row.address,
      preferences: {
        currency: row.currency,
        timezone: row.timezone,
        language: row.language
      },
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }
}

module.exports = CompanyInfo;
