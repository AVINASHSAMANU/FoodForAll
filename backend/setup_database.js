const db = require('./db');

const queries = [
    "DROP TABLE IF EXISTS events",
    "DROP TABLE IF EXISTS users",
    "DROP TABLE IF EXISTS admins",

    `CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        org_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        gov_id VARCHAR(50) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        venueName VARCHAR(100),
        city VARCHAR(100),
        eventDate DATETIME,
        endTime VARCHAR(20),
        portions INT,
        foodType VARCHAR(50),
        username VARCHAR(50),
        status VARCHAR(20) DEFAULT 'Pending',
        notification_seen BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
];

const resetDatabase = async () => {
    console.log("Starting database reset...");
    for (const query of queries) {
        await new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if (err) {
                    console.error("Error executing query:", query);
                    console.error(err);
                    reject(err);
                } else {
                    console.log("Executed:", query.split('(')[0]);
                    resolve(result);
                }
            });
        });
    }
    console.log("Database reset complete. All tables recreated.");
    process.exit(0);
};

resetDatabase();
