import React, { useState } from "react";
import { GraduationCap, Save, CheckCircle, User } from "lucide-react";

export default function NimForm() {
  const [nim, setNim] = useState("");
  const [storedNim, setStoredNim] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    if (!nim.trim()) {
      alert("Harap masukkan NIM!");
      return;
    }

    if (!/^\d+$/.test(nim)) {
      alert("NIM hanya boleh berisi angka!");
      return;
    }

    // Simpan ke state (pengganti sessionStorage)
    setStoredNim(nim);
    setTimestamp(new Date().toLocaleString("id-ID"));
    setShowSuccess(true);

    // Reset form
    setNim("");

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const handleInputChange = (e) => {
    // Hanya terima input angka
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
            <h1 className="text-3xl font-bold text-sky-800 mb-2">
              Form Input NIM
            </h1>
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
              <div className="relative">
                <input
                  type="text"
                  value={nim}
                  onChange={handleInputChange}
                  onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="Contoh: 2023110001"
                  maxLength="15"
                  className="input input-bordered w-full bg-sky-50/50 border-sky-300 focus:border-sky-500 focus:bg-white transition-all duration-300 text-sky-900 placeholder-sky-400"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></div>
                </div>
              </div>
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
              <Save className="w-5 h-5 mr-2" />
              Simpan NIM
            </button>
          </div>

          {/* Success Alert */}
          {showSuccess && (
            <div className="alert alert-success mt-6 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 animate-pulse">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
              <div>
                <div className="font-semibold text-emerald-800">
                  NIM berhasil disimpan!
                </div>
                <div className="text-sm text-emerald-600">
                  Data Anda telah tersimpan dengan aman
                </div>
              </div>
            </div>
          )}

          {/* Stored Data Display */}
          {storedNim && (
            <div className="card bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 mt-6">
              <div className="card-body p-4">
                <h3 className="card-title text-sky-800 text-lg">
                  Data Tersimpan
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sky-600 font-medium">NIM:</span>
                    <span className="text-sky-900 font-bold text-lg">
                      {storedNim}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sky-600 font-medium">Disimpan:</span>
                    <span className="text-sky-700 text-sm">{timestamp}</span>
                  </div>
                </div>
                <div className="badge badge-outline badge-info mt-3">
                  Tersimpan dalam sesi
                </div>
              </div>
            </div>
          )}

          {/* Info Card */}
          <div className="card bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200 mt-4">
            <div className="card-body p-4">
              <div className="text-center">
                <div className="text-blue-600 text-sm">
                  <strong>💡 Info:</strong> Data NIM akan tersimpan selama sesi
                  browser berlangsung
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
