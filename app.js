const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const DATABASE = './following_system.db';

let db = new sqlite3.Database(DATABASE, (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to database');
    db.run(`CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE
        )`);

    db.run(`CREATE TABLE IF NOT EXISTS followers (
            user_id INTEGER,
            follower_id INTEGER,
            followed_at DATE,
            PRIMARY KEY (user_id, follower_id),
            FOREIGN KEY (user_id) REFERENCES users(user_id),
            FOREIGN KEY (follower_id) REFERENCES users(user_id)
        )`);

    db.run(`CREATE TABLE IF NOT EXISTS followings (
            user_id INTEGER,
            following_id INTEGER,
            followed_at DATE,
            PRIMARY KEY (user_id, following_id),
            FOREIGN KEY (user_id) REFERENCES users(user_id),
            FOREIGN KEY (following_id) REFERENCES users(user_id)
        )`);
  }
});

app.post('/follow', (req, res) => {
  const { user_id, follow_id } = req.body;
  const followedAt = new Date().toISOString();
  db.run(
    'INSERT INTO followers (user_id, follower_id, followed_at) VALUES (?, ?, ?)',
    [follow_id, user_id, followedAt],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      db.run(
        'INSERT INTO followings (user_id, following_id, followed_at) VALUES (?, ?, ?)',
        [user_id, follow_id, followedAt],
        function (err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.status(201).json({ message: 'Followed successfully' });
        }
      );
    }
  );
});

app.post('/unfollow', (req, res) => {
  const { user_id, follow_id } = req.body;
  db.run(
    'DELETE FROM followers WHERE user_id = ? AND follower_id = ?',
    [follow_id, user_id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      db.run(
        'DELETE FROM followings WHERE user_id = ? AND following_id = ?',
        [user_id, follow_id],
        function (err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.status(200).json({ message: 'Unfollowed successfully' });
        }
      );
    }
  );
});

app.get('/followers/:user_id', (req, res) => {
  const { user_id } = req.params;
  db.all(
    'SELECT follower_id, followed_at FROM followers WHERE user_id = ?',
    [user_id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(rows);
    }
  );
});

app.post('/mutual_followers', (req, res) => {
  const { user_id1, user_id2 } = req.body;
  db.all(
    `SELECT follower_id 
            FROM followers 
            WHERE user_id = ? 
            INTERSECT 
            SELECT follower_id 
            FROM followers 
            WHERE user_id = ?`,
    [user_id1, user_id2],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(rows);
    }
  );
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
