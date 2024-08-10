const User = require('../models/userModel');

async function getUserById(userId) {
  return await User.findById(userId);
}



async function deleteInactiveUsers() {
  const inactiveThreshold = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 days
  const inactiveUsers = await User.find({ last_connection: { $lt: inactiveThreshold } });
  await User.deleteMany({ last_connection: { $lt: inactiveThreshold } });
  return inactiveUsers;
}

module.exports = {
    getUserById,
  deleteInactiveUsers,
};
