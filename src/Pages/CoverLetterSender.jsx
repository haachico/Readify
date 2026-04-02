import React, { useState } from "react";
import "./CoverLetterSender.css";

export default function CoverLetterSender() {
  const [formData, setFormData] = useState({
    recipientEmail: "",
    companyName: "",
    positionName: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.recipientEmail ||
      !formData.companyName ||
      !formData.positionName
    ) {
      setMessage({ type: "error", text: "❌ Please fill all fields" });
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/xyzab2025/send-cover-letter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "✅ " + data.message });
        setFormData({
          recipientEmail: "",
          companyName: "",
          positionName: "",
        });
      } else {
        setMessage({
          type: "error",
          text: "❌ " + (data.message || "Failed to send"),
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "❌ Error: " + error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cover-letter-container">
      <div className="cover-letter-box">
        <h1>📧 Cover Letter Sender</h1>
        <p className="subtitle">
          Send your cover letter to HR emails for job applications
        </p>

        <form onSubmit={handleSubmit} className="cover-letter-form">
          <div className="form-group">
            <label htmlFor="recipientEmail">HR Email Address *</label>
            <input
              type="email"
              id="recipientEmail"
              name="recipientEmail"
              placeholder="hr@company.com"
              value={formData.recipientEmail}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="companyName">Company Name *</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              placeholder="e.g., Google, Microsoft, Amazon"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="positionName">Position Name *</label>
            <input
              type="text"
              id="positionName"
              name="positionName"
              placeholder="e.g., Full Stack Developer, Software Engineer"
              value={formData.positionName}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? (
              <>
                <span className="spinner"></span> Sending...
              </>
            ) : (
              "Send Cover Letter"
            )}
          </button>

          {message && (
            <div className={`message ${message.type}`}>{message.text}</div>
          )}
        </form>
      </div>
    </div>
  );
}
