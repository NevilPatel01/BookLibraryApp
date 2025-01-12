const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./database');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 3001;

// Utility function to hash passwords
const hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, 10);
    } catch (error) {
        console.error("Error hashing password:", error);
        throw new Error("Password hash failed");
    }
};

// Utility function to compare passwords
const checkPassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        console.error("Error comparing passwords:", error);
        throw new Error("Password comparison failed");
    }
};

// Login API
app.post('/login', async (req, res) => {
    const { usernameOrEmail, password } = req.body;

    try {
        if (!usernameOrEmail || !password) {
            return res.status(400).json({ error: 'Username/Email and Password are required' });
        }

        const query = `SELECT * FROM users WHERE email = ? OR username = ?`;
        db.get(query, [usernameOrEmail, usernameOrEmail], async (err, user) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            if (!user) {
                return res.status(401).json({ error: 'No user found with this email/username' });
            }

            // Check password
            const passwordMatch = await checkPassword(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Incorrect password' });
            }

            res.json({
                success: true,
                message: 'Login successful',
                userId: user.id,
            });
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: 'An unexpected error occurred' });
    }
});

// Create New Account API
app.post('/register', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    try {
        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        const hashedPassword = await hashPassword(password);
        const query = `
            INSERT INTO users (username, email, password, created_at, updated_at)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `;

        db.run(query, [username, email, hashedPassword], function (err) {
            if (err) {
                console.error("Error creating account:", err);
                return res.status(500).json({ error: 'Error creating account: ' + err.message });
            }
            res.json({ success: true, userId: this.lastID });
        });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ error: 'An unexpected error occurred during registration' });
    }
});

// Reset Password API
app.post('/reset-password', async (req, res) => {
    const { email, newPassword, confirmNewPassword } = req.body;

    try {
        if (!email || !newPassword || !confirmNewPassword) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        const hashedPassword = await hashPassword(newPassword);
        const query = `
            UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?
        `;

        db.run(query, [hashedPassword, email], function (err) {
            if (err || this.changes === 0) {
                return res.status(400).json({ error: err ? err.message : 'Email not found' });
            }
            res.json({ success: true, message: 'Password reset successful' });
        });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ error: 'An unexpected error occurred while resetting the password' });
    }
});

// Fetch all Books
app.get('/books', async (req, res) => {
    try {
        const query = `
            SELECT id, title, author, genre_id, summary, cover_image, created_at, updated_at 
            FROM books
        `;
        
        db.all(query, [], (err, books) => {
            if (err) {
                console.error("Failed to fetch books:", err);
                return res.status(500).json({ error: 'Failed to fetch books' });
            }

            res.json(books);
        });
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ error: 'An unexpected error occurred while fetching books' });
    }
});

app.get('/favourites/:userId', (req, res) => {
  const { userId } = req.params;
  const query = `
    SELECT books.* 
    FROM books
    JOIN favourites ON books.id = favourites.book_id
    WHERE favourites.user_id = ?
  `;

  db.all(query, [userId], (err, rows) => {
    if (err) {
      console.error('Error fetching favourite books:', err);
      return res.status(500).json({ error: 'Error fetching favourite books' });
    }
    res.json(rows);
  });
});

// Fetch Popular Books
app.get('/books/popular', (req, res) => {
  const query = `
      SELECT id, title, author, genre_id, summary, cover_image 
      FROM books 
      ORDER BY created_at DESC
  `;
  
  db.all(query, [], (err, books) => {
      if (err) {
          console.error('Error fetching popular books:', err);
          return res.status(500).json({ error: 'Error fetching popular books' });
      }
      res.json(books);
  });
});


// Logout Endpoint (if applicable)
app.post('/logout', (req, res) => {
  // Handle any necessary logout actions on the backend if needed
  res.json({ success: true, message: 'Logged out successfully' });
});

app.post('/add-to-favourites', (req, res) => {
  const { userId, bookId } = req.body;

  // Log incoming values for better debugging
  console.log("userId:", userId, "bookId:", bookId);

  // Ensure you are handling NULL values correctly. For example, if the user doesn't exist or if the book doesn't exist
  const query = `
    INSERT INTO favourites (user_id, book_id, created_at, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
  `;

  db.run(query, [userId, bookId], function (err) {
    if (err) {
      console.error("Error adding to favourites:", err.message);
      return res.status(500).json({ error: 'Error adding to favourites', message: err.message });
    }

    // Log the successful query execution for debugging
    console.log("Record inserted with ID:", this.lastID);

    res.json({ success: true, message: 'Book added to favourites' });
  });
});


// Fetch all Favourite Books for a User
app.get('/favourites/:userId', (req, res) => {
  const { userId } = req.params;
  const query = `
    SELECT books.* 
    FROM books
    JOIN favourites ON books.id = favourites.book_id
    WHERE favourites.user_id = ?
  `;

  db.all(query, [userId], (err, rows) => {
    if (err) {
      console.error("Error fetching favourite books:", err);
      return res.status(500).json({ error: 'Error fetching favourite books' });
    }
    res.json(rows);
  });
});

// Remove a Book from User's Favourites
app.delete('/remove-from-favourites', (req, res) => {
  const { userId, bookId } = req.body;
  const query = `DELETE FROM favourites WHERE user_id = ? AND book_id = ?`;

  db.run(query, [userId, bookId], function (err) {
    if (err) {
      console.error("Error removing from favourites:", err);
      return res.status(500).json({ error: 'Error removing from favourites' });
    }
    res.json({ success: true, message: 'Book removed from favourites' });
  });
});

// Update a Favourite (if applicable, e.g., update 'updated_at' timestamp)
app.put('/update-favourite', (req, res) => {
  const { userId, bookId } = req.body;
  const query = `UPDATE favourites SET updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND book_id = ?`;

  db.run(query, [userId, bookId], function (err) {
    if (err) {
      console.error("Error updating favourite:", err);
      return res.status(500).json({ error: 'Error updating favourite' });
    }
    res.json({ success: true, message: 'Favourite updated successfully' });
  });
});

app.post('/save-learnings', async (req, res) => {
  const { userId, bookId, learning } = req.body;

  if (!userId || !bookId || !learning) {
    return res.status(400).send({ error: 'Missing fields' });
  }

  try {
    const query = 'INSERT INTO book_learnings (user_id, book_id, learning) VALUES (?, ?, ?)';
    db.run(query, [userId, bookId, learning], function (error) {
      if (error) {
        console.error('Error saving learning:', error);
        return res.status(500).send({ error: 'Internal Server Error' });
      }

      const learningEntry = {
        id: this.lastID,
        userId,
        bookId,
        learning,
      };

      res.status(200).send(learningEntry);
    });
  } catch (error) {
    console.error('Error saving learning:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});



app.get('/learnings', (req, res) => {
  const { userId, bookId } = req.query;

  if (!userId || !bookId) {
    return res.status(400).send({ error: 'Missing userId or bookId parameters' });
  }

  const query = 'SELECT * FROM book_learnings WHERE user_id = ? AND book_id = ?';
  db.all(query, [userId, bookId], (err, rows) => {
    if (err) {
      console.error('Error fetching learnings:', err);
      res.status(500).send({ error: 'Internal Server Error' });
    } else {
      res.status(200).send(rows);
    }
  });
});

app.delete('/learnings/:id', (req, res) => {
  const learningId = req.params.id;

  if (!learningId) {
    return res.status(400).send({ error: 'Missing learning ID' });
  }

  const query = 'DELETE FROM book_learnings WHERE id = ?';
  db.run(query, [learningId], function (err) {
    if (err) {
      console.error('Error deleting learning:', err);
      res.status(500).send({ error: 'Internal Server Error' });
    } else {
      res.status(200).send({ message: 'Learning deleted successfully' });
    }
  });
});

// Fetch book details by bookId
app.get('/books/:bookId', async (req, res) => {
  const { bookId } = req.params;
  try {
      const query = `
          SELECT id, title, author, genre_id, summary, cover_image, created_at, updated_at 
          FROM books
          WHERE id = ?
      `;
      
      db.get(query, [bookId], (err, book) => {
          if (err) {
              console.error("Failed to fetch book details:", err);
              return res.status(500).json({ error: 'Failed to fetch book details' });
          }

          if (!book) {
              return res.status(404).json({ error: 'Book not found' });
          }

          res.json(book);
      });
  } catch (error) {
      console.error("Error fetching book details:", error);
      res.status(500).json({ error: 'An unexpected error occurred while fetching book details' });
  }
});


// Fetch User Details by ID
app.get('/user/:userId', (req, res) => {
  const { userId } = req.params;
  const query = `
      SELECT id, username, email
      FROM users
      WHERE id = ?
  `;

  db.get(query, [userId], (err, user) => {
      if (err) {
          console.error("Error fetching user details:", err);
          return res.status(500).json({ error: 'Error fetching user details' });
      }
      
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
  });
});

// Update User Details
app.put('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const { username, email } = req.body;

  try {
      if (!username && !email) {
          return res.status(400).json({ error: 'At least one field is required' });
      }

      let updatedFields = [];
      let queryParams = [];

      if (username) {
          updatedFields.push("username = ?");
          queryParams.push(username);
      }

      if (email) {
          updatedFields.push("email = ?");
          queryParams.push(email);
      }

      if (updatedFields.length === 0) {
          return res.status(400).json({ error: 'No valid fields to update' });
      }

      const updateQuery = `
          UPDATE users
          SET ${updatedFields.join(", ")}, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
      `;

      queryParams.push(userId);

      db.run(updateQuery, queryParams, function (err) {
        if (err) {
            console.error("Error updating user:", err);
            return res.status(500).json({ error: 'Error updating user' });
        }
      
        if (this.changes === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
      
        res.json({ success: true, message: 'User updated successfully' });
      });      
  } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: 'An unexpected error occurred while updating user details' });
  }
});

// Delete User Account
app.delete('/user/:userId', (req, res) => {
  const { userId } = req.params;
  const query = `
      DELETE FROM users WHERE id = ?
  `;

  db.run(query, [userId], function (err) {
      if (err) {
          console.error("Error deleting user:", err);
          return res.status(500).json({ error: 'Error deleting user' });
      }

      if (this.changes === 0) {
          return res.status(404).json({ error: 'User not found' });
      }

      res.json({ success: true, message: 'User account deleted successfully' });
  });
});

app.put('/update-learning', async (req, res) => {
  const { id, userId, bookId, learning } = req.body;

  if (!id || !userId || !bookId || !learning) {
    return res.status(400).send({ error: 'Missing required fields' });
  }

  try {
    const query =
      'UPDATE book_learnings SET learning = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ? AND book_id = ?';

    db.run(query, [learning, id, userId, bookId], function (err) {
      if (err) {
        console.error('Error updating learning entry:', err);
        return res.status(500).send({ error: 'Internal Server Error' });
      }

      if (this.changes === 0) {
        return res.status(404).send({ error: 'Learning entry not found' });
      }

      res.status(200).send({ success: true, message: 'Learning updated successfully', data: { id, userId, bookId, learning } });
    });
  } catch (error) {
    console.error('Error updating learning:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// Delete User API
app.delete('/user/:userId', (req, res) => {
  const { userId } = req.params; // Get userId from URL params
  
  try {
    // Check if userId is provided
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Query to delete the user from the database
    const query = `DELETE FROM users WHERE id = ?`;
    
    db.run(query, [userId], function (err) {
      if (err) {
        console.error("Error deleting user:", err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ success: true, message: 'User deleted successfully' });
    });
  } catch (error) {
    console.error("Error during user deletion:", error);
    res.status(500).json({ error: 'An unexpected error occurred while deleting the user' });
  }
});



// Start the Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
