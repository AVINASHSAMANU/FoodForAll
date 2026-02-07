const db = require('../db');

const alterQuery = "ALTER TABLE events ADD COLUMN notification_seen BOOLEAN DEFAULT FALSE;";

const runMigration = async () => {
    db.query(alterQuery, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log("Column 'notification_seen' already exists.");
            } else {
                console.error("Error adding column:", err);
                process.exit(1);
            }
        } else {
            console.log("Success: Added 'notification_seen' column.");
        }
        process.exit(0);
    });
};

runMigration();
