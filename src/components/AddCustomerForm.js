import { useState } from "react";
import { addCustomer } from "../db";

export default function AddCustomerForm({ onDone }) {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("الرجاء إدخال اسم الزبون");
    await addCustomer({ name });
    alert("✅ تم إضافة الزبون بنجاح!");
    setName("");
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
      <h2 style={{ color: "#4e342e", marginBottom: "20px" }}>
        إضافة زبون جديد
      </h2>

      <div style={{ marginBottom: "20px", textAlign: "right" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          اسم الزبون:
        </label>
        <input
          type="text"
          placeholder="أدخل اسم الزبون"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            textAlign: "right",
          }}
        />
      </div>

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
          💾 حفظ الزبون
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
