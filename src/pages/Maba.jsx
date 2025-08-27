import React, { useEffect, useState } from "react";
import { User, Check, Minus } from "lucide-react";
import api from "../Data/Data";
import DataMahasiswa from "../Data/DataMahasiswa"; // sesuaikan path
import { li } from "framer-motion/client";
import { data } from "react-router-dom";
// Contoh status, bisa diganti props/state
const status = "hadir";

const DataMahasiswaComponent = () => {
const [mahasiswa,setMahasiswa] = useState({});
const [participants,setParticipants] = useState([]);
  // Ambil nim login dari localStorage
  useEffect(()=>{
    const fetchData = async () =>{
      const nimLogin = localStorage.getItem("nimLogin");
      console.log(nimLogin)

      if(!nimLogin){
        return;
      }
      

      try{
        const pic = await api.get(`/user/${nimLogin}`);
        const datapic = pic.data;
        setMahasiswa(datapic)

        console.log(datapic)

        const participatsReq = datapic.participants.map(
          p => api.get(`/absence/${p.id}`)
        );

        // 3. Tunggu semua request selesai
        const responses = await Promise.all(participatsReq);

        // 4. Ambil data user dari tiap response
        const participantData = responses.map(r => r.data);

        // 1. Get today's date (without time)
        const today = new Date().toISOString().split("T")[0];

        // 2. Filter participants by createdAt
        const todayParticipants = participants.filter((p) => {
          const createdDate = new Date(p.createdAt).toISOString().split("T")[0];
          return createdDate === today;
        });


        console.log("this is participant data\n",participantData);
        setParticipants(participantData);
      }catch(e){
        console.log(e,"soemthing wrong with fetch")
      }
    }

    fetchData();
  },[])

  
  // Cari data mahasiswa sesuai nim
  // const mahasiswa = DataMahasiswa.find((m) => m.nim === nimLogin) || {};
  if (!mahasiswa || !mahasiswa.nim) {
    return <p className="text-gray-200">Loading data mahasiswa...</p>;
  }

  return (
    <>
      <section className="flex items-center bg-primary p-3 m-1 mb-4 rounded-xl shadow-2xl shadow-blue-500">
        <User className="text-gray-200 m-2 sm:m-4 sm:mr-7" />
        <div className="flex flex-col text-gray-200 space-y-1 sm:space-y-2">
          <h1 className="font-bold font-sans text-base sm:text-xl">
            {mahasiswa.name}
          </h1>
          <h2 className="font-medium font-sans text-xs sm:text-sm">
            {mahasiswa.role}
          </h2>
        </div>
      </section>

      {participants.map((participant) => (
      <section className="bg-gray-500 p-4 sm:p-4 m-3 mt-1 sm:mt-1 rounded-xl shadow-2xl shadow-blue-500 text-gray-200"
        key={participant.id}
      >
        {/* Mobile Layout */}


          <div className="flex flex-col gap-2 sm:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User size={16} className="text-gray-200 flex-shrink-0" />
              <span className="font-bold text-sm">
                {participant.participant.nim || "NIM"}
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
            {participant.participant.name  || "Nama Mahasiswa"}
          </div>
          <div className="text-xs text-gray-300 pl-6">
            {participant.participant.prodi || "Jurusan"}
          </div>
        </div>

        

        {/* Desktop/Tablet Layout */}


        <div className="hidden sm:flex sm:items-center sm:gap-4 lg:gap-6 font-sans text-sm lg:text-base">
          <div className="flex items-center gap-2 flex-shrink-0">
            <User size={16} className="text-gray-200" />
            <span className="font-bold">{participant.participant.nim || "NIM"}</span>
          </div>
          <div className="min-w-0 flex-shrink-0">
            <span className="break-words">{participant.participant.name || "nama"}</span>
          </div>
          <div className="min-w-0 flex-shrink-0">
            <span className="break-words">
              {participant.participant.prodi || "Jurusan"}
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
        ))
        }
    </>
  );
};

export default DataMahasiswaComponent;
