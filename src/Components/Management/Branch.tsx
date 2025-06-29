// src/Components/Admin/BranchAdmin.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

interface Branch {
  id: string;
  name: string;
}

interface InventoryItem {
  id: string;

  name: string;
  description: string;
  price: number;

  quantity: number;
  branch: Branch;
}

const branches = [
  { id: "e7e47915-2547-4347-83ee-52bf81072d68", name: "Nairobi" },
  { id: "ba2ca26e-9b6e-4495-a514-1043b2d88f24", name: "Machakos" },
  { id: "cf64d5fd-8422-474e-8b9f-f61ac77b8ae0", name: "Mombasa" },
  { id: "133ea6d2-44de-4149-9896-43e308874f79", name: "Kisumu" },
];

const branchFinder = (id: string) => branches.find((branch) => branch.id == id);

const BranchAdmin: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(
        `https://oop-2-production.up.railway.app/api/products/branch/${id}`
      ),
      fetch(
        `https://oop-2-production.up.railway.app/api/order-items/branch/${id}`
      ),
    ])
      .then(async (responses) => {
        setInventory(await responses[0].json());
        setTransactions(await responses[1].json());
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setError(error);
      });
  }, [id]);

  console.log(inventory);
  console.log(transactions);

  if (loading)
    return (
      <div className="AdminPage loading">
        <button
          className="back-button"
          onClick={() => (window.location.href = "/")}
        >
          ← Back
        </button>
        <p>Loading branch data...</p>
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
        <h1>Branch Admin - {branchFinder(id as string)?.name}</h1>
        <button
          className="back-button"
          onClick={() => (window.location.href = "/")}
        >
          ← Back
        </button>
      </div>

      <section className="transactions">
        <h2>Recent Transactions</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.userId}</td>
                  <td>${tx.price.toFixed(2)}</td>
                  <td>{tx.quantity}</td>
                  <td>{new Date().toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="inventory">
        <h2>Branch Stock</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Description</th>
                <th>Stock</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.id}>
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
  );
};

export default BranchAdmin;
