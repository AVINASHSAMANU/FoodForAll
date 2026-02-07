const db = require('./db');

const testUser = {
    username: "debug_user_" + Date.now(),
    email: "debug_user_" + Date.now() + "@example.com",
    password: "password123"
};

const testAdmin = {
    orgName: "Debug Org " + Date.now(),
    email: "debug_admin_" + Date.now() + "@example.com",
    govId: "GOV" + Date.now(),
    password: "password123"
};

console.log("Attempting to insert test user...");
db.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [testUser.username, testUser.email, testUser.password],
    (err, res) => {
        if (err) {
            console.error("USER INSERT FAILED:", err);
        } else {
            console.log("USER INSERT SUCCESS:", res);
        }

        console.log("Attempting to insert test admin...");
        db.query("INSERT INTO admins (org_name, email, gov_id, password) VALUES (?, ?, ?, ?)",
            [testAdmin.orgName, testAdmin.email, testAdmin.govId, testAdmin.password],
            (err, res) => {
                if (err) {
                    console.error("ADMIN INSERT FAILED:", err);
                } else {
                    console.log("ADMIN INSERT SUCCESS:", res);
                }
                db.end();
            }
        );
    }
);
