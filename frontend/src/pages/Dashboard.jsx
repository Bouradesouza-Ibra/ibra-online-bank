import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://ibra-online-bank-api.onrender.com";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      window.location.href = "/#/login";
    }
  }, []);

  if (!user) {
    return null;
  }

  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [toUserId, setToUserId] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/#/login";
  };

  const getBalance = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/accounts/balance/${user.id}`
      );

      setAccount(response.data.account);
    } catch (error) {
      console.error(error);
      setMessage("Could not load account balance");
    }
  };

  const getTransactions = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/accounts/transactions/${user.id}`
      );

      setTransactions(response.data.transactions);
    } catch (error) {
      console.error(error);
      setMessage("Could not load transactions");
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/api/accounts/deposit`, {
        userId: user.id,
        amount: depositAmount,
      });

      setMessage(response.data.message);
      setDepositAmount("");
      getBalance();
      getTransactions();
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Deposit failed");
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/api/accounts/withdraw`, {
        userId: user.id,
        amount: withdrawAmount,
      });

      setMessage(response.data.message);
      setWithdrawAmount("");
      getBalance();
      getTransactions();
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Withdraw failed");
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/api/accounts/transfer`, {
        fromUserId: user.id,
        toUserId: toUserId,
        amount: transferAmount,
      });

      setMessage(response.data.message);
      setToUserId("");
      setTransferAmount("");
      getBalance();
      getTransactions();
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Transfer failed");
    }
  };

  useEffect(() => {
    getBalance();
    getTransactions();
  }, []);

  return (
    <div className="page">
      <div className="dashboard-navbar">
        <div>
          <h1>Ibra Online Bank</h1>
          <p>Welcome, {user.full_name}</p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => (window.location.href = "/#/profile")}>
            Profile
          </button>

          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {message && <p className="success-message">{message}</p>}

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Account Balance</h2>

          <h1 style={{ color: "#16a34a", fontSize: "40px" }}>
            ${account ? account.balance : "0.00"}
          </h1>

          <p>
            <strong>Account Number:</strong>
            <br />
            {account ? account.account_number : "Loading..."}
          </p>

          <p>
            <strong>Total Transactions:</strong> {transactions.length}
          </p>
        </div>

        <div className="dashboard-card">
          <h2>Deposit</h2>

          <form onSubmit={handleDeposit}>
            <input
              type="number"
              placeholder="Amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
            />

            <button type="submit">Deposit</button>
          </form>
        </div>

        <div className="dashboard-card">
          <h2>Withdraw</h2>

          <form onSubmit={handleWithdraw}>
            <input
              type="number"
              placeholder="Amount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />

            <button type="submit">Withdraw</button>
          </form>
        </div>

        <div className="dashboard-card">
          <h2>Transfer</h2>

          <form onSubmit={handleTransfer}>
            <input
              type="number"
              placeholder="Receiver User ID"
              value={toUserId}
              onChange={(e) => setToUserId(e.target.value)}
            />

            <input
              type="number"
              placeholder="Amount"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
            />

            <button type="submit">Transfer</button>
          </form>
        </div>
      </div>

      <div className="dashboard-card" style={{ marginTop: "30px" }}>
        <h2>Transaction History</h2>

        {transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          transactions.map((transaction) => (
            <div className="transaction-item" key={transaction.id}>
              <p>
                {transaction.transaction_type || transaction.type} - $
                {transaction.amount} -{" "}
                {transaction.description || transaction.created_at}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;