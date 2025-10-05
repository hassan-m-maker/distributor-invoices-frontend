import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <h1>فواتير الموزّع</h1>
      <div className="oven-buttons-container">
        <button className="oven-button" onClick={() => navigate("/ovens")}>الأفران</button>
        <button className="oven-button" onClick={() => navigate("/customers")}>الزبائن</button>
      </div>
    </div>
  );
}
