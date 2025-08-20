const express = require('express');
const Team = require('../models/Team');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all teams for current user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const teams = await Team.find({
      'members.userId': req.user._id
    })
    .populate('createdBy', 'name email')
    .populate('members.userId', 'name email')
    .sort({ createdAt: -1 });

    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single team
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('members.userId', 'name email');

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Check if user is a member of the team
    const isMember = team.members.some(member => 
      member.userId._id.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: 'Not a member of this team' });
    }

    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new team
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, members } = req.body;

    // Create team with creator as manager
    const team = new Team({
      name,
      description,
      createdBy: req.user._id,
      members: [{
        userId: req.user._id,
        role: 'Manager'
      }]
    });

    // Add additional members if provided
    if (members && Array.isArray(members)) {
      for (const memberEmail of members) {
        const user = await User.findOne({ email: memberEmail });
        if (user && user._id.toString() !== req.user._id.toString()) {
          team.members.push({
            userId: user._id,
            role: 'Member'
          });
        }
      }
    }

    await team.save();

    const populatedTeam = await Team.findById(team._id)
      .populate('createdBy', 'name email')
      .populate('members.userId', 'name email');

    res.status(201).json(populatedTeam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Join team
router.post('/:id/join', authMiddleware, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Check if user is already a member
    const isMember = team.members.some(member => 
      member.userId.toString() === req.user._id.toString()
    );

    if (isMember) {
      return res.status(400).json({ message: 'Already a member of this team' });
    }

    // Add user as member
    team.members.push({
      userId: req.user._id,
      role: 'Member'
    });

    await team.save();

    const populatedTeam = await Team.findById(team._id)
      .populate('createdBy', 'name email')
      .populate('members.userId', 'name email');

    res.json(populatedTeam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get team members
router.get('/:id/members', authMiddleware, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('members.userId', 'name email role');

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Check if user is a member
    const isMember = team.members.some(member => 
      member.userId._id.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: 'Not a member of this team' });
    }

    res.json(team.members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update team member role
router.patch('/:id/members/:userId/role', authMiddleware, async (req, res) => {
  try {
    const { role } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Check if requester is manager
    const requester = team.members.find(member => 
      member.userId.toString() === req.user._id.toString()
    );

    if (!requester || requester.role !== 'Manager') {
      return res.status(403).json({ message: 'Only managers can update member roles' });
    }

    // Find member to update
    const memberIndex = team.members.findIndex(member => 
      member.userId.toString() === req.params.userId
    );

    if (memberIndex === -1) {
      return res.status(404).json({ message: 'Member not found' });
    }

    team.members[memberIndex].role = role;
    await team.save();

    const populatedTeam = await Team.findById(team._id)
      .populate('createdBy', 'name email')
      .populate('members.userId', 'name email');

    res.json(populatedTeam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
