// src/Components/Admin/Admin.tsx
import React, { useEffect, useState } from "react";

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

const AdminHQ: React.FC = () => {
  const [_, setTransactions] = useState<Transaction[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [branchTransactions, setBranchTransactions] = useState<Transaction[]>(
    []
  );

  const [error, setError] = useState("");

  const branchNames = ["Nairobi", "Machakos", "Mombasa", "Kisumu"];
  const branchInventoryEndpoint =
    "https://oop-2-production.up.railway.app/api/inventory/branch/e7e47915-2547-4347-83ee-52bf81072d68";

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const allPayments: Transaction[] = [];

        for (const _ of branchNames) {
          const res = await fetch(branchInventoryEndpoint);
          const data: Transaction[] = await res.json();

          allPayments.push(...data);
        }

        // 🔽 Fetch this branch's transactions (using hardcoded ID or better: a selected branch)
        const branchOnlyRes = await fetch(
          `https://oop-2-production.up.railway.app/api/payments/history/branch/e7e47915-2547-4347-83ee-52bf81072d68`
        );
        const branchOnlyData = await branchOnlyRes.json();

        const inventoryRes = await fetch(branchInventoryEndpoint);
        const inventoryData = await inventoryRes.json();

        setTransactions(allPayments);
        setBranchTransactions(branchOnlyData);
        setInventory(inventoryData);
        setLoading(false);
      } catch (err) {
        setError("Failed to load admin data.");
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // console.log(transactions);
  console.log(branchTransactions);
  // console.log(inventory);

  if (loading)
    return (
      <div className="AdminPage loading">
        <button
          className="back-button"
          onClick={() => (window.location.href = "/")}
        >
          ← Back
        </button>
        <p>Loading admin data...</p>
      </div>
    );

  if (error)
    return (
      <div className="AdminPage error">
        <button
          className="back-button"
          onClick={() => (window.location.href = "/")}
        >
          ← Back
        </button>
        <p>{error}</p>
      </div>
    );

  return (
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
              {/* {transactions &&
                transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>{tx.userId}</td>
                    <td>{tx.orderId}</td>
                    <td>{tx.branch}</td>
                    <td>${tx.amount.toFixed(2)}</td>
                    <td>{tx.status}</td>
                    <td>{new Date(tx.createdAt).toLocaleString()}</td>
                  </tr>
                ))} */}
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
                <th>Stock</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {inventory &&
                inventory.map((item) => (
                  <tr key={item.branch.id}>
                    <td>{item.product.name}</td>
                    <td>{item.product.description}</td>
                    <td>{item.branch.name}</td>
                    <td>{item.quantity}</td>
                    <td>${item.product.price.toFixed(2)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminHQ;
