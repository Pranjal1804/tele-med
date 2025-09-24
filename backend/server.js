const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// MongoDB Connection with proper error handling
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('URI:', process.env.MONGODB_URI ? 'URI found' : 'URI not found');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('🔄 Retrying in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

// Connect to database
connectDB();

// MongoDB connection event listeners
mongoose.connection.on('connected', () => {
  console.log('🟢 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('🔴 Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🟡 Mongoose disconnected');
});

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  userType: { type: String, enum: ['patient', 'doctor'], required: true },
  phone: String,
  specialty: String,
  licenseNumber: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Consultation Schema
const consultationSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['waiting', 'active', 'completed', 'cancelled'], default: 'waiting' },
  startTime: Date,
  endTime: Date,
  notes: String,
  diagnosis: String,
  prescription: String,
  bandwidthHistory: [{
    timestamp: Date,
    bandwidth: Number,
    quality: String
  }],
  createdAt: { type: Date, default: Date.now }
});

const Consultation = mongoose.model('Consultation', consultationSchema);

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, userType, phone, specialty, licenseNumber } = req.body;

    console.log('Registration attempt:', { email, userType });

    // Validate required fields
    if (!email || !password || !name || !userType) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const userData = {
      email,
      password: hashedPassword,
      name,
      userType,
      phone,
    };

    if (userType === 'doctor') {
      userData.specialty = specialty;
      userData.licenseNumber = licenseNumber;
    }

    const user = new User(userData);
    await user.save();

    console.log('User created successfully:', user._id);

    // Generate JWT
    const token = jwt.sign(
      { 
        userId: user._id, 
        userType: user.userType,
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        userType: user.userType,
        specialty: user.specialty
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    res.status(500).json({ error: 'Server error during registration' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', email);

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    console.log('Login successful:', user._id);

    // Generate JWT
    const token = jwt.sign(
      { 
        userId: user._id, 
        userType: user.userType,
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        userType: user.userType,
        specialty: user.specialty
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Add this route after your existing auth routes

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        userType: user.userType,
        specialty: user.specialty
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Consultation Routes
app.post('/api/consultations/create', authenticateToken, async (req, res) => {
  try {
    const { doctorId } = req.body;
    const patientId = req.user.userId;

    // Generate unique room ID
    const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const consultation = new Consultation({
      roomId,
      patientId,
      doctorId,
      status: 'waiting'
    });

    await consultation.save();

    res.status(201).json({
      message: 'Consultation created successfully',
      consultation: {
        id: consultation._id,
        roomId: consultation.roomId,
        status: consultation.status
      }
    });
  } catch (error) {
    console.error('Create consultation error:', error);
    res.status(500).json({ error: 'Failed to create consultation' });
  }
});

app.get('/api/consultations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userType = req.user.userType;

    const query = userType === 'patient' 
      ? { patientId: userId } 
      : { doctorId: userId };

    const consultations = await Consultation.find(query)
      .populate('patientId', 'name email')
      .populate('doctorId', 'name email specialty')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ consultations });
  } catch (error) {
    console.error('Get consultations error:', error);
    res.status(500).json({ error: 'Failed to fetch consultations' });
  }
});

// WebRTC Signaling and Room Management
const activeRooms = new Map();
const userSockets = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join consultation room
  socket.on('join-room', (data) => {
    const { roomId, userId, userType } = data;
    
    console.log(`User ${userId} (${userType}) joining room ${roomId}`);
    
    socket.join(roomId);
    userSockets.set(userId, socket.id);
    
    if (!activeRooms.has(roomId)) {
      activeRooms.set(roomId, new Set());
    }
    
    activeRooms.get(roomId).add({
      userId,
      userType,
      socketId: socket.id
    });

    // Notify others in the room
    socket.to(roomId).emit('user-joined', {
      userId,
      userType,
      participantCount: activeRooms.get(roomId).size
    });

    // Send current participants to the joining user
    socket.emit('room-participants', {
      participants: Array.from(activeRooms.get(roomId))
    });
  });

  // WebRTC Signaling
  socket.on('offer', (data) => {
    console.log('Offer received for room:', data.roomId);
    socket.to(data.roomId).emit('offer', {
      offer: data.offer,
      senderId: data.senderId
    });
  });

  socket.on('answer', (data) => {
    console.log(' Answer received for room:', data.roomId);
    socket.to(data.roomId).emit('answer', {
      answer: data.answer,
      senderId: data.senderId
    });
  });

  socket.on('ice-candidate', (data) => {
    socket.to(data.roomId).emit('ice-candidate', {
      candidate: data.candidate,
      senderId: data.senderId
    });
  });

  // Bandwidth monitoring
  socket.on('bandwidth-update', (data) => {
    const { roomId, bandwidth, quality } = data;
    
    // Broadcast bandwidth info to room
    socket.to(roomId).emit('bandwidth-info', {
      userId: data.userId,
      bandwidth,
      quality,
      timestamp: Date.now()
    });

    // Check for low bandwidth threshold
    if (bandwidth < 1.0) { // Less than 1 Mbps
      io.to(roomId).emit('low-bandwidth-alert', {
        userId: data.userId,
        bandwidth,
        recommendation: 'switch-to-avatar'
      });
    }
  });

  // Text2Video events
  socket.on('activate-text2video', (data) => {
    console.log('Text2Video activated for room:', data.roomId);
    socket.to(data.roomId).emit('text2video-activated', {
      userId: data.userId,
      reason: data.reason || 'low-bandwidth'
    });
  });

  socket.on('deactivate-text2video', (data) => {
    console.log('Text2Video deactivated for room:', data.roomId);
    socket.to(data.roomId).emit('text2video-deactivated', {
      userId: data.userId
    });
  });

  // Chat messages
  socket.on('chat-message', (data) => {
    io.to(data.roomId).emit('chat-message', {
      ...data,
      timestamp: Date.now()
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('🔌 User disconnected:', socket.id);
    
    // Find and remove user from active rooms
    for (const [roomId, participants] of activeRooms.entries()) {
      const userToRemove = Array.from(participants).find(p => p.socketId === socket.id);
      if (userToRemove) {
        participants.delete(userToRemove);
        userSockets.delete(userToRemove.userId);
        
        // Notify others in the room
        socket.to(roomId).emit('user-left', {
          userId: userToRemove.userId,
          participantCount: participants.size
        });
        
        // Clean up empty rooms
        if (participants.size === 0) {
          activeRooms.delete(roomId);
        }
        break;
      }
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(`CORS enabled for: ${process.env.FRONTEND_URL}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log(' SIGTERM received, shutting down gracefully...');
  await mongoose.connection.close();
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});