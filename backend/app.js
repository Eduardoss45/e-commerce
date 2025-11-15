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
const allowedOrigins = [process.env.CORS_ORIGIN_1, process.env.CORS_ORIGIN_2];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log('🔎 Origin recebida:', origin);
      console.log('🔎 Allowed:', allowedOrigins);

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log('❌ BLOQUEADO PELO CORS:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
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
