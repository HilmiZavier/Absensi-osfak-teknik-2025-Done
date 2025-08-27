import React, { useState } from "react";
import { GraduationCap, Save, CheckCircle, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DataMahasiswa from "../Data/DataMahasiswa";

export default function NimForm() {
  const [nim, setNim] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [result, setResult] = useState();
  const navigate = useNavigate();

  const handleFetch = async (url) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`response status ${response.status}`);
      }

      const result = await response.json();
      // setResult(result)
      return result;
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = async () => {
    const url = `https://absences-pied.vercel.app/api/v1/user/${nim}`;

    if (!nim.trim()) {
      alert("Harap masukkan NIM!");
      return;
    }

    if (!/^\d+$/.test(nim)) {
      alert("NIM hanya boleh berisi angka!");
      return;
    }
    // await handleFetch(url);
    // Cari mahasiswa berdasarkan NIM
    const mahasiswa = await handleFetch(url);
    // const mahasiswa = result
    console.log(mahasiswa);

    if (!mahasiswa) {
      alert("NIM tidak terdaftar!");
      return;
    }

    // ✅ hanya role PIC yang boleh login
    if (mahasiswa.role !== "PIC") {
      alert("Akses ditolak! Hanya PIC yang bisa login.");
      return;
    }

    // Simpan nim login ke localStorage biar bisa dipakai di halaman lain
    localStorage.setItem("nimLogin", nim);

    setShowSuccess(true);
    setNim("");

    // Setelah 2 detik redirect ke halaman scanner
    setTimeout(() => {
      setShowSuccess(false);
      navigate("/"); // 👈 sesuaikan dengan route scanner kamu
    }, 0);
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setNim(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-sky-100 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-white/90 backdrop-blur-sm shadow-2xl border border-sky-200">
        <div className="card-body">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="avatar">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 flex items-center justify-center mb-4 mx-auto">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-sky-800 mb-2">LOGIN</h1>
            <p className="text-sky-600">Masukkan Nomor Induk Mahasiswa Anda</p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-sky-700 font-semibold flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nomor Induk Mahasiswa (NIM)
                </span>
              </label>
              <input
                type="text"
                value={nim}
                onChange={handleInputChange}
                onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Contoh: 202311420023"
                maxLength="15"
                className="input input-bordered w-full bg-sky-50/50 border-sky-300 focus:border-sky-500 focus:bg-white transition-all duration-300 text-sky-900 placeholder-sky-400"
                required
              />
              <label className="label">
                <span className="label-text-alt text-sky-500">
                  Hanya masukkan angka
                </span>
                <span className="label-text-alt text-sky-500">
                  {nim.length}/15
                </span>
              </label>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-primary w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 border-none text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              disabled={!nim.trim()}
            >
              Login
            </button>
          </div>

          {/* Success Alert */}
          {showSuccess && (
            <div className="alert alert-success mt-6 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 animate-pulse">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
              <div>
                <div className="font-semibold text-emerald-800">
                  NIM berhasil login!
                </div>
                <div className="text-sm text-emerald-600">
                  Sedang mengarahkan ke halaman scanner...
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
