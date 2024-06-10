const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

// Create and connect to SQLite database
let db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});

// Create a table and insert some test data
db.serialize(() => {
    db.run("CREATE TABLE items (id INTEGER PRIMARY KEY, itemName TEXT, price REAL)");
    const stmt = db.prepare("INSERT INTO items (itemName, price) VALUES (?, ?)");

    // Sample data with 20 items
    const items = [
        { itemName: "Classic White T-shirt", price: 19.99 },
        { itemName: "Slim Fit Blue Jeans", price: 39.99 },
        { itemName: "Leather Jacket with Zipper", price: 59.99 },
        { itemName: "Running Sneakers", price: 49.99 },
        { itemName: "Woolen Winter Hat", price: 14.99 },
        { itemName: "Cotton Ankle Socks", price: 4.99 },
        { itemName: "Crew Neck Sweater", price: 34.99 },
        { itemName: "Knitted Scarf", price: 12.99 },
        { itemName: "Brown Leather Belt", price: 9.99 },
        { itemName: "Thermal Gloves", price: 15.99 },
        { itemName: "Cargo Shorts", price: 29.99 },
        { itemName: "Beach Sandals", price: 24.99 },
        { itemName: "Polarized Sunglasses", price: 19.99 },
        { itemName: "Analog Wrist Watch", price: 89.99 },
        { itemName: "Waterproof Backpack", price: 49.99 },
        { itemName: "Sports Cap", price: 10.99 },
        { itemName: "Silk Neck Tie", price: 8.99 },
        { itemName: "Formal Blazer", price: 79.99 },
        { itemName: "Summer Floral Dress", price: 49.99 },
        { itemName: "Pleated Skirt", price: 39.99 }
    ];

    items.forEach(item => {
        stmt.run(item.itemName, item.price);
    });

    stmt.finalize();
});

// API endpoint for search
app.get('/search', (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.json({ results: [] });
    }

    db.all("SELECT * FROM items WHERE itemName LIKE ?", [`%${query}%`], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ results: rows });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Close the database connection when the server stops
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Close the database connection.');
        process.exit(0);
    });
});
