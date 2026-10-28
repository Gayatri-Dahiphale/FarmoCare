require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`[Farmora Care API] Server listening on http://localhost:${PORT}/api/v1`);
      console.log(`[Farmora Care API] Health check: http://localhost:${PORT}/api/v1/health`);
    });
  } catch (error) {
    console.error(`[Server Error] Could not start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
