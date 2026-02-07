const express = require("express");
const router = express.Router();
const db = require("../db");

/* EVENT FORM */

// GET all events for dashboard or user specific events
router.get("/events", (req, res) => {
    let sql = "SELECT * FROM events";
    const params = [];

    if (req.query.username) {
        sql += " WHERE username = ?";
        params.push(req.query.username);
        sql += " ORDER BY eventDate DESC";
    } else {
        sql += " ORDER BY eventDate DESC";
    }

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }
        res.json(results);
    });
});

// Update status of an event
router.put("/events/:id/status", (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    const sql = "UPDATE events SET status = ? WHERE id = ?";
    db.query(sql, [status, id], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }
        res.json({ message: "Status updated successfully" });
    });
});

// Matches the fields sent by eventForm.js
router.post("/events", (req, res) => {
    const { venueName, city, eventDate, endTime, portions, foodType, username } = req.body;

    const sql = `
        INSERT INTO events 
        (venueName, city, eventDate, endTime, portions, foodType, username, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')
    `;

    db.query(sql, [venueName, city, eventDate, endTime, portions, foodType, username], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }
        res.json({ message: "Event submitted successfully!" });
    });
});

// GET unseen notifications for a user
router.get("/notifications", (req, res) => {
    const { username } = req.query;
    if (!username) return res.status(400).json({ message: "Username required" });

    const sql = `
        SELECT * FROM events 
        WHERE username = ? AND status IN ('Accepted', 'Declined') AND notification_seen = 0
    `;
    db.query(sql, [username], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json(results);
    });
});

// Mark notifications as seen
router.put("/notifications/mark-seen", (req, res) => {
    const { ids } = req.body; // Array of IDs
    if (!ids || ids.length === 0) return res.json({ message: "No IDs provided" });

    const sql = "UPDATE events SET notification_seen = 1 WHERE id IN (?)";
    db.query(sql, [ids], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json({ message: "Notifications marked as seen" });
    });
});

/* CONTACT FORM */
router.post("/contact", (req, res) => {
    const { name, email, message } = req.body;
    const sql = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";

    db.query(sql, [name, email, message], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }
        res.json({ message: "Message sent successfully!" });
    });
});

module.exports = router;
