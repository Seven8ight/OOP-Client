// src/Components/Stocks/Products.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

interface Product {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
}

const Products: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch(`https://oop-2-production.up.railway.app/api/products/branch/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setProducts(data);
      })
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);

  return (
    <div className="ProductsPage">
      <div className="header">
        <h1>Available Products</h1>
        <button
          className="back-button"
          onClick={() => (window.location.href = "/global")}
        >
          ← Back
        </button>
      </div>
      <div className="product-grid">
        {products &&
          products.map((product) => (
            <div className="product-card" key={product.id}>
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p>
                <strong>Price:</strong> ${product.price.toFixed(2)}
              </p>
              <p>
                <strong>In Stock:</strong> {product.quantity}
              </p>
            </div>
          ))}
        {products.length <= 0 && (
          <div id="empty">
            <p>No items available in this branch</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
