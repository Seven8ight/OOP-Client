import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);

  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // ✅ Get orderId and userId from localStorage
  const orderId = localStorage.getItem("paymentOrderId");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id;

  useEffect(() => {
    if (!orderId) {
      setError(true);
      setLoading(false);
      return;
    }

    // ✅ Fetch items and calculate total
    fetch(
      `https://oop-2-production.up.railway.app/api/orders/${orderId}/items`,
      {
        method: "GET",
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load order.");
        return res.json();
      })
      .then((order) => {
        setItems(order);
        const total = Array.isArray(order)
          ? order.reduce(
              (current, accumulator) => (current += accumulator.price),
              0
            )
          : 0;
        setAmount(total); // Assumes totalPrice is on the order
        setLoading(false);
      })
      .catch((_: any) => {
        setError(true);
        setLoading(false);
      });
  }, [orderId]);

  const handlePayment = () => {
    fetch(`https://oop-2-production.up.railway.app/api/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId,
        amount,
        userId,
        branch: user?.branch || "default", // 🧠 Optional fallback
      }),
    })
      .then(async (res) => {
        const result = await res.json();

        if (!res.ok) {
          setErrorMessage(result.error || "Payment failed.");
          setSuccessMessage("");
          return;
        }

        setSuccessMessage(result.message || "Payment successful.");
        setErrorMessage("");

        setTimeout(() => {
          navigate("/orders");
        }, 2000); // Redirect after 2s
      })
      .catch(() => {
        setErrorMessage("Unexpected error occurred during payment.");
        setSuccessMessage("");
      });
  };

  if (loading || error) {
    return (
      <div className={`PaymentPage ${loading ? "loading" : "error"}`}>
        <button className="back-button" onClick={() => navigate(-1)}>
          Back
        </button>
        {loading ? <p>Loading...</p> : <p>Error loading payment info.</p>}
      </div>
    );
  }

  return (
    <div className="PaymentPage">
      <div className="header">
        <h1>Payment</h1>
        <button className="back-button" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
      <div className="details">
        <p>
          Total Due: <strong>KES {amount}</strong>
        </p>
        <div className="item-list">
          <h3>Items in Order:</h3>
          {items.map((item, index) => (
            <div className="item-card" key={index}>
              <p>
                <strong>Product:</strong> {item.productId}
              </p>
              <p>
                <strong>Quantity:</strong> {item.quantity}
              </p>
              <p>
                <strong>Subtotal:</strong> KES {item.price.toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <button className="pay-button" onClick={handlePayment}>
          Pay Now
        </button>
        {successMessage && (
          <div className="popup success">{successMessage}</div>
        )}

        {errorMessage && <div className="popup error">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default Payment;
