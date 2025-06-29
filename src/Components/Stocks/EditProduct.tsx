import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

const EditProduct: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.role.toLowerCase() !== "admin") {
      setIsAdmin(false);
      setError("You must be an admin to edit products.");
      setLoading(false);
      return;
    }
    setIsAdmin(true);

    fetch(`https://oop-2-production.up.railway.app/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found.");
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct(
      (prev) =>
        prev && {
          ...prev,
          [name]:
            name === "price" || name === "quantity" ? Number(value) : value,
        }
    );
  };

  const handleSubmit = async () => {
    if (!product) return;

    try {
      const res = await fetch(
        `https://oop-2-production.up.railway.app/api/products/${product.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(product),
        }
      );

      if (!res.ok) {
        const result = await res.text();
        throw new Error(result);
      }

      alert("Product updated successfully.");
      navigate("/products");
    } catch (err: any) {
      alert(err.message || "Failed to update product.");
    }
  };

  if (loading) return <div className="EditProductPage">Loading...</div>;
  if (!isAdmin)
    return (
      <div className="EditProductPage error">
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>← Back</button>
      </div>
    );

  return (
    <div className="EditProductPage">
      <h1>Edit Product</h1>
      <div className="form">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={product?.name || ""}
          onChange={handleChange}
        />

        <label>Description</label>
        <textarea
          name="description"
          value={product?.description || ""}
          onChange={handleChange}
        />

        <label>Price</label>
        <input
          type="number"
          name="price"
          value={product?.price || 0}
          onChange={handleChange}
        />

        <label>Quantity</label>
        <input
          type="number"
          name="quantity"
          value={product?.quantity || 0}
          onChange={handleChange}
        />

        <button className="submit-btn" onClick={handleSubmit}>
          Save Changes
        </button>
        <button className="cancel-btn" onClick={() => navigate("/global")}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditProduct;
