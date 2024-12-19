import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../../styles/profile/Change.css';
const baseURL = process.env.REACT_APP_BASE_URL;
axios.defaults.baseURL = `${baseURL}/authen`;

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_new_password: "",
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedAccessToken = sessionStorage.getItem("accessToken");

    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const toggleShowPassword = (passwordType) => {
    switch (passwordType) {
      case "old_password":
        setShowOldPassword(!showOldPassword);
        break;
      case "new_password":
        setShowNewPassword(!showNewPassword);
        break;
      case "confirm_new_password":
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        "/change/",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("Răspuns de la server:", response.data);
      // setMessage("Password changed successfully!");
      setError("");
      navigate('/');
    } catch (error) {
      console.error("Eroare de la server:", error.response.data);
      setMessage("");
      setError(error.response.data[0] || "An error occurred.");
    }
  };

  return (
    <div className="custom-div-c">
      <form onSubmit={handleSubmit} className="custom-form-c">
        <div className="input-wrapper">
          <label className="inputlabel">Parola veche</label>
          <input
            type={showOldPassword ? "text" : "password"}
            name="old_password"
            placeholder="Parola veche"
            value={formData.old_password}
            onChange={handleChange}
            required
            className="input-element"
          />
          <span
            className={`password-togglee ${showOldPassword ? "active" : ""}`}
            onClick={() => toggleShowPassword("old_password")}
          >
            {showOldPassword ? "👁" : "👁"}
          </span>

        </div>
        <div className="input-wrapper">
          <label className="inputlabel">Parolă Nouă</label>
          <input
            type={showNewPassword ? "text" : "password"}
            name="new_password"
            placeholder="Parolă Nouă"
            value={formData.new_password}
            onChange={handleChange}
            required
            className="input-element"
          />
          <span
            className={`password-togglee ${showNewPassword ? "active" : ""}`}
            onClick={() => toggleShowPassword("new_password")}
          >
            {showNewPassword ? "👁" : "👁"}
          </span>

        </div>
        <div className="input-wrapper">
          <label className="inputlabel">Confirmă noua parolă</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirm_new_password"
            placeholder="Confirmă parola"
            value={formData.confirm_new_password}
            onChange={handleChange}
            required
            className="input-element"
          />
          <span
            className={`password-togglee ${showConfirmPassword ? "active" : ""}`}
            onClick={() => toggleShowPassword("confirm_new_password")}
          >
            {showConfirmPassword ? "👁" : "👁"}
          </span>

        </div>
        <button type="submit" className="submit-button">Confirmă</button>
        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default ChangePassword;
