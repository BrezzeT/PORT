import express from "express";
import cors from "cors";
import pkg from "pg";
import dotenv from "dotenv";

const { Pool } = pkg;

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Health endpoint to keep the server alive
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Self-ping to prevent sleep on free tiers (every 14 mins)
const DO_PING = process.env.PING_SELF === 'true'; // Set PING_SELF=true in env vars
if (DO_PING) {
    setInterval(() => {
        const url = `https://portfolio-backend-rzpz.onrender.com/health`;
        fetch(url)
            .then(res => console.log(`Self-ping: ${res.status}`))
            .catch(err => console.error(`Self-ping failed: ${err.message}`));
    }, 14 * 60 * 1000); // 14 minutes
}

app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === process.env.ADMIN_PASSWORD) {
        res.status(200).json({ success: true });
    } else {
        res.status(401).json({ success: false, message: "Access Denied" });
    }
});

const pool = new Pool(
    process.env.DATABASE_URL
        ? {
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        }
        : {
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
        }
);

pool.connect()
    .then(async (client) => {
        console.log('Connected to the database');
        client.release();
    })
    .catch((err) => console.error('Failed to connect to the database', err));

app.post('/api/projects', async (req, res) => {
    const { title, category, description, image_url, github_url, live_url, technologies } = req.body;
    if (!title || !category || !description || !image_url || !github_url || !live_url || !technologies) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        const queryText = 'INSERT INTO projects (title, category, description, image_url, github_url, live_url, technologies) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
        const result = await pool.query(queryText, [title, category, description, image_url, github_url, live_url, technologies]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding project:', error);
        res.status(500).json({ error: 'Failed to add project' });
    }
});
app.get('/api/projects', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM projects ORDER BY id DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

app.put('/api/projects/:id', async (req, res) => {
    const { id } = req.params;
    const { title, category, description, image_url, github_url, live_url, technologies } = req.body;
    try {
        const queryText = `
            UPDATE projects 
            SET title = $1, category = $2, description = $3, image_url = $4, github_url = $5, live_url = $6, technologies = $7
            WHERE id = $8
            RETURNING *
        `;
        const result = await pool.query(queryText, [title, category, description, image_url, github_url, live_url, technologies, id]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Failed to update project' });
    }
});

app.delete('/api/projects/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM projects WHERE id = $1', [id]);
        res.json({ message: 'Project deleted' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
});
app.post('/api/like', async (req, res) => {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const message = 'Вашему портфолио поставили лайк ❤️';
    if (!token || !chatId) {
        return res.status(500).json({ error: 'Telegram bot token or chat ID not found' });
    }
    try {
        const url = `https://api.telegram.org/bot${token}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message
            })
        });
        if (!response.ok) {
            throw new Error('Failed to send message');
        }
        res.json({ message: 'Like message sent successfully' });
    } catch (error) {
        console.error('Error sending like message:', error);
        res.status(500).json({ error: 'Failed to send like message' });
    }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});