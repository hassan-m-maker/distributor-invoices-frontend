import { useState, useEffect } from "react";
import ViewInvoicesTable from "./ViewInvoicesTable";
import { useNavigate } from "react-router-dom";
import { getOvens, addInvoice } from "../db";

export default function CustomerProductsTable({ customer }) {
  const [quantity, setQuantity] = useState({});
  const [products, setProducts] = useState([]);
  const [showInvoices, setShowInvoices] = useState(false);
  const navigate = useNavigate();
  const [price, setPrice] = useState({});

  useEffect(() => {
    // Load all ovens' products as the customer's available products
    getOvens().then((ovens) => {
      let allProducts = [];
      ovens.forEach((o) => {
        if (o.products) {
          allProducts = [...allProducts, ...o.products];
        }
      });
      setProducts(allProducts);
    });
  }, [customer.id]);

  const handlePriceChange = (id, value) => {
    setPrice((prev) => ({ ...prev, [id]: value }));
  };

  const handleQuantityChange = (id, value) => {
    setQuantity((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    const items = products
      .map((p, idx) => ({
        product_id: idx + 1,
        product: p,
        price: price[idx + 1] || 0,
        quantity: quantity[idx + 1] || 0,
      }))
      .filter((i) => i.quantity > 0);

    const invoice = {
      id: Date.now(),
      customer_id: customer.id,
      customerName: customer.name || "غير محدد",
      items,
      created_at: new Date().toISOString(),
    };

    await addInvoice(invoice);
    alert("✅ تم حفظ الفاتورة بنجاح!");

    setQuantity({});
    setPrice({});
  };

  const subtotal = products
    .reduce((sum, p, idx) => {
      return sum + (price[idx + 1] || 0) * (quantity[idx + 1] || 0);
    }, 0)
    .toFixed(2);

  if (showInvoices)
    return <ViewInvoicesTable entityType="customer" entityId={customer.id} />;

  return (
    <div style={{ direction: "rtl", fontFamily: "Amiri, sans-serif" }}>
      <h2
        style={{
          textAlign: "center",
          color: "var(--primary-dark)",
          marginTop: "15px",
        }}
      >
        منتجات الزبون: {customer.name}
      </h2>

      <table
        style={{
          width: "90%",
          margin: "20px auto",
          borderCollapse: "collapse",
          backgroundColor: "white",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <thead style={{ backgroundColor: "var(--primary)", color: "white" }}>
          <tr>
            <th style={{ padding: "12px" }}>المنتج</th>
            <th style={{ padding: "12px" }}>الوحدة</th>
            <th style={{ padding: "12px" }}>السعر</th>
            <th style={{ padding: "12px" }}>الكمية</th>
            <th style={{ padding: "12px" }}>الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, idx) => (
            <tr key={idx}>
              <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                {p.name}
              </td>
              <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                {p.unit}
              </td>
              <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price[idx + 1] || ""}
                  onChange={(e) =>
                    handlePriceChange(idx + 1, parseFloat(e.target.value) || 0)
                  }
                  style={{
                    width: "80px",
                    padding: "5px",
                    textAlign: "center",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
              </td>
              <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                <input
                  type="number"
                  min="0"
                  value={quantity[idx + 1] || ""}
                  onChange={(e) =>
                    handleQuantityChange(
                      idx + 1,
                      parseInt(e.target.value) || 0
                    )
                  }
                  style={{
                    width: "80px",
                    padding: "5px",
                    textAlign: "center",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
              </td>
              <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                {(
                  (price[idx + 1] || 0) * (quantity[idx + 1] || 0)
                ).toLocaleString()}{" "}
                ل.ل
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ---------- Footer Section ---------- */}
      <div
        className="invoice-actions"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
          marginTop: "20px",
        }}
      >
        {/* Summary + Save */}
        <div
          className="invoice-summary"
          style={{
            width: "90%",
            textAlign: "center",
            backgroundColor: "#f9f5f3",
            padding: "15px",
            borderRadius: "8px",
            boxShadow: "0px 3px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ marginBottom: "10px" }}>الإجمالي: {subtotal} ل.ل</h3>
          <button
            className="submit-btn"
            onClick={handleSubmit}
            style={{
              backgroundColor: "var(--primary)",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            💾 حفظ الفاتورة
          </button>
        </div>

        {/* View + Back buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "90%",
            gap: "10px",
          }}
        >
          <button
            className="view-invoices-btn"
            onClick={() => setShowInvoices(true)}
            style={{
              flex: 1,
              backgroundColor: "#6d4c41",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "10px 20px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            🧾 عرض الفواتير
          </button>

          <button
            onClick={() => navigate(-1)}
            className="back-btn"
            style={{
              flex: 1,
              backgroundColor: "#8d6e63",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "10px 20px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ⬅ رجوع
          </button>
        </div>
      </div>
    </div>
  );
}
