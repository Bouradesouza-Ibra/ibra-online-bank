const express = require("express");

const {
  getBalance,
  depositMoney,
  withdrawMoney,
  transferMoney,
  getTransactions,
} = require("../controllers/accountController");

const router = express.Router();

router.get("/balance/:userId", getBalance);
router.post("/deposit", depositMoney);
router.post("/withdraw", withdrawMoney);
router.post("/transfer", transferMoney);
router.get("/transactions/:userId", getTransactions);

module.exports = router;