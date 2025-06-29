import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

interface Product {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
}

const ProductPage: React.FC = () => {
  const { id } = useParams();
  const navigation = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<{ id: string; role: string } | null>(null);

  useEffect(() => {
    const userObj = JSON.parse(localStorage.getItem("user") || "{}");
    if (userObj?.id) setUser(userObj);

    fetch(`https://oop-2-production.up.railway.app/api/products/${id}`, {
      method: "GET",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleAddToOrder = async () => {
    const orderId = localStorage.getItem("currentOrderId");
    if (!orderId) return alert("No order selected.");

    if (!product) return;
    if (quantity < 1 || quantity > product.quantity) {
      return alert(
        `Please select a quantity between 1 and ${product.quantity}`
      );
    }

    try {
      const response = await fetch(
        `https://oop-2-production.up.railway.app/api/orders/${orderId}/items`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([{ productId: product.id, quantity }]),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result);

      alert("Product added to order.");
    } catch (err) {
      alert("Failed to add to order.");
    }
  };

  const requireAdmin = (action: () => void) => {
    if (user?.role.toLowerCase() !== "admin") {
      return alert("You must be an admin to perform this action.");
    } else navigation(`/management/product/${id}`);

    action();
  };

  const handleEdit = () => {
    requireAdmin(() => {
      alert("Redirect to edit page or show edit modal...");
    });
  };

  const handleDelete = async () => {
    requireAdmin(async () => {
      if (!window.confirm("Are you sure you want to delete this product?"))
        return;

      try {
        const res = await fetch(
          `https://oop-2-production.up.railway.app/api/products/${id}`,
          {
            method: "DELETE",
          }
        );

        if (!res.ok) throw new Error("Failed to delete");

        alert("Product deleted.");
        window.location.href = "/global";
      } catch (err) {
        alert("Error deleting product.");
      }
    });
  };

  if (loading)
    return (
      <div className="ProductPage loading">
        <button onClick={() => (window.location.href = "/global")}>
          ← Back to Products
        </button>
        <p>Loading product details...</p>
      </div>
    );

  if (error)
    return (
      <div className="ProductPage error">
        <button onClick={() => (window.location.href = "/global")}>
          ← Back to Products
        </button>
        <p>{error}</p>
      </div>
    );

  if (!product) return null;

  return (
    <div className="ProductPage">
      <div className="product-details">
        <button
          className="back-button"
          onClick={() => (window.location.href = "/global")}
        >
          ← Back to Products
        </button>

        <h1>{product.name}</h1>
        <p className="description">{product.description}</p>
        <p>
          <strong>Price:</strong> ${product.price.toFixed(2)}
        </p>
        <p>
          <strong>Available Stock:</strong> {product.quantity}
        </p>

        <label htmlFor="quantity">
          <strong>Quantity:</strong>
        </label>
        <input
          type="number"
          id="quantity"
          min={1}
          max={product.quantity}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="quantity-input"
        />
        <br />
        <button className="add-to-order" onClick={handleAddToOrder}>
          Add to Current Order
        </button>
        <button className="edit-button" onClick={handleEdit}>
          Edit Product
        </button>
        <button className="delete-button" onClick={handleDelete}>
          Delete Product
        </button>
      </div>
    </div>
  );
};

export default ProductPage;
