const allUser = `SELECT * FROM users;`;
const allActiveUsers = `SELECT * FROM users WHERE status ='active';`;
const allInActiveUsers = `SELECT * FROM users WHERE status ='inactive';`;

module.exports = {
    allUser,
    allActiveUsers,
    allInActiveUsers
}