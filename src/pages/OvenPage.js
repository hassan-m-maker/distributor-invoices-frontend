import { useEffect, useState } from "react";
import { getOvens, deleteOven } from "../db";
import OvenProductsTable from "../components/OvenProductsTable";
import { useNavigate } from "react-router-dom";
import AddOvenForm from "../components/AddOvenForm";

export default function OvenPage() {
  const [ovens, setOvens] = useState([]);
  const [selectedOven, setSelectedOven] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  const refreshOvens = () => {
    getOvens().then(data => setOvens(data));
  };

  useEffect(() => {
    refreshOvens();
  }, []);

  if (selectedOven) {
    return <OvenProductsTable oven={selectedOven} />;
  }

  return (
    <div>
      <div className="navbar">
        <button onClick={() => navigate("/")}>Home</button>
      </div>
      <div className="navigation-arrows">
        <button onClick={() => navigate(-1)}>⬅ Back</button>
      </div>

      {showAddForm ? (
        <AddOvenForm onDone={() => { setShowAddForm(false); refreshOvens(); }} />
      ) : (
        <>
          <button onClick={() => setShowAddForm(true)}>➕إضافة فرن</button>
          <table>
            <thead>
              <tr><th>الأفران</th><th>الأفعال</th></tr>
            </thead>
            <tbody>
              {ovens.map((o, index) => (
                <tr key={o.id || index}>
                  <td>{o.name}</td>
                  <td>
                    <button onClick={() => setSelectedOven(o)}>View</button>
                    <button
                      style={{ marginLeft: "10px", background: "red", color: "white" }}
                      onClick={async () => {
                        if (window.confirm("Are you sure you want to delete this oven?")) {
                          await deleteOven(o.id);
                          refreshOvens();
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
