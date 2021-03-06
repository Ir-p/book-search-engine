const db = require('../config/connection');
const { User } = require('../models');


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
