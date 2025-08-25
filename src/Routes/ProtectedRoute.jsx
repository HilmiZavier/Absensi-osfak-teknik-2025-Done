import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const nimLogin = localStorage.getItem("nimLogin");

  if (!nimLogin) {
    // 🚫 Belum login, lempar ke halaman login
    return <Navigate to="/login" replace />;
  }

  // ✅ Sudah login, tampilkan halaman tujuan
  return children;
}
