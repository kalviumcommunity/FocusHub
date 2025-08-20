const express = require('express');
const Session = require('../models/Session');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all sessions for current user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { teamId } = req.query;
    let query = { userId: req.user._id };

    if (teamId) query.teamId = teamId;

    const sessions = await Session.find(query)
      .populate('userId', 'name email')
      .populate('teamId', 'name')
      .sort({ startTime: -1 });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single session
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('teamId', 'name');

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new session
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { type, duration, teamId } = req.body;

    const session = new Session({
      userId: req.user._id,
      type,
      duration: duration || (type === 'focus' ? 25 : 5),
      startTime: new Date(),
      teamId
    });

    await session.save();

    const populatedSession = await Session.findById(session._id)
      .populate('userId', 'name email')
      .populate('teamId', 'name');

    res.status(201).json(populatedSession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// End session
router.patch('/:id/end', authMiddleware, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    session.endTime = new Date();
    session.completed = true;
    await session.save();

    const updatedSession = await Session.findById(session._id)
      .populate('userId', 'name email')
      .populate('teamId', 'name');

    res.json(updatedSession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get active sessions
router.get('/active', authMiddleware, async (req, res) => {
  try {
    const { teamId } = req.query;
    let query = { 
      userId: req.user._id,
      endTime: { $exists: false }
    };

    if (teamId) query.teamId = teamId;

    const activeSessions = await Session.find(query)
      .populate('userId', 'name email')
      .populate('teamId', 'name');

    res.json(activeSessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
