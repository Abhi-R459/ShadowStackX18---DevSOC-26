import React, { useState } from "react";
import { auth } from "../services/firebase";

const AgentDashboard = () => {
  const [status, setStatus] = useState("");

  const handleUpload = async (file) => {
    if (!file) return;

    // Ensure user is authenticated
    const user = auth.currentUser;
    if (!user) {
      setStatus("Please log in first.");
      return;
    }

    setStatus("Uploading...");

    try {
      const token = await user.getIdToken();
      const formData = new FormData();
      formData.append("audio", file);

      const response = await fetch("http://localhost:5000/api/agent/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setStatus(`Upload complete. Call ID: ${data.callId}`);
      } else {
        setStatus("Upload failed.");
      }
    } catch (error) {
      console.error(error);
      setStatus("Error uploading file.");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4 mt-10">
      <h1 className="text-2xl font-bold text-slate-900">Agent Dashboard</h1>
      <p className="text-slate-500">Upload a call recording for analysis.</p>
      
      <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => handleUpload(e.target.files[0])}
          className="block w-full text-sm text-slate-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>
      
      {status && (
        <div className={`p-4 rounded ${status.includes("Error") || status.includes("failed") || status.includes("Please") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {status}
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;