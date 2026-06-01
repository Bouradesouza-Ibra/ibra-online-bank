const express = require("express");

const {
  getAllUsers,
  getAllAccounts,
  getAllTransactions,
  deleteUser,
  updateUser,
} = require("../controllers/adminController");

const router = express.Router();

router.get("/users", getAllUsers);

router.get("/accounts", getAllAccounts);

router.get("/transactions", getAllTransactions);

router.delete("/users/:id", deleteUser);

router.put("/users/:id", updateUser);

module.exports = router;