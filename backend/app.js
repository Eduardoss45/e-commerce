// * imports
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const app = express();
const port = 3000;
const connectDB = require('./db/conn');
const router = require('./routes/router');
const cookieParser = require('cookie-parser');

// * middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// * routes
app.use('/', router);

(async () => {
  const connected = await connectDB();
  if (connected) {
    app.listen(port, () => {
      console.log(`Servidor rodando na porta: ${port}`);
    });
  } else {
    console.error('Erro na conexão com o banco. Servidor não iniciado.');
  }
})();
