const db = require('../config/connection');
const { User } = require('../models');
const userSeeds = require('./profileSeeds.json');

db.once('open', async () => {
  try {
    await User.deleteMany({});
    await User.create(UserSeeds);

    console.log('all done!');
    process.exit(0);
  } catch (err) {
    throw err;
  }
});
