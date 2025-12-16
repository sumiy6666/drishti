require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const winston = require('winston');

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const adminRoutes = require('./routes/admin');
const messageRoutes = require('./routes/messages');
const uploadRoutes = require('./routes/upload');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

// winston logger
const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console()
  ]
});
app.locals.logger = logger;

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jobportal', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => logger.info('MongoDB connected'))
  .catch(err => logger.error('MongoDB connection error', err));

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => res.send({ ok: true, message: 'Job Portal API running' }));

app.use((err, req, res, next) => {
  logger.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => logger.info('Server running on ' + PORT));
}

module.exports = app;
