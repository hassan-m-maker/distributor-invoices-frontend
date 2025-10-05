import { useEffect, useState } from "react";
import { getInvoices, deleteInvoice } from "../db";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import AmiriRegular from "../fonts/Amiri-Regular.js";

export default function ViewInvoicesTable({ entityType, entityId }) {
  const [invoices, setInvoices] = useState([]);

  const loadInvoices = async () => {
  const all = await getInvoices();

  // Load saved customers and ovens (they’re usually in localStorage)
  const customers = JSON.parse(localStorage.getItem("customers") || "[]");
  const ovens = JSON.parse(localStorage.getItem("ovens") || "[]");

  // Add readable names to each invoice
  const withNames = all.map((inv) => {
    const customer =
      customers.find((c) => c.id === inv.customer_id) || {};
    const oven =
      ovens.find((o) => o.id === inv.oven_id) || {};

    return {
      ...inv,
      customerName: customer.name || inv.customerName || "غير محدد",
      ovenName: oven.name || inv.ovenName || "غير محدد",
    };
  });

  const filtered = withNames.filter(
    (inv) =>
      (entityType === "customer" && inv.customer_id === entityId) ||
      (entityType === "oven" && inv.oven_id === entityId)
  );

  setInvoices(filtered);
};


  useEffect(() => {
    loadInvoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityType, entityId]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("هل أنت متأكد أنك تريد حذف هذه الفاتورة؟");
    if (!confirmDelete) return;
    try {
      await deleteInvoice(Number(id));
      await new Promise((r) => setTimeout(r, 150));
      await loadInvoices();
    } catch (err) {
      console.error("Failed to delete invoice:", err);
    }
  };

  // ---------- PDF generation using browser rendering (html2canvas) ----------
  const generateInvoicePDF = async (inv) => {
    try {
      // 1) Load Amiri font if not loaded
      try {
        if (typeof document !== "undefined" && AmiriRegular && !document.fonts.check('1em "Amiri"')) {
          const fontDataUrl = `data:font/truetype;base64,${AmiriRegular}`;
          const fontFace = new FontFace("Amiri", `url(${fontDataUrl})`);
          await fontFace.load();
          document.fonts.add(fontFace);
          await new Promise((res) => setTimeout(res, 50));
        }
      } catch (err) {
        console.warn("Failed to load Amiri font via FontFace:", err);
      }

      // ✅ Ensure oven name always appears (but never the ID)
      const ovenName =
        inv.ovenName ||
        inv.oven?.name ||
        "غير محدد";

      const subtotal = inv.items.reduce(
        (sum, i) => sum + parseFloat(i.price) * parseFloat(i.quantity),
        0
      );

      // Create hidden element for rendering
      const container = document.createElement("div");
      container.style.direction = "rtl";
      container.style.fontFamily = "'Amiri', serif";
      container.style.background = "#ffffff";
      container.style.padding = "20px";
      container.style.width = "780px";
      container.style.color = "#3b2d26";
      container.style.boxSizing = "border-box";
      container.style.fontSize = "14px";
      container.style.lineHeight = "1.3";
      container.style.position = "fixed";
      container.style.left = "-9999px";

      // ---------- HTML layout ----------
      container.innerHTML = `
        <div style="width:100%; padding:0; margin:0;">
          <div style="text-align: right; margin-bottom: 12px;">
            <div style="font-size:22px; color: var(--primary-dark, #4e342e); font-weight:700; margin-bottom:6px;">فاتورة</div>
            <div style="color: var(--primary, #6d4c41); font-size:13px;">
              <div>الزبون: ${inv.customerName || "غير محدد"}</div>
              <div>الفرن: ${ovenName}</div>
              <div>التاريخ: ${
                inv.created_at
                  ? new Date(inv.created_at).toLocaleString("ar-LB")
                  : new Date().toLocaleString("ar-LB")
              }</div>
            </div>
          </div>

          <table style="width:100%; border-collapse:collapse; font-size:13px; border: 1px solid rgba(0,0,0,0.06);">
            <thead>
              <tr style="background: #6d4c41; color: #fff;">
                <th style="padding:10px; border:1px solid #e0d6cf;">المنتج</th>
                <th style="padding:10px; border:1px solid #e0d6cf;">الكمية</th>
                <th style="padding:10px; border:1px solid #e0d6cf;">الوحدة</th>
                <th style="padding:10px; border:1px solid #e0d6cf;">السعر</th>
                <th style="padding:10px; border:1px solid #e0d6cf;">المجموع</th>
              </tr>
            </thead>
            <tbody>
              ${inv.items
                .map(
                  (item) => `
                <tr>
                  <td style="padding:8px; border:1px solid #e0d6cf;">${item.product?.name || item.name}</td>
                  <td style="padding:8px; border:1px solid #e0d6cf; text-align:center;">${item.quantity}</td>
                  <td style="padding:8px; border:1px solid #e0d6cf; text-align:center;">${item.product?.unit || item.unit || ""}</td>
                  <td style="padding:8px; border:1px solid #e0d6cf; text-align:center;">${Number(item.price).toLocaleString()} ل.ل</td>
                  <td style="padding:8px; border:1px solid #e0d6cf; text-align:center;">${(item.price * item.quantity).toLocaleString()} ل.ل</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div style="margin-top:14px; text-align:right;">
            <div style="display:inline-block; padding:8px 12px; background:#6d4c41; color:#fff; border-radius:6px; font-weight:700;">
              الإجمالي: ${subtotal.toLocaleString()} ل.ل
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(container);

      // Render with html2canvas (browser keeps Arabic shaping)
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      // Convert to PDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      const fileName = `فاتورة_${inv.customerName || "زبون"}_${inv.id}.pdf`;
      pdf.save(fileName);

      // Cleanup
      document.body.removeChild(container);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("فشل إنشاء ملف PDF — انظر وحدة التحكم للمزيد من التفاصيل.");
    }
  };

  // ---------- UI rendering ----------
  return (
    <div className="invoices-container">
      {invoices.length === 0 ? (
        <p className="no-invoices">لا توجد فواتير.</p>
      ) : (
        invoices.map((inv) => {
          const subtotal = inv.items.reduce(
            (sum, i) => sum + parseFloat(i.price) * parseFloat(i.quantity),
            0
          );

          const ovenName =
            inv.ovenName ||
            inv.oven?.name ||
            "غير محدد";

          return (
            <div key={inv.id} className="invoice-card">
              <div className="invoice-header">
                <h3>🧾 فاتورة رقم {inv.id}</h3>
                <p>
                  {new Date(inv.created_at).toLocaleDateString("ar-LB")} — 👤{" "}
                  {inv.customerName || "غير محدد"} | {ovenName}
                </p>
              </div>

              <table className="invoice-items">
                <thead>
                  <tr>
                    <th>المنتج</th>
                    <th>الكمية</th>
                    <th>الوحدة</th>
                    <th>السعر</th>
                    <th>المجموع</th>
                  </tr>
                </thead>
                <tbody>
                  {inv.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.product?.name || item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.product?.unit || item.unit || ""}</td>
                      <td>{Number(item.price).toLocaleString()} ل.ل</td>
                      <td>
                        {(parseFloat(item.quantity) * parseFloat(item.price)).toLocaleString()} ل.ل
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="4" className="invoice-total-label">
                      الإجمالي:
                    </td>
                    <td className="invoice-total-value">{subtotal.toLocaleString()} ل.ل</td>
                  </tr>
                </tfoot>
              </table>

              <div className="invoice-actions">
                <button className="delete-btn" onClick={() => handleDelete(inv.id)}>
                  🗑️ حذف
                </button>
                <button className="whatsapp-btn" onClick={() => generateInvoicePDF(inv)}>
                  📤 حفظ / إرسال عبر واتساب
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
