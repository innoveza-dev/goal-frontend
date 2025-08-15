
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GoalsView from './goalsView';
import axios from 'axios';
import { FaCalendarAlt, FaEye, FaEdit, FaFilePdf } from 'react-icons/fa';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useRef } from 'react';
import { motion } from 'framer-motion';
// import API_BASE_URL from '../api';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const navigate = useNavigate();
// No need for showCreate or location



  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/goals`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setGoals(res.data);
    } catch (error) {
      console.error('Fetch Goals Error:', error);
    }
  };


  // Group by year
  const groupedGoals = goals.reduce((acc, g) => {
    const y = g.year?.toString().trim() || '';
    if (!acc[y]) acc[y] = [];
    acc[y].push(g);
    return acc;
  }, {});

  // Refs for each year group for PDF
  const yearRefs = useRef({});

  const handleDownloadPDF = async (year) => {
    const yearGoals = groupedGoals[year];
    if (!yearGoals || yearGoals.length === 0) return;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    // 1. Add company logo (left)
    // Get logoUrl from localStorage user.companyProfile.logoUrl if available
    let logoUrl = window.location.origin + '/logo192.png';
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.companyProfile && user.companyProfile.logoUrl) {
        logoUrl = `${API_BASE_URL}/companyLogos/${user.companyProfile.logoUrl}`;
      }
    } catch {}

    const logoImg = await new Promise((resolve) => {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // Draw to canvas to get base64
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve(null);
      img.src = logoUrl;
    });
    // Logo size
    const logoW = 24, logoH = 24;
    pdf.addImage(logoImg, 'PNG', 10, 10, logoW, logoH);

    // 2. Main title centered
    pdf.setFontSize(18);
    const mainTitle = yearGoals[0]?.mainTitle.toUpperCase() || '';
    const titleText = `${year} : ${mainTitle}`;
    const titleWidth = pdf.getTextWidth(titleText);
    pdf.text(titleText, (pageWidth + logoW) / 2, 24, { align: 'center' });

    // 3. Draw all goals in small boxes in a row
    const boxW = 60, boxH = 50, gap = 8;
    let x = 10, y = 40;
    for (const goal of yearGoals) {
      if (x + boxW > pageWidth - 10) {
        x = 10;
        y += boxH + gap;
      }
      pdf.setDrawColor(91, 105, 188);
      pdf.setLineWidth(0.5);
      pdf.roundedRect(x, y, boxW, boxH, 3, 3, 'S');
      // Title centered at top
      pdf.setFontSize(12);
      pdf.text(goal.title, x + boxW / 2, y + 8, { align: 'center', maxWidth: boxW - 6 });
      // Image (left side)
      let images = [];
      if (Array.isArray(goal.imageURL)) images = goal.imageURL;
      else if (typeof goal.imageURL === 'string') {
        try { images = JSON.parse(goal.imageURL); if (!Array.isArray(images)) images = []; } catch { images = []; }
      }
      // Draw image with aspect ratio, center vertically in box
      if (images[0]) {
        try {
          const imgUrl = `${API_BASE_URL}/uploads/${images[0]}`;
          const imgData = await new Promise((resolve) => {
            const img = new window.Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
              // Maintain aspect ratio, fit in 28x28
              let drawW = 28, drawH = 28;
              const ratio = img.width / img.height;
              if (ratio > 1) { drawH = 28 / ratio; } else { drawW = 28 * ratio; }
              const canvas = document.createElement('canvas');
              canvas.width = 28; canvas.height = 28;
              const ctx = canvas.getContext('2d');
              ctx.fillStyle = '#fff';
              ctx.fillRect(0, 0, 28, 28);
              ctx.drawImage(img, (28 - drawW) / 2, (28 - drawH) / 2, drawW, drawH);
              resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = () => resolve(null);
            img.src = imgUrl;
          });
          if (imgData) {
            pdf.addImage(imgData, 'PNG', x + 4, y + 16, 28, 28);
          } else {
            // Draw placeholder if image fails
            pdf.setDrawColor(200,200,200);
            pdf.rect(x + 4, y + 16, 28, 28);
          }
        } catch {
          pdf.setDrawColor(200,200,200);
          pdf.rect(x + 4, y + 16, 28, 28);
        }
      } else {
        // Draw placeholder if no image
        pdf.setDrawColor(220,220,220);
        pdf.rect(x + 4, y + 16, 28, 28);
      }
      // Points (right side)
      let points = [];
      if (Array.isArray(goal.points)) points = goal.points;
      else if (typeof goal.points === 'string') {
        try { points = JSON.parse(goal.points); if (!Array.isArray(points)) points = []; } catch { points = []; }
      }
      pdf.setFontSize(9);
      const pointsX = x + 36;
      const pointsY = y + 18;
      points.slice(0, 4).forEach((pt, i) => {
        pdf.text(`• ${pt}`, pointsX, pointsY + i * 7, { maxWidth: boxW - 42 });
      });
      x += boxW + gap;
    }

    pdf.save(`goals_${year}.pdf`);
  };


  return (
    <motion.div className="container my-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-primary fw-bold mb-0">Goals by Year</h3>
        <Link to="/goals/create" className="btn btn-success">
          + Create Goals
        </Link>
      </div>
      {Object.entries(groupedGoals).length === 0 && (
        <div className="alert alert-info">No goals found.</div>
      )}
      {Object.entries(groupedGoals).map(([year, yearGoals]) => (
        <React.Fragment key={year}>
          <motion.div className="bg-light border-start border-4 border-primary rounded shadow-sm px-4 py-3 mb-4" whileHover={{ scale: 1.01 }}>
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center bg-white border rounded-pill px-3 py-1 shadow-sm">
                <FaCalendarAlt className="text-primary me-2" />
                <span className="text-dark fw-semibold fs-5">{year}</span>
                <span className="badge bg-primary ms-2">{yearGoals.length} goal{yearGoals.length > 1 ? 's' : ''}</span>
              </div>
              <div className="flex-grow-1 text-center" onClick={() => navigate(`/goals/${year}`)}>
                <span style={{ fontWeight: 'bold', fontSize: '1.2rem', textTransform: 'uppercase' }}>
                  {yearGoals[0]?.mainTitle?.toUpperCase()} <span className="text-secondary">({year})</span>
                </span>
              </div>
              <div className="d-flex gap-2 align-items-center">
                <button
                  className="btn btn-outline-primary rounded-circle"
                  style={{ width: 42, height: 42 }}
                  title="View Goals"
                  onClick={() => navigate(`/goals/${year}`)}
                >
                  <FaEye size={18} />
                </button>
                <button
                  className="btn btn-outline-secondary rounded-circle"
                  style={{ width: 42, height: 42 }}
                  title="Edit Goals"
                  onClick={() => navigate(`/goals/create?year=${encodeURIComponent(year)}`)}
                >
                  <FaEdit size={18} />
                </button>
                <button
                  className="btn btn-outline-danger rounded-circle"
                  style={{ width: 42, height: 42 }}
                  title="Download PDF"
                  onClick={() => handleDownloadPDF(year)}
                >
                  <FaFilePdf size={18} />
                </button>
              </div>
            </div>
          </motion.div>
          {/* Hidden printable area for PDF generation */}
          <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
            <div ref={el => { yearRefs.current[year] = el; }}>
              <div className="p-4 mb-4 text-center">
                <h4 className="text-primary fw-bold mb-0" style={{ fontSize: '2rem' }}>
                  {yearGoals[0]?.year} : {yearGoals[0]?.mainTitle.toUpperCase()} <span className="text-secondary"></span>
                </h4>
              </div>
              {yearGoals.map((goal, idx) => {
                let points = [];
                if (Array.isArray(goal.points)) {
                  points = goal.points;
                } else if (typeof goal.points === 'string') {
                  try {
                    points = JSON.parse(goal.points);
                    if (!Array.isArray(points)) points = [];
                  } catch { points = []; }
                }
                let images = [];
                if (Array.isArray(goal.imageURL)) {
                  images = goal.imageURL;
                } else if (typeof goal.imageURL === 'string') {
                  try {
                    images = JSON.parse(goal.imageURL);
                    if (!Array.isArray(images)) images = [];
                  } catch { images = []; }
                }
                return (
                  <div key={goal._id || goal.id || idx} className="card mb-3 p-4 shadow-sm">
                    <div className="mb-3 text-center">
                      <h5 className="fw-bold mb-0" style={{ fontSize: '1.3rem' }}>{goal.title}</h5>
                    </div>
                    <div className="mb-2"><strong>Points:</strong></div>
                    <ul>
                      {points.length === 0 ? <li className="text-muted">No points</li> : points.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                    {images.length > 0 && (
                      <div className="d-flex gap-2 mt-2 flex-wrap justify-content-center">
                        {images.map((img, i) => (
                          img ? (
                            <img
                              key={i}
                              src={`${API_BASE_URL}/uploads/${img}`}
                              alt="goal"
                              style={{ width: 100, height: 80, objectFit: 'cover', borderRadius: 6 }}
                            />
                          ) : null
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </React.Fragment>
      ))}
    </motion.div>
  );
};

export default Goals;



