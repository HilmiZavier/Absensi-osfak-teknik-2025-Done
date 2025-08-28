import { useState, useEffect } from "react";

const AttendanceSessionTable = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [teamData, setTeamData] = useState(null);
  const [absenceData, setAbsenceData] = useState([]);
  const [attendanceMatrix, setAttendanceMatrix] = useState([]);

  const baseUrl = "https://absences-pied.vercel.app";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const nimLogin = localStorage.getItem("nimLogin") || "202411420025";

      // Fetch team data
      const teamResponse = await fetch(`${baseUrl}/api/v1/tim?pic=${nimLogin}`);
      if (!teamResponse.ok) throw new Error("Gagal memuat data tim");
      const teamJson = await teamResponse.json();
      setTeamData(teamJson[0]);

      // Fetch absence data
      const absenceResponse = await fetch(`${baseUrl}/api/v1/absence`);
      if (!absenceResponse.ok) throw new Error("Gagal memuat data absensi");
      const absenceJson = await absenceResponse.json();
      setAbsenceData(absenceJson);

      if (teamJson[0] && absenceJson) {
        processAttendanceMatrix(teamJson[0], absenceJson);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const processAttendanceMatrix = (team, absences) => {
    const allParticipants = [
      {
        id: team.pic.id,
        nim: team.pic.nim,
        name: team.pic.name,
        role: team.pic.role,
        prodi: team.pic.prodi,
      },
      ...(team.participants || []).map((p) => ({
        id: p.user.id,
        nim: p.user.nim,
        name: p.user.name,
        role: p.user.role,
        prodi: p.user.prodi,
      })),
    ];

    const participantAbsences = {};
    absences.forEach((absence) => {
      if (!participantAbsences[absence.participantId]) {
        participantAbsences[absence.participantId] = [];
      }
      participantAbsences[absence.participantId].push(absence);
    });

    const maxSessions = Math.max(
      ...Object.values(participantAbsences).map((abs) => abs.length),
      1
    );

    const matrix = allParticipants.map((participant) => {
      const absences = participantAbsences[participant.id] || [];
      const sessions = [];

      for (let i = 0; i < maxSessions; i++) {
        sessions.push({
          attended: i < absences.length,
          date: absences[i]?.createdAt || null,
          absenceId: absences[i]?.id || null,
        });
      }

      return {
        participant,
        sessions,
        totalAttended: absences.length,
      };
    });

    setAttendanceMatrix(matrix);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("id-ID", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

  const getMaxSessions = () =>
    Math.max(...attendanceMatrix.map((row) => row.sessions.length), 1);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <h2 className="text-xl font-semibold mt-4">
                Memuat data absensi...
              </h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
            <button className="btn btn-sm btn-outline" onClick={loadData}>
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-base-content mb-2">
            📋 Absensi Per Sesi
          </h1>
          {teamData && (
            <p className="text-lg text-base-content/70">
              Tim: <span className="font-semibold">{teamData.name}</span>
            </p>
          )}
        </div>

        {/* Stats */}
        {/* ... (tetap sama, tidak ada bug) ... */}

        {/* Main Table */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {attendanceMatrix.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table table-zebra table-pin-rows">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama Peserta</th>
                      <th>NIM</th>
                      <th>Role</th>
                      <th>Prodi</th>
                      {Array.from({ length: getMaxSessions() }, (_, i) => (
                        <th key={i} className="text-center">
                          Sesi {i + 1}
                        </th>
                      ))}
                      <th className="text-center">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceMatrix.map((row, index) => (
                      <tr key={row.participant.id}>
                        <td>{index + 1}</td>
                        <td>{row.participant.name}</td>
                        <td>{row.participant.nim}</td>
                        <td>{row.participant.role}</td>
                        <td>{row.participant.prodi}</td>
                        {row.sessions.map((session, sessionIndex) => (
                          <td key={sessionIndex} className="text-center">
                            {session.attended ? (
                              <div
                                className="tooltip"
                                data-tip={`Hadir: ${formatDate(session.date)}`}
                              >
                                <div className="badge badge-success">✓</div>
                              </div>
                            ) : (
                              <div className="badge badge-error badge-outline">
                                ✗
                              </div>
                            )}
                          </td>
                        ))}
                        <td className="text-center">
                          <div className="badge badge-neutral font-bold">
                            {row.totalAttended}/{getMaxSessions()}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-2xl font-bold">Belum Ada Data</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSessionTable;
