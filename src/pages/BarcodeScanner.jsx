import React, { useState, useRef, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  QrCode,
  CheckCircle,
  Search,
  Camera,
  X,
  AlertCircle,
} from "lucide-react";
import Notifikasi from "../components/notifikasi";
import {
  BrowserMultiFormatReader,
  BarcodeFormat,
  DecodeHintType,
  NotFoundException,
} from "@zxing/library";

const BarcodeScanner = ({ onScanSuccess }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState("");
  const [manualNim, setManualNim] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState("");
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);

  // notif state
  const [notif, setNotif] = useState({
    show: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    // 🚀 fokus hanya ke barcode CODE_128
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.CODE_128]);

    codeReaderRef.current = new BrowserMultiFormatReader(hints);

    return () => {
      stopCamera();
    };
  }, []);

  // fungsi mulai kamera
  // fungsi mulai kamera
  const startCamera = async () => {
    const pic = localStorage.getItem("nimLogin");
    try {
      setError("");
      setCameraActive(true);
      setIsScanning(true);

      const devices = await codeReaderRef.current.listVideoInputDevices();
      if (devices.length === 0) {
        setError("❌ Tidak ada kamera ditemukan.");
        return;
      }

      // 🔑 ambil kamera belakang kalau ada
      const backCamera =
        devices.find((d) => d.label.toLowerCase().includes("back")) ||
        devices[0];

      // 🚀 langsung decode dari kamera belakang (tanpa stop, tanpa delay)
      await codeReaderRef.current.decodeFromVideoDevice(
        backCamera.deviceId,
        videoRef.current,
        (result, err) => {
          if (result) {
            const text = result.getText();
            const format = result.getBarcodeFormat();

            setScanResult(text);
            setManualNim(text);

            if (onScanSuccess) onScanSuccess(text);

            console.log("📌 Hasil Scan Barcode:", text, "Format:", format);

            fetch("/api/absence", {
              method: "POST",
              headers: {
                "Content-Type": "application/json", // 🔑 penting
              },
              body: JSON.stringify({
                picNim: pic,
                participantNim: text,
              }),
            })
              .then((res) => res.json())
              .then((data) => console.log("✅ Response:", data))
              .catch((err) => console.log("❌ Error:", err));

            if (format === "CODE_128") {
              setNotif({
                show: true,
                type: "success",
                message: `📌 Barcode 128 terbaca: ${text}`,
              });
            }

            // 🔑 reset supaya bisa baca barcode yang sama lagi detik itu juga
            codeReaderRef.current.reset();
          }

          if (err && !(err instanceof NotFoundException)) {
            console.warn("⚠️ ZXing Error:", err);
          }
        }
      );
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Tidak bisa mengakses kamera.");
      setCameraActive(false);
      setIsScanning(false);

      setNotif({
        show: true,
        type: "error",
        message: "❌ Tidak bisa akses kamera!",
      });
    }
  };

  // fungsi stop kamera
  const stopCamera = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
    }
    setCameraActive(false);
    setIsScanning(false);
  };

  // input manual
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualNim.trim()) {
      setScanResult(manualNim);
      if (onScanSuccess) onScanSuccess(manualNim);

      console.log("✍️ Input Manual:", manualNim);
      // localStorage.setItem("nimLogin", manualNim);
      const pic = localStorage.getItem("nimLogin");

      // api.post(`/absence`,
      //   {
      //     picNim: pic,
      //     participantNim: manualNim
      //   }
      // ).then(res=>{console.log(res);
      //   setNotif({
      //   show: true,
      //   type: "success",
      //   message: `✍️ Input Manual: ${manualNim}`,
      //   });
      // }
      // ).catch(e=>{console.log(e)}
      // )

      fetch("/api/absence", {
        method: "POST",
        body: JSON.stringify({
          picNim: pic,
          participantNim: manualNim,
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) => console.log(err));

      setManualNim("");
    }
  };

  return (
    <motion.div
      className="card bg-base-100 shadow-xl"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Notifikasi floating */}
      <Notifikasi
        show={notif.show}
        type={notif.type}
        message={notif.message}
        onClose={() => setNotif({ ...notif, show: false })}
      />

      <div className="card-body items-center text-center">
        <motion.h2
          className="card-title text-2xl mb-4 flex items-center gap-2"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <QrCode size={32} className="text-primary" />
          Scan Barcode KTM
        </motion.h2>

        <div className="w-full max-w-md">
          {/* Camera/Scanner Area */}
          <motion.div
            className="bg-base-200 border-2 border-dashed border-primary rounded-lg p-4 mb-6 relative overflow-hidden"
            whileHover={{ scale: cameraActive ? 1 : 1.02 }}
          >
            {cameraActive ? (
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full h-48 object-cover rounded-lg"
                  playsInline
                  muted
                />
                {isScanning && (
                  <motion.div
                    className="absolute inset-0 border-2 border-success rounded-lg"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                <button
                  className="absolute top-2 right-2 btn btn-sm btn-circle btn-error"
                  onClick={stopCamera}
                >
                  <X size={16} />
                </button>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-24 border-2 border-warning rounded-lg opacity-70"></div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-8">
                <Camera size={64} className="text-base-content/30 mb-4" />
                <p className="text-sm text-base-content/60">
                  Klik tombol scan untuk membuka kamera
                </p>
              </div>
            )}
          </motion.div>

          {error && (
            <div className="alert alert-error mb-4 text-sm">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <motion.button
            className="btn btn-primary btn-lg w-full mb-4"
            onClick={startCamera}
            disabled={cameraActive}
            whileHover={{ scale: cameraActive ? 1 : 1.02 }}
            whileTap={{ scale: cameraActive ? 1 : 0.98 }}
          >
            <Camera size={20} />
            {cameraActive ? "Sedang Scanning..." : "Scan Barcode"}
          </motion.button>

          {cameraActive && (
            <motion.button
              className="btn btn-outline btn-error w-full mb-4"
              onClick={stopCamera}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <X size={20} />
              Stop Scanning
            </motion.button>
          )}

          {!cameraActive && (
            <>
              <div className="divider">ATAU</div>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Input NIM Manual</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan NIM mahasiswa"
                    className="input input-bordered w-full"
                    value={manualNim}
                    onChange={(e) => setManualNim(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") handleManualSubmit(e);
                    }}
                  />
                </div>
                <motion.button
                  onClick={handleManualSubmit}
                  className="btn btn-outline w-full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Search size={20} />
                  Cari Data
                </motion.button>
              </div>
            </>
          )}

          <AnimatePresence>
            {scanResult && (
              <motion.div
                className="alert alert-success mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <CheckCircle size={20} />
                <span>Berhasil scan NIM: {scanResult}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-4 text-xs text-base-content/60 text-left">
            <p className="font-semibold mb-1">📱 Tips Scanning:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Pastikan barcode dalam frame kotak kuning</li>
              <li>Jaga jarak 10-15 cm dari kamera</li>
              <li>Pastikan pencahayaan cukup</li>
              <li>Tahan HP steady sampai barcode terbaca</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BarcodeScanner;
