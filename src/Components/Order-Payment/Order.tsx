// src/Components/Orders/Orders.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface Order {
  id: string;
  totalPrice: number;
  orderStatus: string;
  createdAt: string;
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Retrieve user object once
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;

    fetch(`https://oop-2-production.up.railway.app/api/orders/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((_: any) => {
        setError("Failed to fetch orders.");
        setLoading(false);
      });
  }, [userId]);

  const createNewOrder = async () => {
    if (!userId) return alert("User not logged in.");

    try {
      const response = await fetch(
        "https://oop-2-production.up.railway.app/api/orders",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );
      const result = await response.json();

      if (!response.ok) throw new Error(result);

      const orderId = result.id;
      if (orderId) {
        localStorage.setItem("currentOrderId", orderId);
        alert("New order created.");
        navigate("/global");
      } else {
        alert("Order created, but no order ID returned.");
      }
    } catch (error) {
      alert("Error creating order.");
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      const res = await fetch(
        `https://oop-2-production.up.railway.app/api/orders/${orderId}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        alert("Order deleted.");
      }
    } catch (err) {
      alert("Failed to delete order.");
    }
  };

  const selectOrder = (orderId: string) => {
    localStorage.setItem("currentOrderId", orderId);
    alert("Order selected. You can now add products.");
    navigate("/global");
  };

  const goToPayment = (orderId: string) => {
    localStorage.setItem("paymentOrderId", orderId); // or overwrite currentOrderId if shared
    navigate("/payments");
  };

  if (loading)
    return (
      <div className="OrdersPage loading">
        <button onClick={() => (window.location.href = "/")}>← Back</button>
        <p>Loading orders...</p>
      </div>
    );

  if (error)
    return (
      <div className="OrdersPage error">
        <button onClick={() => (window.location.href = "/")}>← Back</button>
        <p>{error}</p>
      </div>
    );

  return (
    <div className="OrdersPage">
      <div className="header">
        <h1>Your Orders</h1>
        <button
          className="back-button"
          onClick={() => (window.location.href = "/")}
        >
          ← Back
        </button>
      </div>
      <button className="create-order" onClick={createNewOrder}>
        Create New Order
      </button>

      <div className="orders-list">
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => (
            <div className="order-card" key={order.id}>
              <p>
                <strong>ID:</strong> {order.id}
              </p>
              <p>
                <strong>Total:</strong> ${order.totalPrice.toFixed(2)}
              </p>
              <p>
                <strong>Status:</strong> {order.orderStatus}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <div className="actions">
                {order.orderStatus === "PENDING" && (
                  <button onClick={() => selectOrder(order.id)}>Select</button>
                )}

                <button
                  onClick={() => deleteOrder(order.id)}
                  disabled={order.orderStatus === "PENDING" ? false : true}
                >
                  Delete
                </button>
                {order.orderStatus === "PENDING" && (
                  <button onClick={() => goToPayment(order.id)}>
                    Proceed to Payment
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
