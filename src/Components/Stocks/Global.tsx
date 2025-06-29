// src/Components/Stocks/Global.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface Product {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  branchId: string;
}

const branches = [
  { id: "e7e47915-2547-4347-83ee-52bf81072d68", name: "Nairobi" },
  { id: "ba2ca26e-9b6e-4495-a514-1043b2d88f24", name: "Machakos" },
  { id: "cf64d5fd-8422-474e-8b9f-f61ac77b8ae0", name: "Mombasa" },
  { id: "133ea6d2-44de-4149-9896-43e308874f79", name: "Kisumu" },
];

const GlobalProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const branchFinder = (id: string) =>
    branches.find((branch) => branch.id == id);

  useEffect(() => {
    fetch("https://oop-2-production.up.railway.app/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch global products");
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="GlobalProducts loading">
        <button className="back-button" onClick={() => navigate(`/`)}>
          ← Back
        </button>
        <p>Loading global products...</p>
      </div>
    );

  if (error)
    return (
      <div className="GlobalProducts error">
        <button className="back-button" onClick={() => navigate(`/`)}>
          ← Back
        </button>
        <p>{error}</p>
      </div>
    );

  return (
    <div className="GlobalProducts">
      <div className="sidebar">
        <h2>Branches</h2>
        <ul>
          {branches.map((branch) => (
            <li
              key={branch.id}
              onClick={() => navigate(`/products/${branch.id}`)}
            >
              {branch.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="content">
        <div className="header">
          <h1>All Products Across Branches</h1>
          <button className="back-button" onClick={() => navigate(`/`)}>
            ← Back
          </button>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <h3>{product.name}</h3>
              <p className="branch">
                Branch: {branchFinder(product.branchId)?.name}
              </p>
              <p>{product.description}</p>
              <p>Stock: {product.quantity}</p>
              <p>Price: ${product.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GlobalProducts;
