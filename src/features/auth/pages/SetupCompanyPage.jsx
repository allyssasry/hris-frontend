import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import illustration from "@/assets/images/auth/setup.png";
import "@/features/auth/pages/setupCompany.css";

const SetupCompanyPage = () => {
  const [companyName, setCompanyName] = useState("");
  const navigate = useNavigate();

  // 🔥 VALIDASI SESSION SAAT PAGE LOAD
  useEffect(() => {
    const rawUserId = localStorage.getItem("signupUserId");

    if (!rawUserId || rawUserId === "undefined") {
      alert("Invalid user session, please sign up again");
      navigate("/auth/sign-up");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const rawUserId = localStorage.getItem("signupUserId");
    const userId = Number(rawUserId);

    console.log("SETUP SUBMIT:", { companyName, rawUserId, userId });

    if (!companyName) {
      alert("Company name is required");
      return;
    }

    if (!userId || Number.isNaN(userId)) {
      alert("Invalid user session, please sign up again");
      navigate("/auth/sign-up");
      return;
    }

    try {
      await api.post("/company/setup", {
        name: companyName,
        userId: userId, // ⬅️ INI YANG SEBELUMNYA TIDAK TERKIRIM
      });

      // setup sukses → login
      localStorage.removeItem("signupUserId");
      navigate("/auth/sign-in");
    } catch (err) {
      console.error("SETUP COMPANY ERROR:", err.response?.data || err);
      alert(err.response?.data?.message || "Setup company failed");
    }
  };

  return (
    <div className="setup-company-container">
      <div className="setup-company-left">
        <img src={illustration} alt="Setup Company" />
      </div>

      <div className="setup-company-right">
        <h1>One More Step!</h1>
        <p className="description">
          Enter your company name to
          <br />
          finish setting up your HRIS workspace.
        </p>

        <form onSubmit={handleSubmit}>
          <label>Company Name</label>
          <input
            type="text"
            placeholder="Enter your company"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />

          <button type="submit">FINISH</button>
        </form>
      </div>
    </div>
  );
};

export default SetupCompanyPage;
