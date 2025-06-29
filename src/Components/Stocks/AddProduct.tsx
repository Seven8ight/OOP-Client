// src/Components/Products/AddProduct.tsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const { branchId } = useParams();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const productData = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity),
      branchId, // ✅ Use route param
    };

    try {
      const res = await fetch(
        "https://oop-2-production.up.railway.app/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        }
      );

      if (!res.ok) throw new Error("Failed to add product.");

      setSuccess("Product added successfully.");
      setTimeout(
        () =>
          navigate(
            branchId == "e7e47915-2547-4347-83ee-52bf81072d68"
              ? "/management/admin"
              : `/management/branch/${branchId}`
          ),
        1500
      );
    } catch (err) {
      setError("Failed to add product. Please try again.");
    }
  };

  return (
    <div className="AddProductPage">
      <div className="form-card">
        <h2>Add New Product</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price (Ksh)"
            value={form.price}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={form.quantity}
            onChange={handleChange}
            required
          />

          <button type="submit">Add Product</button>
        </form>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </div>
    </div>
  );
};

export default AddProduct;
