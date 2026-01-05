const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fsSync.existsSync(uploadsDir)) {
  fsSync.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(6).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|webp|WEBP)$/)) {
      req.fileValidationError = 'Only image files are allowed!';
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Serve static files
app.use(express.static('public'));
app.use('/uploads', express.static(uploadsDir));

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Upload endpoint (compatible with PicGo)
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (req.fileValidationError) {
      return res.status(400).json({
        success: false,
        message: req.fileValidationError
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        filename: req.file.filename,
        url: fileUrl,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading file',
      error: error.message
    });
  }
});

// List uploaded images
app.get('/api/images', async (req, res) => {
  try {
    const files = await fs.readdir(uploadsDir);
    const imagePromises = files.map(async filename => {
      const stats = await fs.stat(path.join(uploadsDir, filename));
      return {
        filename: filename,
        url: `${req.protocol}://${req.get('host')}/uploads/${filename}`,
        size: stats.size,
        uploadDate: stats.mtime
      };
    });
    
    const images = await Promise.all(imagePromises);
    
    res.json({
      success: true,
      count: images.length,
      images: images
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error listing images',
      error: error.message
    });
  }
});

// Delete image
app.delete('/api/images/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    
    // Validate filename to prevent path traversal attacks
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid filename'
      });
    }
    
    const filePath = path.join(uploadsDir, filename);
    
    // Ensure the resolved path is within the uploads directory
    if (!filePath.startsWith(uploadsDir)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid filename'
      });
    }
    
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }
    
    await fs.unlink(filePath);
    
    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting image',
      error: error.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.listen(PORT, () => {
  console.log(`PicGo Private Image Hosting Server running on port ${PORT}`);
  console.log(`Upload endpoint: http://localhost:${PORT}/upload`);
  console.log(`Web interface: http://localhost:${PORT}`);
});
