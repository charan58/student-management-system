import './SummaryModal.css';
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { FaTimes } from 'react-icons/fa';
import { useState } from 'react';

const GRADE_COLORS = {
  A: '#10B981',
  B: '#3B82F6',
  C: '#F59E0B',
  F: '#EF4444',
};

function SummaryModal({ onClose, gpaSummary }) {
  const [searchTerm, setSearchTerm] = useState("");

  if (!gpaSummary) return null;

  const gradeData = Object.entries(gpaSummary.gradeCounts).map(([grade, count]) => ({
    name: grade,
    value: count,
  }));

  const studentGpaData = Object.entries(gpaSummary.studentAverageGpas).map(([id, gpa]) => ({
    studentId: id,
    gpa: gpa,
  }));

  const sortedGpaData = [...studentGpaData].sort((a, b) => b.gpa - a.gpa);

  const filteredGpaData = sortedGpaData.filter(entry =>
    entry.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}><FaTimes /></button>
        <h2>Dashboard Summary</h2>

        <div className="chart-section">
          <h3>Grade Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={gradeData} dataKey="value" nameKey="name" outerRadius={80} label>
                {gradeData.map(entry => (
                  <Cell key={entry.name} fill={GRADE_COLORS[entry.name] || '#ccc'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-section">
          <h3>Top 10 Student GPAs</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={sortedGpaData.slice(0, 10)} margin={{ top: 20 }}>
              <XAxis dataKey="studentId" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Bar dataKey="gpa" fill="#6366F1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-section">
          <h3>GPA Line Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={sortedGpaData.slice(0, 15)}>
              <XAxis dataKey="studentId" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Line type="monotone" dataKey="gpa" stroke="#4F46E5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="gpa-summary">
          <strong>Overall Average GPA: </strong>
          <span>{gpaSummary.overallAverageGpa.toFixed(2)}</span>
        </div>

        <div className="gpa-list">
          <h3>All Student GPAs</h3>
          <input
            type="text"
            className="gpa-search"
            placeholder="Search by Student ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <div className="gpa-scroll">
            {filteredGpaData.length > 0 ? filteredGpaData.map((entry, idx) => (
              <div key={idx} className="gpa-item">
                <span>{entry.studentId}</span>
                <span>{entry.gpa.toFixed(2)}</span>
              </div>
            )) : (
              <div className="no-results">No matching student found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SummaryModal;
