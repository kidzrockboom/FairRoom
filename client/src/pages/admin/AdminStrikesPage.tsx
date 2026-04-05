import { useMemo, useState } from "react";
import { adminStudents } from "@/data/adminMockData";
import "../../styles/admin.css";

function AdminStrikesPage() {
  const [query, setQuery] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState(adminStudents[1]?.id ?? "");
  const [draftStrikes, setDraftStrikes] = useState<number | null>(null);
  const [reason, setReason] = useState("");

  const filtered = useMemo(() => {
    return adminStudents.filter((s) => {
      const q = query.toLowerCase();
      return s.fullName.toLowerCase().includes(q) || s.studentCode.toLowerCase().includes(q);
    });
  }, [query]);

  const selectedStudent = filtered.find((s) => s.id === selectedStudentId) ?? filtered[0];

  const currentStrikes = selectedStudent?.strikes ?? 0;
  const proposedStrikes = draftStrikes ?? currentStrikes;

  const strikeLabel = (n: number) => `${n} ${n === 1 ? "Strike" : "Strikes"}`;

  return (
    <section className="strikes-page">
      <aside className="directory-panel">
        <h2>Student Directory</h2>
        <input
          className="directory-search"
          placeholder="Search by name or ID..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="directory-list">
          {filtered.map((student) => (
            <button
              key={student.id}
              className={`student-row ${selectedStudent?.id === student.id ? "active" : ""}`}
              type="button"
              onClick={() => {
                setSelectedStudentId(student.id);
                setDraftStrikes(null);
                setReason("");
              }}
            >
              <img src={student.avatarUrl} alt={student.fullName} />
              <div>
                <strong>{student.fullName}</strong>
                <small>ID: {student.studentCode}</small>
              </div>
              <span className={`strike-pill strike-${Math.min(student.strikes, 3)}`}>
                {strikeLabel(student.strikes)}
              </span>
            </button>
          ))}
        </div>
      </aside>

      {selectedStudent && (
        <div className="strike-content">
          <header className="student-header">
            <div className="student-header-left">
              <img src={selectedStudent.avatarUrl} alt={selectedStudent.fullName} />
              <div>
                <h1>{selectedStudent.fullName}</h1>
                <p>
                  {selectedStudent.studentCode} • {selectedStudent.program}
                </p>
              </div>
            </div>

            <div className="student-status">
              <span className={`account-badge ${selectedStudent.accountState}`}>
                {selectedStudent.accountState === "good"
                  ? "Good standing"
                  : selectedStudent.accountState === "warned"
                    ? "Account warned"
                    : "Restricted"}
              </span>
              <small>Last update: {selectedStudent.lastUpdate}</small>
            </div>
          </header>

          <div className="strike-grid">
            <article className="card">
              <h3>Strike Adjustment</h3>
              <p>Modify the student strike count manually.</p>

              <div className="strike-counter-box">
                <div>
                  <small>CURRENT</small>
                  <strong>{currentStrikes}</strong>
                </div>
                <span>›</span>
                <div>
                  <small>PROPOSED</small>
                  <strong>{proposedStrikes}</strong>
                </div>
              </div>

              <div className="strike-actions">
                <button
                  type="button"
                  onClick={() => setDraftStrikes(Math.max(0, proposedStrikes - 1))}
                >
                  − Decrease
                </button>
                <button
                  type="button"
                  onClick={() => setDraftStrikes(Math.min(3, proposedStrikes + 1))}
                >
                  + Increase
                </button>
                <button type="button" onClick={() => setDraftStrikes(currentStrikes)}>
                  Reset
                </button>
              </div>
            </article>

            <article className="card">
              <h3>Strike History</h3>
              {selectedStudent.strikeHistory.length === 0 ? (
                <p>No history found.</p>
              ) : (
                <div className="history-list">
                  {selectedStudent.strikeHistory.map((item) => (
                    <div key={item.id}>
                      <strong>{item.title}</strong>
                      <p>{item.description}</p>
                      <small>{item.date}</small>
                    </div>
                  ))}
                </div>
              )}
            </article>
          </div>

          <div className="strike-grid lower">
            <article className="card">
              <h3>Reason for Adjustment</h3>
              <textarea
                placeholder="Please provide a detailed justification for this strike adjustment..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <small>
                This note will be logged in the system and visible to other administrators.
              </small>
            </article>

            <article className="card">
              <h3>Strike Policy Quick-Ref</h3>
              <ul>
                <li>3 strikes result in automatic account suspension for 14 days.</li>
                <li>Strikes can be appealed by students within 48 hours.</li>
                <li>Manual overrides must include a valid reason for auditing purposes.</li>
                <li>Strikes expire after 180 days of clean booking history.</li>
              </ul>
            </article>
          </div>

          <footer className="strike-footer">
            <button type="button" className="btn-secondary">Discard</button>
            <button type="button" className="btn-primary">Save User Record</button>
          </footer>
        </div>
      )}
    </section>
  );
}

export default AdminStrikesPage;
