import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { QrCode, Scan, Users, Menu, X, LogOut } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentPage =
    location.pathname === "/"
      ? "scanner"
      : location.pathname === "/DataMahasiswa"
      ? "data"
      : "scanner";

  const handleNavigate = (page) => {
    if (page === "scanner") navigate("/");
    if (page === "data") navigate("/DataMahasiswa");
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    -(
      // contoh: hapus token dari localStorage
      (-localStorage.removeItem("token"))
    );
    -navigate("/login"); // arahkan ke halaman login
    -setMobileMenuOpen(false);
    +(
      // Hapus nim login dari localStorage
      (+localStorage.removeItem("nimLogin"))
    );
    +(+(
      // Kalau kamu nanti juga pakai token, bisa tambahin removeItem("token")
      (+(+(
        // Arahkan ke halaman login
        (+navigate("/login"))
      )))
    ));
    +(+(
      // Tutup menu mobile kalau terbuka
      (+setMobileMenuOpen(false))
    ));
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg sticky top-0 z-50">
        <div className="px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="bg-white/20 p-2 rounded-full">
                <QrCode className="text-white w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div className="text-white leading-tight">
                <h1 className="font-bold text-sm sm:text-lg lg:text-xl">
                  Absensi Digital MABA
                </h1>
                <p className="text-[10px] sm:text-xs text-blue-100 hidden sm:block">
                  Orientasi Fakultas Teknik 2025
                </p>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
              <button
                className={`px-3 lg:px-4 py-2 rounded-lg font-medium flex items-center space-x-2 ${
                  currentPage === "scanner"
                    ? "bg-white/20 text-white shadow-lg"
                    : "text-blue-100 hover:text-white hover:bg-white/10"
                }`}
                onClick={() => handleNavigate("scanner")}
              >
                <Scan size={16} />
                <span>Scanner</span>
              </button>
              <button
                className={`px-3 lg:px-4 py-2 rounded-lg font-medium flex items-center space-x-2 ${
                  currentPage === "data"
                    ? "bg-white/20 text-white shadow-lg"
                    : "text-blue-100 hover:text-white hover:bg-white/10"
                }`}
                onClick={() => handleNavigate("data")}
              >
                <Users size={16} />
                <span>Data Mahasiswa</span>
              </button>
              <div className="bg-yellow-400 text-gray-800 px-3 py-1 rounded-full text-xs font-medium ml-2">
                OFT 2025
              </div>

              {/* Logout Button */}
              <button
                className="px-3 lg:px-4 py-2 rounded-lg font-medium flex items-center space-x-2 text-red-200 hover:text-white hover:bg-red-500/20 transition"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile Button */}
            <button
              className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
              mobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="py-4 border-t border-blue-500 space-y-2">
              <button
                className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center space-x-3 ${
                  currentPage === "scanner"
                    ? "bg-white/20 text-white shadow-lg"
                    : "text-blue-100 hover:text-white hover:bg-white/10"
                }`}
                onClick={() => handleNavigate("scanner")}
              >
                <Scan size={20} />
                <span>Scanner Barcode</span>
              </button>
              <button
                className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center space-x-3 ${
                  currentPage === "data"
                    ? "bg-white/20 text-white shadow-lg"
                    : "text-blue-100 hover:text-white hover:bg-white/10"
                }`}
                onClick={() => handleNavigate("data")}
              >
                <Users size={20} />
                <span>Data Mahasiswa</span>
              </button>

              {/* Logout Mobile */}
              <button
                className="w-full text-left px-4 py-3 rounded-lg font-medium flex items-center space-x-3 text-red-200 hover:text-white hover:bg-red-500/20"
                onClick={handleLogout}
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>

              <div className="px-4 py-2">
                <div className="bg-yellow-400 text-gray-800 px-3 py-2 rounded-full text-sm font-medium inline-flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Orientasi Fakultas Teknik 2025
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;
