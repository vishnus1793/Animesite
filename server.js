const express = require('express');
const supabase = require('./supabaseClient'); // Import your Supabase connection

const app = express();
app.use(express.json());

// Example: Fetch all rows from a table
app.get('/users', async (req, res) => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(200).json(data);
});

// Example: Insert a new row into a table
app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  const { data, error } = await supabase.from('users').insert([{ name, email }]);
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(201).json(data);
});

// Example: Update a row in a table
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const { data, error } = await supabase.from('users').update({ name, email }).eq('id', id);
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(200).json(data);
});

// Example: Delete a row from a table
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('users').delete().eq('id', id);
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(200).json(data);
});

// Login Route: Authenticate user with email and password
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Use Supabase Auth to sign in the user
  const { user, session, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  // If successful, send user details and session token
  res.status(200).json({
    message: 'Login successful',
    user: user,
    session: session,
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
