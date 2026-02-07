const db = require('../db');

const alterQueries = [
    "ALTER TABLE events ADD COLUMN status VARCHAR(20) DEFAULT 'Pending';",
    "ALTER TABLE events ADD COLUMN username VARCHAR(50);"
];

const runMigration = async () => {
    for (const query of alterQueries) {
        await new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if (err) {
                    // Ignore duplicate column error usually code 1060
                    if (err.code === 'ER_DUP_FIELDNAME') {
                        console.log(`Column already exists, skipping: ${query}`);
                        resolve();
                    } else {
                        console.error(`Error running query: ${query}`, err);
                        reject(err);
                    }
                } else {
                    console.log(`Success: ${query}`);
                    resolve(result);
                }
            });
        });
    }
    console.log("Migration completed.");
    process.exit(0);
};

runMigration();
