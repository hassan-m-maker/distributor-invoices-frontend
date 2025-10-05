import { useState } from "react";
import { addOven } from "../db";

export default function AddOvenForm({ onDone }) {
  const [ovenName, setOvenName] = useState("");
  const [products, setProducts] = useState([{ name: "", unit: "" }]);

  const handleProductChange = (index, field, value) => {
    const updated = [...products];
    updated[index][field] = value;
    setProducts(updated);
  };

  const addProductRow = () => {
    setProducts([...products, { name: "", unit: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ovenName.trim()) return alert("الرجاء إدخال اسم الفرن");
    const validProducts = products.filter((p) => p.name.trim() !== "");
    await addOven({ name: ovenName, products: validProducts });
    alert("✅ تم إضافة الفرن بنجاح!");
    setOvenName("");
    setProducts([{ name: "", unit: "" }]);
    if (onDone) onDone();
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        direction: "rtl",
        maxWidth: "500px",
        margin: "40px auto",
        backgroundColor: "#f9f5f3",
        padding: "25px 30px",
        borderRadius: "12px",
        boxShadow: "0px 3px 8px rgba(0,0,0,0.15)",
        textAlign: "center",
        fontFamily: "'Amiri', sans-serif",
      }}
    >
      <h2 style={{ color: "#4e342e", marginBottom: "20px" }}>إضافة فرن جديد</h2>

      <div style={{ marginBottom: "20px", textAlign: "right" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          اسم الفرن:
        </label>
        <input
          type="text"
          placeholder="أدخل اسم الفرن"
          value={ovenName}
          onChange={(e) => setOvenName(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            textAlign: "right",
          }}
        />
      </div>

      <h3 style={{ color: "#6d4c41", marginBottom: "10px" }}>البضاعة</h3>

      {products.map((p, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <input
            type="text"
            placeholder="اسم البضاعة"
            value={p.name}
            onChange={(e) => handleProductChange(idx, "name", e.target.value)}
            style={{
              flex: 2,
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              textAlign: "right",
            }}
          />
          <input
            type="text"
            placeholder="الوحدة (مثلاً ربطة، قطعة)"
            value={p.unit}
            onChange={(e) => handleProductChange(idx, "unit", e.target.value)}
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              textAlign: "center",
            }}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addProductRow}
        style={{
          backgroundColor: "#6d4c41",
          color: "white",
          border: "none",
          borderRadius: "6px",
          padding: "8px 16px",
          cursor: "pointer",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        ➕ إضافة بضاعة
      </button>

      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <button
          type="submit"
          style={{
            backgroundColor: "#4e342e",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "10px 20px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          💾 حفظ الفرن
        </button>
        <button
          type="button"
          onClick={onDone}
          style={{
            backgroundColor: "#ccc",
            border: "none",
            borderRadius: "6px",
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          إلغاء
        </button>
      </div>
    </form>
  );
}
