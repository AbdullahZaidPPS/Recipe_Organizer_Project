
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const db = require('../database/db');  // Importing the database connection

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });


// Register endpoint
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashedPassword], (err) => {
            if (err) {
                return res.status(400).send({ message: 'Username already exists' });
            }
            res.send({ message: 'User registered successfully' });
        });
    } catch {
        res.status(500).send();
    }
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
        if (err) {
            return res.status(500).send();
        }
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).send({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id }, 'secret');
        res.send({ token });
    });
});

// Middleware to authenticate JWT token
const authenticateJWT = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).send({ message: 'No token provided' });
    }
    jwt.verify(token, 'secret', (err, decoded) => {
        if (err) {
            return res.status(500).send({ message: 'Failed to authenticate token' });
        }
        req.userId = decoded.id;
        next();
    });
};

// Add recipe endpoint
app.post('/recipes', authenticateJWT, upload.single('image'), (req, res) => {
    const { name, title, instructions } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    db.run(
        `INSERT INTO recipes (name, title, instructions, image) VALUES (?, ?, ?, ?)`,
        [name, title, instructions, image],
        (err) => {
            if (err) {
                return res.status(500).send({ message: 'Error adding recipe' });
            }
            res.send({ message: 'Recipe added successfully' });
        }
    );
});


app.get('/recipes', authenticateJWT, (req, res) => {
    const { name } = req.query;
    if (name) {
        db.get(`SELECT * FROM recipes WHERE name = ?`, [name], (err, row) => {
            if (err) {
                return res.status(500).send({ message: 'Error fetching recipe' });
            }
            if (!row) {
                return res.status(404).send({ message: 'Recipe not found' });
            }
            res.send(row);
        });
    } else {
        db.all('SELECT * FROM recipes', [], (err, rows) => {
            if (err) {
                return res.status(500).send({ message: 'Error fetching recipes' });
            }
            res.send(rows);
        });
    }
});

app.get("/", async (req,res) => {
    res.send("HEllo World");
});

//Listening to Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
