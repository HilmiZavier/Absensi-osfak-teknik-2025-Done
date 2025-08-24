import React from "react";
import { User, Check, Minus } from "lucide-react";
import DataMahasiswa from "../Data/DataMahasiswa"; // sesuaikan path
// Contoh status, bisa diganti props/state
const status = "hadir";

const DataMahasiswaComponent = ({ nimLogin }) => {
  // Cari data mahasiswa berdasarkan nim
  const mahasiswa = DataMahasiswa.find((m) => m.nim === nimLogin) || {};

  return (
    <>
      <section className="flex items-center bg-primary p-3 m-1 rounded-xl shadow-2xl shadow-blue-500">
        <User className="text-gray-200 m-2 sm:m-4 sm:mr-7" />
        <div className="flex flex-col text-gray-200 space-y-1 sm:space-y-2">
          <h1 className="font-bold font-sans text-base sm:text-xl">
            {mahasiswa.nama}
          </h1>
          <h2 className="font-medium font-sans text-xs sm:text-sm">
            {mahasiswa.role}
          </h2>
        </div>
      </section>

      <section className="bg-gray-500 p-3 sm:p-4 m-1 mt-4 sm:mt-5 rounded-xl shadow-2xl shadow-blue-500 text-gray-200">
        {/* Mobile Layout */}
        <div className="flex flex-col gap-2 sm:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User size={16} className="text-gray-200 flex-shrink-0" />
              <span className="font-bold text-sm">
                {mahasiswa.nim || "NIM"}
              </span>
            </div>
            <div className="flex-shrink-0">
              {status === "hadir" ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-600 text-green-100 rounded-full text-xs">
                  <Check size={12} />
                  <span>Hadir</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-600 text-red-100 rounded-full text-xs">
                  <Minus size={12} />
                  <span>Tidak</span>
                </span>
              )}
            </div>
          </div>
          <div className="text-sm font-medium pl-6">
            {mahasiswa.nama || "Nama Mahasiswa"}
          </div>
          <div className="text-xs text-gray-300 pl-6">
            {mahasiswa.jurusan || "Jurusan"}
          </div>
        </div>

        {/* Desktop/Tablet Layout */}
        <div className="hidden sm:flex sm:items-center sm:gap-4 lg:gap-6 font-sans text-sm lg:text-base">
          <div className="flex items-center gap-2 flex-shrink-0">
            <User size={16} className="text-gray-200" />
            <span className="font-bold">{mahasiswa.nim || "NIM"}</span>
          </div>
          <div className="min-w-0 flex-shrink-0">
            <span className="break-words">{mahasiswa.nama}</span>
          </div>
          <div className="min-w-0 flex-shrink-0">
            <span className="break-words">
              {mahasiswa.jurusan || "Jurusan"}
            </span>
          </div>
          <div className="ml-auto flex-shrink-0">
            {status === "hadir" ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-600 text-green-100 rounded-full text-sm">
                <Check size={14} />
                <span>Hadir</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-red-100 rounded-full text-sm">
                <Minus size={14} />
                <span>Tidak</span>
              </span>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default DataMahasiswaComponent;
