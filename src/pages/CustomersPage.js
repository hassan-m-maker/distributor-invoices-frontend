import { useEffect, useState } from "react";
import { getCustomers, deleteCustomer } from "../db";
import CustomerProductsTable from "../components/CustomerProductsTable";
import { useNavigate } from "react-router-dom";
import AddCustomerForm from "../components/AddCustomerForm";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  const refreshCustomers = () => {
    getCustomers().then((data) => setCustomers(data));
  };

  useEffect(() => {
    refreshCustomers();
  }, []);

  if (selectedCustomer) {
    return <CustomerProductsTable customer={selectedCustomer} />;
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
        <AddCustomerForm
          onDone={() => {
            setShowAddForm(false);
            refreshCustomers();
          }}
        />
      ) : (
        <>
          <button onClick={() => setShowAddForm(true)}>➕إضافة الزبائن</button>
          <table>
            <thead>
              <tr>
                <th>الزبائن</th>
                <th>الأفعال</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c, index) => (
                <tr key={c.id || index}>
                  <td>{c.name}</td>
                  <td>
                    <button onClick={() => setSelectedCustomer(c)}>View</button>
                    <button
                      style={{
                        marginLeft: "10px",
                        background: "red",
                        color: "white",
                      }}
                      onClick={async () => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this customer?"
                          )
                        ) {
                          await deleteCustomer(c.id);
                          refreshCustomers();
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
