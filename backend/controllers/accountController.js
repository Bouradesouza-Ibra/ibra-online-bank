const pool = require("../db");

const getBalance = async (req, res) => {
  try {
    const { userId } = req.params;

    const account = await pool.query(
      "SELECT * FROM accounts WHERE user_id = $1",
      [userId]
    );

    if (account.rows.length === 0) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    res.json({
      account: account.rows[0],
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const depositMoney = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    const account = await pool.query(
      "SELECT * FROM accounts WHERE user_id = $1",
      [userId]
    );

    if (account.rows.length === 0) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    const newBalance =
      parseFloat(account.rows[0].balance) + parseFloat(amount);

    await pool.query(
      "UPDATE accounts SET balance = $1 WHERE user_id = $2",
      [newBalance, userId]
    );

    await pool.query(
      "INSERT INTO transactions (account_id, type, amount, description) VALUES ($1, $2, $3, $4)",
      [
        account.rows[0].id,
        "deposit",
        amount,
        "Money deposited",
      ]
    );

    res.json({
      message: "Deposit successful",
      new_balance: newBalance,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const withdrawMoney = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    const account = await pool.query(
      "SELECT * FROM accounts WHERE user_id = $1",
      [userId]
    );

    if (account.rows.length === 0) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    const currentBalance = parseFloat(account.rows[0].balance);
    const withdrawAmount = parseFloat(amount);

    if (withdrawAmount > currentBalance) {
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    const newBalance = currentBalance - withdrawAmount;

    await pool.query(
      "UPDATE accounts SET balance = $1 WHERE user_id = $2",
      [newBalance, userId]
    );

    await pool.query(
      "INSERT INTO transactions (account_id, type, amount, description) VALUES ($1, $2, $3, $4)",
      [
        account.rows[0].id,
        "withdraw",
        amount,
        "Money withdrawn",
      ]
    );

    res.json({
      message: "Withdraw successful",
      new_balance: newBalance,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getBalance,
  depositMoney,
  withdrawMoney,
};
const transferMoney = async (req, res) => {
    try {
      const { fromUserId, toUserId, amount } = req.body;
  
      if (fromUserId === toUserId) {
        return res.status(400).json({
          message: "You cannot transfer money to yourself",
        });
      }
  
      const sender = await pool.query(
        "SELECT * FROM accounts WHERE user_id = $1",
        [fromUserId]
      );
  
      const receiver = await pool.query(
        "SELECT * FROM accounts WHERE user_id = $1",
        [toUserId]
      );
  
      if (sender.rows.length === 0 || receiver.rows.length === 0) {
        return res.status(404).json({
          message: "Sender or receiver account not found",
        });
      }
  
      const senderBalance = parseFloat(sender.rows[0].balance);
      const transferAmount = parseFloat(amount);
  
      if (transferAmount > senderBalance) {
        return res.status(400).json({
          message: "Insufficient balance",
        });
      }
  
      const senderNewBalance = senderBalance - transferAmount;
      const receiverNewBalance =
        parseFloat(receiver.rows[0].balance) + transferAmount;
  
      await pool.query(
        "UPDATE accounts SET balance = $1 WHERE user_id = $2",
        [senderNewBalance, fromUserId]
      );
  
      await pool.query(
        "UPDATE accounts SET balance = $1 WHERE user_id = $2",
        [receiverNewBalance, toUserId]
      );
  
      await pool.query(
        "INSERT INTO transactions (account_id, type, amount, description) VALUES ($1, $2, $3, $4)",
        [sender.rows[0].id, "transfer", amount, `Transfer sent to user ${toUserId}`]
      );
  
      await pool.query(
        "INSERT INTO transactions (account_id, type, amount, description) VALUES ($1, $2, $3, $4)",
        [receiver.rows[0].id, "transfer", amount, `Transfer received from user ${fromUserId}`]
      );
  
      res.json({
        message: "Transfer successful",
        sender_new_balance: senderNewBalance,
        receiver_new_balance: receiverNewBalance,
      });
  
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  const getTransactions = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const account = await pool.query(
        "SELECT * FROM accounts WHERE user_id = $1",
        [userId]
      );
  
      if (account.rows.length === 0) {
        return res.status(404).json({
          message: "Account not found",
        });
      }
  
      const transactions = await pool.query(
        "SELECT * FROM transactions WHERE account_id = $1 ORDER BY created_at DESC",
        [account.rows[0].id]
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
  module.exports = {
    getBalance,
    depositMoney,
    withdrawMoney,
    transferMoney,
    getTransactions,
  };