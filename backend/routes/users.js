const express = require('express');
const { User, create, validate } = require('../models/user');

const router = express.Router();

// Should not be able to get all users at once?
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User with that id not found');
    res.send(user);
  } catch (ex) {
    console.log(ex.message);
    res.status(500).send('Error retrieving user');
  }
});

router.post('/', async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const user = await create(req.body);
    res.send(user);
  } catch (ex) {
    console.log(ex.message);
    res.status(500).send('Error making user');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send('User with that id not found');
    res.send(user);
  } catch (ex) {
    console.log(ex.message);
    res.status(500).send('Error deleting user');
  }
});

module.exports = router;
