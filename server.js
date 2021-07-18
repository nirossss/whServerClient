const express = require('express');
const app = express();
const cors = require('cors');
const { pool } = require('./dbConnection');

const port = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));
app.use('/api', express.json());
app.use('/api', express.urlencoded({ extended: false }));

app.route('/api/products')
    .get((req, res) => {
        pool.query(`SELECT * FROM products`, (err, results) => {
            if (err) throw err;
            res.json(results);
        })
    })
    .post((req, res) => {
        const { title, price, description, image } = req.body
        pool.query(`
            INSERT INTO products (title, price, description, image)
            VALUES (?,?,?,?)
            `, [title, price, description, image], (err, results) => {
            if (err) throw err;

            res.json({ success: true, product_id: results.insertId });
        })
    })

app.post('/api/editProduct', (req, res) => {
    const { id, title, price, description, image } = req.body
    pool.query(`
        UPDATE products SET title = ?, price = ?, description = ?, image = ?
        WHERE (id = ?);
    `, [title, price, description, image, id], (err, results) => {
        if (err) throw err;

        res.json({ success: true });
    })
})

app.post('/api/deleteProduct', (req, res) => {
    pool.query(`
        DELETE FROM products
        WHERE id = ?;
    `, [req.body.id], (err, results) => {
        if (err) throw err;

        res.json({ success: true });
    })
})

app.post('/api/productToCart', (req, res) => {
    const { product_id, cart_id } = req.body
    let dateNow = new Date
    pool.query(`
        INSERT INTO orders (product_id, cart_id, date)
        VALUES (?,?,?)
    `, [product_id, cart_id, dateNow.toISOString().substring(0, 10)], (err, results) => {
        if (err) throw err;

        res.json({ success: true });
    })
})

app.post('/api/payCart', (req, res) => {
    pool.query(`
        UPDATE orders SET pay = 1
        WHERE (cart_id = ?);
    `, [req.body.cart_id], (err, results) => {
        if (err) throw err;

        res.json({ success: true });
    })
})

app.get('/api/stats', (req, res) => {
    pool.query(`
        SELECT COUNT(o.product_id) AS orders, p.title
        FROM ent_whist.orders AS o
        LEFT JOIN ent_whist.products AS p
        ON o.product_id = p.id
        WHERE o.pay = 1
        GROUP BY o.product_id
        ORDER BY orders 
        DESC
        LIMIT 5
        `, (err, results) => {
        if (err) throw err;
        pool.query(`
            SELECT title, count(cart_id) AS unique_sale FROM
            (
            SELECT DISTINCT o.cart_id, p.title FROM ent_whist.products AS p
            INNER JOIN ent_whist.orders AS o
            ON p.id = o.product_id
            WHERE o.pay = 1
            ) AS temp
            GROUP BY title
            ORDER BY unique_sale
            DESC
            LIMIT 5
            `, (err, results2) => {
            if (err) throw err;
            pool.query(`
                SELECT SUM(p.price) AS profit, o.date
                FROM ent_whist.orders AS o
                LEFT JOIN ent_whist.products AS p
                ON o.product_id = p.id
                WHERE o.pay = 1
                GROUP BY o.date
                ORDER BY o.date
                DESC
                LIMIT 5
                `, (err, results3) => {
                if (err) throw err;
                res.json({ topSales: results, uniqueSales: results2, daySalesSum: results3 });
            })
        })
    })
})

app.listen(port, () => console.log(`Server running on port ${port}`));
