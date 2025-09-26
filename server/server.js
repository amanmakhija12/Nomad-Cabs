
const express = require('express');
const cors = require('cors');
require('./src/db/db'); 
const authRoutes = require('./src/routes/authRoutes');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.get('/', (_req,res)=>res.send('Nomad Cabs Auth API running'));

app.listen(PORT, () => console.log(`Auth server running on :${PORT}`));
