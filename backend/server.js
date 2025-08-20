const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1); 
    }
};

// Import routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const sessionRoutes = require('./routes/sessions');
const teamRoutes = require('./routes/teams');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/teams', teamRoutes);

// Socket.IO for real-time features
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join team room
  socket.on('joinTeam', (teamId) => {
    socket.join(teamId);
    console.log(`User ${socket.id} joined team ${teamId}`);
  });

  // Join session
  socket.on('joinSession', (data) => {
    socket.join(data.sessionId);
    socket.to(data.sessionId).emit('userJoined', {
      userId: data.userId,
      username: data.username
    });
  });

  // Update task
  socket.on('updateTask', (data) => {
    socket.to(data.teamId).emit('taskUpdated', data);
  });

  // Session update
  socket.on('sessionUpdate', (data) => {
    socket.to(data.sessionId).emit('sessionUpdate', data);
  });

  // Presence update
  socket.on('presenceUpdate', (data) => {
    socket.to(data.teamId).emit('presenceUpdate', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    connectDB()
  console.log(`Server running on port ${PORT}`);
});
