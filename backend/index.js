const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});
app.get("/", (req, res) => {
    res.json({ message: "CSE Skill Tracker Backend is running!" });
});

pool.connect()
    .then(() => console.log("PostgreSQL connected successfully"))
    .catch((err) => console.error("Database connection error:", err));
app.post("/api/skills", async (req, res) => {
    try {
        const { studentName, skillName, skillLevel } = req.body;

        const result = await pool.query(
            `INSERT INTO skill_entries
            (student_name, skill_name, skill_level)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [studentName, skillName, skillLevel]
        );

        res.json({
            message: "Skill saved successfully",
            skill: result.rows[0]
        });

    } catch (error) {
        console.error("Error saving skill:", error);

        res.status(500).json({
            error: "Failed to save skill"
        });
    }
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
