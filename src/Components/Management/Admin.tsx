// src/Components/Admin/Admin.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface Branch {
  id: string;
  name: string;
}

interface InventoryItem {
  id: string;
  product: {
    name: string;
    description: string;
    price: number;
  };
  quantity: number;
  branch: Branch;
}

interface Transaction {
  id: string;
  userId: string;
  orderId: string;
  amount: number;
  status: string;
  branch: string;
  createdAt: string;
}

type user = {
  id: string;
  balance: number;
  role: string;
  username: string;
  email: string;
  password: string;
};

const AdminHQ: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]),
    [inventory, setInventory] = useState<InventoryItem[]>([]),
    [loading, setLoading] = useState(true),
    navigation = useNavigate(),
    [user, setUser] = useState<user | null>(null),
    [error, setError] = useState(""),
    branchNames = ["Nairobi", "Machakos", "Mombasa", "Kisumu"],
    branchInventoryEndpoint =
      "https://oop-2-production.up.railway.app/api/products/branch/e7e47915-2547-4347-83ee-52bf81072d68",
    branchTransactionsEndpoint =
      "https://oop-2-production.up.railway.app/api/payments/history/branches";

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) navigation("/");
    else {
      const parsedUser = JSON.parse(user);

      setUser(parsedUser);
    }
  }, []);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const allPayments: Transaction[] = [];

        for (const _ of branchNames) {
          const res = await fetch(branchTransactionsEndpoint);
          const data: Transaction[] = await res.json();

          allPayments.push(...data);
        }

        // 🔽 Fetch this branch's transactions (using hardcoded ID or better: a selected branch)

        const inventoryRes = await fetch(branchInventoryEndpoint);
        const inventoryData = await inventoryRes.json();

        setTransactions(allPayments);
        setInventory(inventoryData);
        setLoading(false);
      } catch (err) {
        setError("Failed to load admin data.");
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading)
    return (
      <div className="AdminPage loading">
        <button className="back-button" onClick={() => navigation("/")}>
          ← Back
        </button>
        <p>Loading admin data...</p>
      </div>
    );

  if (error)
    return (
      <div className="AdminPage error">
        <button className="back-button" onClick={() => navigation("/")}>
          ← Back
        </button>
        <p>{error}</p>
      </div>
    );

  return user && user.role.toLowerCase() == "admin" ? (
    <div className="AdminPage">
      <div className="header">
        <h1>Admin HQ</h1>
        <div className="header-buttons">
          <button
            className="back-button"
            onClick={() => (window.location.href = "/")}
          >
            ← Back
          </button>
          <button
            className="add-product-button"
            onClick={() =>
              (window.location.href =
                "/management/e7e47915-2547-4347-83ee-52bf81072d68/add")
            }
          >
            + Add Product
          </button>
        </div>
      </div>

      <section className="transactions">
        <h2>Transactions Across Branches</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Order ID</th>
                <th>Branch</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions &&
                transactions.map((tx, index) => (
                  <tr key={index}>
                    <td>{tx.userId}</td>
                    <td>{tx.orderId}</td>
                    <td>{tx.branch}</td>
                    <td>${tx.amount.toFixed(2)}</td>
                    <td>{tx.status}</td>
                    <td>{new Date(tx.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="inventory">
        <h2>Inventory Overview</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Description</th>
                <th>Branch</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {inventory &&
                inventory.map((item: any, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                    <td>{item.quantity}</td>
                    <td>${item.price.toFixed(2)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  ) : (
    <div>
      <p>You don't have access</p>
      <button onClick={() => navigation("/")}>Go back</button>
    </div>
  );
};

export default AdminHQ;
