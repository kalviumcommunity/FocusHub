const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['focus', 'break'],
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number,
    default: 25 
  },
  completed: {
    type: Boolean,
    default: false
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  }
});

module.exports = mongoose.model('Session', sessionSchema);
