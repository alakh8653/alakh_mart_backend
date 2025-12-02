const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const productsRouter = require('./routes/products');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');
const uploadsRouter = require('./routes/uploads');
const errorHandler = require('./middleware/errorHandler');
const swagger = require('./docs/swagger');

const app = express();

// When running behind a proxy (docker, load balancer), enable trust proxy
app.set('trust proxy', 1);

app.use(morgan('dev'));
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use(require('express-rate-limit')({ windowMs: 60 * 1000, max: 200 }));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/docs', swagger);
app.use('/auth', authRouter);
app.use('/products', productsRouter);
app.use('/users', usersRouter);
app.use('/jobs', jobsRouter);
app.use('/upload', uploadsRouter);

// serve uploaded files when using local storage
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

app.use(errorHandler);

module.exports = app;
