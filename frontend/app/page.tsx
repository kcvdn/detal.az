"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001")
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setProducts(data);
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Detallar</h1>

      {products.map((p) => (
        <div key={p.id} style={{ marginTop: "10px" }}>
          {p.name} - {p.price} AZN
        </div>
      ))}
    </div>
  );
}