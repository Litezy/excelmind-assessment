// Import core libraries and middleware
import express from 'express'; // Express framework for building APIs
import cors from 'cors'; // Middleware to enable Cross-Origin Resource Sharing
import dotenv from 'dotenv'; // Loads environment variables from .env file
import fileUpload from 'express-fileupload'; // Middleware for handling file uploads

// Import route modules for different API endpoints
import authRoutes from './routes/authRoutes';
import courseRoutes from './routes/courseRoutes';
import adminRoutes from './routes/adminRoutes';
import assignmentRoutes from './routes/assignmentRoutes';
import aiRoutes from './routes/aiRoutes';

// Load environment variables into process.env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; // Use port from env or default to 5000

// Enable CORS for specific origins (local dev, Vercel, production)
app.use(cors({
  origin: [
    /^http:\/\/localhost:(5173|5174|5175|3001)$/, // Allow local dev ports
    /\.vercel\.app$/, // Allow any Vercel app domain
    'https://excelmind-assessment.vercel.app' // Allow production frontend
  ],
  credentials: true, // Allow cookies/auth headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Allowed headers
  optionsSuccessStatus: 200 // For legacy browser support
}));

// Parse incoming JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable file uploads, storing temp files in /tmp/
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
}));

// Register API routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/ai', aiRoutes);

// Health check route for root URL
app.get('/', (req, res) => {
  res.send('Academic CRM/ExcelMind API is running');
});

// Start the server and log the URL
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});