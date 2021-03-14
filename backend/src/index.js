const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: 'variables.env' });
const createServer = require('./createServer');
const prisma = require('./db');

const server = createServer();
server.express.use(cookieParser());

server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userid } = jwt.verify(token, process.env.APP_SECRET);
    req.userid = userid;
  }
  next();
});

server.express.use(async (req, res, next) => {
  if (!req.userid) return next();
  const user = await prisma.query.user(
    { where: { id: req.userid } },
    '{ id, email, name }'
  );

  req.user = user;
  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    }
  },
  deets => {
    console.log(`Server is now running on port http:/localhost:${deets.port}`);
  }
);
