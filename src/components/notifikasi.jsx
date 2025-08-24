const Notifikasi = ({ show, type, message, onClose }) => {
  if (!show) return null;
  return (
    <div className={`alert alert-${type} fixed top-4 right-4`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 btn btn-sm">
        X
      </button>
    </div>
  );
};

export default Notifikasi;
