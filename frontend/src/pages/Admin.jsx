import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { DataGrid } from "@mui/x-data-grid";

const API_URL = "https://ibra-online-bank-api.onrender.com";

function Admin() {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!currentUser) {
      window.location.href = "/#/login";
      return;
    }

    if (currentUser.role !== "admin") {
      window.location.href = "/#/dashboard";
    }
  }, []);

  if (!currentUser || currentUser.role !== "admin") {
    return null;
  }

  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const getAdminData = async () => {
    try {
      const usersResponse = await axios.get(`${API_URL}/api/admin/users`);
      const accountsResponse = await axios.get(`${API_URL}/api/admin/accounts`);
      const transactionsResponse = await axios.get(
        `${API_URL}/api/admin/transactions`
      );

      setUsers(usersResponse.data.users);
      setAccounts(accountsResponse.data.accounts);
      setTransactions(transactionsResponse.data.transactions);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/admin/users/${id}`);
      getAdminData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditUser = (user) => {
    const full_name = prompt("Enter full name:", user.full_name);
    const email = prompt("Enter email:", user.email);
    const role = prompt("Enter role:", user.role);

    if (!full_name || !email || !role) {
      return;
    }

    axios
      .put(`${API_URL}/api/admin/users/${user.id}`, {
        full_name,
        email,
        role,
      })
      .then(() => getAdminData())
      .catch((error) => console.error(error));
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/#/login";
  };

  const filteredUsers = users.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const userColumns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "full_name", headerName: "Full Name", width: 220 },
    { field: "email", headerName: "Email", width: 260 },
    { field: "role", headerName: "Role", width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      width: 220,
      renderCell: (params) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => handleEditUser(params.row)}>Edit</button>
          <button onClick={() => handleDeleteUser(params.row.id)}>
            Delete
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getAdminData();
  }, []);

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Ibra Bank</h2>

        <button onClick={() => window.scrollTo(0, 0)}>📊 Dashboard</button>

        <button
          onClick={() =>
            document.getElementById("users-section")?.scrollIntoView({
              behavior: "smooth",
            })
          }
        >
          👥 Users
        </button>

        <button
          onClick={() =>
            document.getElementById("analytics-section")?.scrollIntoView({
              behavior: "smooth",
            })
          }
        >
          📈 Analytics
        </button>

        <button onClick={() => (window.location.href = "/#/dashboard")}>
          🏦 User Dashboard
        </button>

        <button onClick={handleLogout}>🚪 Logout</button>
      </aside>

      <main className="admin-content">
        <h1>Admin Dashboard</h1>
        <p>Manage users, accounts, transactions, and analytics.</p>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h2>Total Users</h2>
            <h1>{users.length}</h1>
          </div>

          <div className="dashboard-card">
            <h2>Total Accounts</h2>
            <h1>{accounts.length}</h1>
          </div>

          <div className="dashboard-card">
            <h2>Total Transactions</h2>
            <h1>{transactions.length}</h1>
          </div>
        </div>

        <div
          id="analytics-section"
          className="dashboard-card"
          style={{ marginTop: "30px" }}
        >
          <h2>Bank Analytics</h2>

          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: users.length, label: "Users" },
                  { id: 1, value: accounts.length, label: "Accounts" },
                  {
                    id: 2,
                    value: transactions.length,
                    label: "Transactions",
                  },
                ],
              },
            ]}
            width={500}
            height={250}
          />
        </div>

        <div className="dashboard-card" style={{ marginTop: "30px" }}>
          <h2>System Overview</h2>

          <BarChart
            xAxis={[
              {
                scaleType: "band",
                data: ["Users", "Accounts", "Transactions"],
              },
            ]}
            series={[
              {
                data: [users.length, accounts.length, transactions.length],
                label: "Total",
              },
            ]}
            width={700}
            height={300}
          />
        </div>

        <div
          id="users-section"
          className="dashboard-card"
          style={{ marginTop: "30px" }}
        >
          <h2>Users Management</h2>

          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div style={{ height: 420, width: "100%", marginTop: "20px" }}>
            <DataGrid
              rows={filteredUsers}
              columns={userColumns}
              pageSizeOptions={[5, 10]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 5 },
                },
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Admin;