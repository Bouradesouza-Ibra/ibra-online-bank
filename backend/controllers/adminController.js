const pool = require("../db");

const getAllUsers = async (req, res) => {
  try {
    const users = await pool.query(
      "SELECT id, full_name, email, role FROM users ORDER BY id ASC"
    );

    res.json({
      users: users.rows,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllAccounts = async (req, res) => {
  try {
    const accounts = await pool.query(
      "SELECT * FROM accounts ORDER BY id ASC"
    );

    res.json({
      accounts: accounts.rows,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await pool.query(
      "SELECT * FROM transactions ORDER BY created_at DESC"
    );

    res.json({
      transactions: transactions.rows,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const account = await pool.query(
      "SELECT * FROM accounts WHERE user_id = $1",
      [id]
    );

    if (account.rows.length > 0) {
      await pool.query(
        "DELETE FROM transactions WHERE account_id = $1",
        [account.rows[0].id]
      );

      await pool.query(
        "DELETE FROM accounts WHERE user_id = $1",
        [id]
      );
    }

    await pool.query(
      "DELETE FROM users WHERE id = $1",
      [id]
    );

    res.json({
      message: "User deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, role } = req.body;

    const updatedUser = await pool.query(
      "UPDATE users SET full_name = $1, email = $2, role = $3 WHERE id = $4 RETURNING id, full_name, email, role",
      [full_name, email, role, id]
    );

    if (updatedUser.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User updated successfully",
      user: updatedUser.rows[0],
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getAllAccounts,
  getAllTransactions,
  deleteUser,
  updateUser,
};