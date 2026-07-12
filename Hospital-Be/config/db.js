
require('dotenv').config();
const mysql = require('mysql2/promise');
// const { pool } = require('../db');


// Create a promise-based pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: 0,
  dateStrings: true,
  // timezone: process.env.DB_TIMEZONE,
});

async function setupDatabase() {
  try {
    await pool.getConnection();
    console.log('✅ Connected to hospital_db database.');

    // DOCTORS TABLE
    await pool.query(`
      CREATE TABLE IF NOT EXISTS doctors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        specialization VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        contactNumber VARCHAR(15),
        userName VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        photo VARCHAR(255)
      );
    `);
    console.log('✅ Table "doctors" ensured.');

    // BOOKING FORM TABLE
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookingForm (
        id INT AUTO_INCREMENT PRIMARY KEY,
        doctor_id INT NOT NULL,
        hospital VARCHAR(100) NOT NULL,
        session_date DATE NOT NULL,
        session_time TIME NOT NULL,
         max_appointments INT NOT NULL DEFAULT 5,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
      );
    `);
    console.log('✅ Table "bookingForm" ensured.');

    // LAB REPORTS TABLE
    await pool.query(`
      CREATE TABLE IF NOT EXISTS lab_reports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        reference_number VARCHAR(255) NOT NULL,
        patient_name VARCHAR(255) NOT NULL,
        test_name VARCHAR(255) NOT NULL,
        report_date DATE NOT NULL,
        status VARCHAR(50) NOT NULL
      );
    `);
    console.log('✅ Table "lab_reports" ensured.');

    // USERS TABLE
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        country VARCHAR(100),
        phone VARCHAR(15),
        email VARCHAR(100) NOT NULL UNIQUE,
        title VARCHAR(10),
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        id_type VARCHAR(20),
        nic_or_passport VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table "users" ensured.');

    // APPOINTMENTS TABLE
    await pool.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        doctor_id INT NOT NULL,
        date DATETIME NOT NULL,
        patient_name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
      );
    `);
    console.log('✅ Table "appointments" ensured.');

    // ADD MISSING COLUMNS TO APPOINTMENTS TABLE
    const columnsToAdd = [
      { name: "user_id", type: "INT NOT NULL" },
      { name: "phone", type: "VARCHAR(20) NOT NULL" },
      { name: "country", type: "VARCHAR(50) NOT NULL" },
      { name: "nic", type: "VARCHAR(20) NOT NULL" },
      { name: "email", type: "VARCHAR(100) NOT NULL" },
      { name: "payment_id", type: "VARCHAR(100) DEFAULT NULL" },
      { name: "hospital", type: "VARCHAR(100) NOT NULL" },
      { name: "session_date", type: "DATE DEFAULT NULL" },
      { name: "session_time", type: "TIME NOT NULL" },
      { name: "doctor_name", type: "VARCHAR(100) NOT NULL" },
      { name: "status", type: "VARCHAR(20) DEFAULT 'active'" },
      { name: "bookingform_id", type: "INT NULL" },
    ];

    for (const { name, type } of columnsToAdd) {
      const [rows] = await pool.query(`
        SELECT COUNT(*) AS count FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'appointments' AND COLUMN_NAME = '${name}';
      `);

      if (rows[0].count === 0) {
        await pool.query(`ALTER TABLE appointments ADD COLUMN ${name} ${type};`);
        console.log(`✅ Added column '${name}' to appointments.`);
      } else {
        console.log(`ℹ️ Column '${name}' already exists in appointments.`);
      }
    }

    // Add foreign key for user_id if missing
    const [fkRows] = await pool.query(`
      SELECT COUNT(*) AS count
      FROM information_schema.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'appointments'
        AND COLUMN_NAME = 'user_id'
        AND REFERENCED_TABLE_NAME = 'users';
    `);

    if (fkRows[0].count === 0) {
      await pool.query(`
        ALTER TABLE appointments 
        ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
      `);
      console.log("✅ Foreign key for 'user_id' added.");
    } else {
      console.log("ℹ️ Foreign key for 'user_id' already exists.");
    }

    // Add foreign key for bookingform_id if missing
    const [fkBookingformRows] = await pool.query(`
      SELECT COUNT(*) AS count
      FROM information_schema.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'appointments'
        AND COLUMN_NAME = 'bookingform_id'
        AND REFERENCED_TABLE_NAME = 'bookingform';
    `);

    if (fkBookingformRows[0].count === 0) {
      await pool.query(`
        ALTER TABLE appointments 
        ADD CONSTRAINT fk_bookingform_id 
        FOREIGN KEY (bookingform_id) REFERENCES bookingForm(id) ON DELETE SET NULL;
      `);
      console.log("✅ Foreign key for 'bookingform_id' added.");
    } else {
      console.log("ℹ️ Foreign key for 'bookingform_id' already exists.");
    }

  } catch (err) {
    console.error('❌ Database setup failed:', err.message);
  }
}

setupDatabase();

module.exports = pool;









// require('dotenv').config();
// const mysql = require('mysql2/promise');

// // Create a promise-based pool
// // const pool = mysql.createPool({
// //   host: 'localhost',
// //   user: 'root',
// //   password: '', 
// //   database: 'hospital_db',
// //   waitForConnections: true,
// //   connectionLimit: 10,
// //   queueLimit: 0,
// //   dateStrings: true,
// //   //  timezone: "+05:30",
// // });

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
//   queueLimit: 0,
//   dateStrings: true,
//   // timezone: process.env.DB_TIMEZONE,
// });


  

// async function setupDatabase() {
//   try {
    
//     await pool.getConnection();
//     console.log('✅ Connected to hospital_db database.');


//     //     // DOCTORS TABLE
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS doctors (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         name VARCHAR(255) NOT NULL,
//         specialization VARCHAR(255) NOT NULL,
        
//         email VARCHAR(255),
//         contactNumber VARCHAR(15),
//         userName VARCHAR(255) NOT NULL UNIQUE,
//         password VARCHAR(255) NOT NULL,
//         photo VARCHAR(255)
//       );
//     `);
//     console.log('✅ Table "doctors" ensured.');

//      // BOOKING FORM TABLE
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS bookingForm (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         doctor_id INT NOT NULL,
//         hospital VARCHAR(100) NOT NULL,
//         session_date DATE NOT NULL,
//         session_time TIME NOT NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
//       );
//     `);
//     console.log('✅ Table "bookingForm" ensured.');
//   } catch (err) {
//     console.error('❌ Database setup failed:', err.message);
//   }
// }


//     // LAB REPORTS TABLE
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS lab_reports (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         reference_number VARCHAR(255) NOT NULL,
//         patient_name VARCHAR(255) NOT NULL,
//         test_name VARCHAR(255) NOT NULL,
//         report_date DATE NOT NULL,
//         status VARCHAR(50) NOT NULL
//       );
//     `);
//     console.log('✅ Table "lab_reports" ensured.');



//     // USERS TABLE
//     await pool.query(`
//   CREATE TABLE IF NOT EXISTS users (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     country VARCHAR(100),
//     phone VARCHAR(15),
//     email VARCHAR(100) NOT NULL UNIQUE,
//     title VARCHAR(10),
//     first_name VARCHAR(100),
//     last_name VARCHAR(100),
//     id_type VARCHAR(20),
//     nic_or_passport VARCHAR(50) NOT NULL UNIQUE,
//     password VARCHAR(255),
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//   );
// `);
//     console.log('✅ Table "users" ensured.');

    

//     // APPOINTMENTS TABLE
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS appointments (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         doctor_id INT NOT NULL,
//         date DATETIME NOT NULL,
//         patient_name VARCHAR(100) NOT NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
//       );
//     `);
//     console.log('✅ Table "appointments" ensured.');

//     // ADD MISSING COLUMNS TO APPOINTMENTS TABLE
//     const columnsToAdd = [
//       { name: "user_id", type: "INT NULL" },
//       { name: "phone", type: "VARCHAR(20) NOT NULL" },
//       { name: "country", type: "VARCHAR(50) NOT NULL" },
//       { name: "nic", type: "VARCHAR(20) NOT NULL" },
//       { name: "email", type: "VARCHAR(100) NOT NULL" },
//       { name: "payment_id", type: "VARCHAR(100) DEFAULT NULL" },
//   { name: "hospital", type: "VARCHAR(100) NOT NULL" },
//   { name: "session_date", type: "DATE DEFAULT NULL" },
//   { name: "session_time", type: "TIME NOT NULL" },
//   { name: "doctor_name", type: "VARCHAR(100) NOT NULL" },
//   { name: "status", type: "VARCHAR(20) DEFAULT 'active'" },
//   { name: "bookingform_id", type: "INT NULL" },
//     ];

//     for (const { name, type } of columnsToAdd) {
//       const [rows] = await pool.query(`
//         SELECT COUNT(*) AS count FROM information_schema.COLUMNS 
//         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'appointments' AND COLUMN_NAME = '${name}';
//       `);

//       if (rows[0].count === 0) {
//         await pool.query(`ALTER TABLE appointments ADD COLUMN ${name} ${type};`);
//         console.log(`✅ Added column '${name}' to appointments.`);
//       } else {
//         console.log(`ℹ️ Column '${name}' already exists in appointments.`);
//       }
//     }


//     const [fkRows] = await pool.query(`
//   SELECT COUNT(*) AS count
//   FROM information_schema.KEY_COLUMN_USAGE
//   WHERE TABLE_SCHEMA = DATABASE()
//     AND TABLE_NAME = 'appointments'
//     AND COLUMN_NAME = 'user_id'
//     AND REFERENCED_TABLE_NAME = 'users';
// `);

// if (fkRows[0].count === 0) {
//   await pool.query(`
//     ALTER TABLE appointments 
//     ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
//   `);
//   console.log("✅ Foreign key for 'user_id' added.");
// } else {
//   console.log("ℹ️ Foreign key for 'user_id' already exists.");
// }

// // Check if foreign key for bookingform_id exists
// const [fkBookingformRows] = await pool.query(`
//   SELECT COUNT(*) AS count
//   FROM information_schema.KEY_COLUMN_USAGE
//   WHERE TABLE_SCHEMA = DATABASE()
//     AND TABLE_NAME = 'appointments'
//     AND COLUMN_NAME = 'bookingform_id'
//     AND REFERENCED_TABLE_NAME = 'bookingform';
// `);

// if (fkBookingformRows[0].count === 0) {
//   await pool.query(`
//     ALTER TABLE appointments 
//     ADD CONSTRAINT fk_bookingform_id 
//     FOREIGN KEY (bookingform_id) REFERENCES bookingform(id) ON DELETE SET NULL;
//   `);
//   console.log("✅ Foreign key for 'bookingform_id' added.");
// } else {
//   console.log("ℹ️ Foreign key for 'bookingform_id' already exists.");
// }



   

// setupDatabase();

// // module.exports = pool;
// // index.js or setupDatabase.js
// // import 'dotenv/config';
// // import mysql from 'mysql2/promise';

// // const pool = mysql.createPool({
// //   host: process.env.DB_HOST,
// //   user: process.env.DB_USER,
// //   password: process.env.DB_PASSWORD,
// //   database: process.env.DB_NAME,
// //   waitForConnections: true,
// //   connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
// //   queueLimit: 0,
// //   dateStrings: true,
// // });

// // async function setupDatabase() {
// //   try {
// //     await pool.getConnection();
// //     console.log('✅ Connected to hospital_db database.');

// //     // Create doctors first
// //     await pool.query(`
// //       CREATE TABLE IF NOT EXISTS doctors (
// //         id INT AUTO_INCREMENT PRIMARY KEY,
// //         name VARCHAR(255) NOT NULL,
// //         specialization VARCHAR(255) NOT NULL,
// //         email VARCHAR(255),
// //         contactNumber VARCHAR(15),
// //         userName VARCHAR(255) NOT NULL UNIQUE,
// //         password VARCHAR(255) NOT NULL,
// //         photo VARCHAR(255)
// //       );
// //     `);
// //     console.log('✅ Table "doctors" ensured.');

// //     // Create bookingForm next
// //     await pool.query(`
// //       CREATE TABLE IF NOT EXISTS bookingForm (
// //         id INT AUTO_INCREMENT PRIMARY KEY,
// //         doctor_id INT NOT NULL,
// //         hospital VARCHAR(100) NOT NULL,
// //         session_date DATE NOT NULL,
// //         session_time TIME NOT NULL,
// //         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// //         FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
// //       );
// //     `);
// //     console.log('✅ Table "bookingForm" ensured.');

// //     // Then lab_reports
// //     await pool.query(`
// //       CREATE TABLE IF NOT EXISTS lab_reports (
// //         id INT AUTO_INCREMENT PRIMARY KEY,
// //         reference_number VARCHAR(255) NOT NULL,
// //         patient_name VARCHAR(255) NOT NULL,
// //         test_name VARCHAR(255) NOT NULL,
// //         report_date DATE NOT NULL,
// //         status VARCHAR(50) NOT NULL
// //       );
// //     `);
// //     console.log('✅ Table "lab_reports" ensured.');

// //     // Then users
// //     await pool.query(`
// //       CREATE TABLE IF NOT EXISTS users (
// //         id INT AUTO_INCREMENT PRIMARY KEY,
// //         country VARCHAR(100),
// //         phone VARCHAR(15),
// //         email VARCHAR(100) NOT NULL UNIQUE,
// //         title VARCHAR(10),
// //         first_name VARCHAR(100),
// //         last_name VARCHAR(100),
// //         id_type VARCHAR(20),
// //         nic_or_passport VARCHAR(50) NOT NULL UNIQUE,
// //         password VARCHAR(255),
// //         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// //       );
// //     `);
// //     console.log('✅ Table "users" ensured.');

// //     // Then appointments (all foreign keys can resolve now)
// //     await pool.query(`
// //       CREATE TABLE IF NOT EXISTS appointments (
// //         id INT AUTO_INCREMENT PRIMARY KEY,
// //         doctor_id INT NOT NULL,
// //         bookingform_id INT,
// //         date DATETIME NOT NULL,
// //         patient_name VARCHAR(100) NOT NULL,
// //         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// //         FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
// //         FOREIGN KEY (bookingform_id) REFERENCES bookingForm(id) ON DELETE SET NULL
// //       );
// //     `);
// //     console.log('✅ Table "appointments" ensured.');

// //     // Add other columns...
// //     const columnsToAdd = [
// //       { name: "user_id", type: "INT NULL" },
// //       { name: "phone", type: "VARCHAR(20) NOT NULL" },
// //       { name: "country", type: "VARCHAR(50) NOT NULL" },
// //       { name: "nic", type: "VARCHAR(20) NOT NULL" },
// //       { name: "email", type: "VARCHAR(100) NOT NULL" },
// //       { name: "payment_id", type: "VARCHAR(100) DEFAULT NULL" },
// //       { name: "hospital", type: "VARCHAR(100) NOT NULL" },
// //       { name: "session_date", type: "DATE DEFAULT NULL" },
// //       { name: "session_time", type: "TIME NOT NULL" },
// //       { name: "doctor_name", type: "VARCHAR(100) NOT NULL" },
// //       { name: "status", type: "VARCHAR(20) DEFAULT 'active'" },
// //     ];

// //     for (const { name, type } of columnsToAdd) {
// //       const [rows] = await pool.query(`
// //         SELECT COUNT(*) AS count FROM information_schema.COLUMNS 
// //         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'appointments' AND COLUMN_NAME = '${name}';
// //       `);
// //       if (rows[0].count === 0) {
// //         await pool.query(`ALTER TABLE appointments ADD COLUMN ${name} ${type};`);
// //         console.log(`✅ Added column '${name}' to appointments.`);
// //       } else {
// //         console.log(`ℹ️ Column '${name}' already exists in appointments.`);
// //       }
// //     }

// //     const [fkRows] = await pool.query(`
// //       SELECT COUNT(*) AS count
// //       FROM information_schema.KEY_COLUMN_USAGE
// //       WHERE TABLE_SCHEMA = DATABASE()
// //         AND TABLE_NAME = 'appointments'
// //         AND COLUMN_NAME = 'user_id'
// //         AND REFERENCED_TABLE_NAME = 'users';
// //     `);

// //     if (fkRows[0].count === 0) {
// //       await pool.query(`
// //         ALTER TABLE appointments 
// //         ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
// //       `);
// //       console.log("✅ Foreign key for 'user_id' added.");
// //     } else {
// //       console.log("ℹ️ Foreign key for 'user_id' already exists.");
// //     }

// //   } catch (err) {
// //     console.error('❌ Database setup failed:', err);
// //   }
// // }

// // setupDatabase();

// // export default pool;
