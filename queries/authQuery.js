const createUserQuery = `INSERT INTO users(first_name, last_name,email, password, is_admin) VALUES($1, $2, $3, $4, $5) RETURNING *;`;
const updateUserAndAdminQuery = `UPDATE users SET is_admin = ($1) WHERE user_id = ($2) RETURNING *;`;
const loginQuery = `SELECT * FROM users WHERE email = ($1)`;
const currentUserQuery = `SELECT * FROM users WHERE user_id = ($1)`;

module.exports = {
    createUserQuery,
    updateUserAndAdminQuery,
    loginQuery,
    currentUserQuery
}