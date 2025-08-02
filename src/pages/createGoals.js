import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
// import API_BASE_URL from '../api';
import { FaArrowRight, FaPlus, FaPlusCircle } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const CreateGoals = ({ onSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const editYear = query.get('year');

  const createEmptyForm = () => ({
    mainTitle: 'A year of big breakthroughs',
    year: '',
    title: '',
    points: ['', '', ''],
    images: [],
    previews: ['', ''],
  });

  const [forms, setForms] = useState([createEmptyForm()]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load goals for editing if year is present
  useEffect(() => {
    if (editYear) {
      setLoading(true);
      const token = localStorage.getItem('token');
      axios.get(`${API_BASE_URL}/goals`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          const yearGoals = res.data.filter(g => g.year?.toString() === editYear);
          if (yearGoals.length > 0) {
            // Map to form structure
            const mainTitle = yearGoals[0].mainTitle || '';
            const year = yearGoals[0].year || '';
            const formsData = yearGoals.map(goal => {
              // Parse points and images
              let points = [];
              if (Array.isArray(goal.points)) {
                points = goal.points;
              } else if (typeof goal.points === 'string') {
                try {
                  points = JSON.parse(goal.points);
                  if (!Array.isArray(points)) points = [];
                } catch { points = []; }
              }
              let previews = [];
              if (Array.isArray(goal.imageURL)) {
                previews = goal.imageURL.map(img => `${API_BASE_URL}/uploads/${img}`);
              } else if (typeof goal.imageURL === 'string') {
                try {
                  const imgs = JSON.parse(goal.imageURL);
                  previews = Array.isArray(imgs) ? imgs.map(img => `${API_BASE_URL}/uploads/${img}`) : [];
                } catch { previews = []; }
              }
              return {
                mainTitle,
                year,
                title: goal.title || '',
                points,
                images: [],
                previews,
                _id: goal._id || goal.id || null,
              };
            });
            setForms(formsData);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [editYear]);

  const showToast = (icon, title) => {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon,
      title,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
    });
  };

  const handleInput = (idx, field, value) => {
    setForms(prev =>
      prev.map((form, i) => {
        if ((field === 'mainTitle' || field === 'year') && i !== 0) return form;
        if (i === idx) return { ...form, [field]: value };
        return form;
      })
    );
  };

  const handlePointChange = (idx, pointIdx, value) => {
    setForms(prev =>
      prev.map((form, i) => {
        if (i === idx) {
          const newPoints = [...form.points];
          newPoints[pointIdx] = value;
          return { ...form, points: newPoints };
        }
        return form;
      })
    );
  };

  const handleAddPoint = (idx) => {
    setForms(prev =>
      prev.map((form, i) => {
        if (i === idx) {
          return { ...form, points: [...form.points, ''] };
        }
        return form;
      })
    );
  };

  const handleImageChange = (formIndex, files) => {
    const updated = [...forms];
    const selected = Array.from(files).slice(0, 2);
    updated[formIndex].images = selected;
    updated[formIndex].previews = selected.map(f => URL.createObjectURL(f));
    setForms(updated);
  };

  const handleSingleImageChange = (idx, imgIdx, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setForms(prev =>
        prev.map((form, i) => {
          if (i === idx) {
            // If editing, preserve other images
            let newPreviews = [...form.previews];
            let newImages = Array.isArray(form.images) ? [...form.images] : [];
            if (!newImages[0] && form.previews[0] && !form.images[0]) newImages[0] = null;
            if (!newImages[1] && form.previews[1] && !form.images[1]) newImages[1] = null;
            newPreviews[imgIdx] = reader.result;
            newImages[imgIdx] = file;
            return { ...form, previews: newPreviews, images: newImages };
          }
          return form;
        })
      );
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmitSingle = async (i) => {
    const form = forms[i];
    if (!forms[0].mainTitle) {
      showToast('error', 'Main Title is required');
      return false;
    }
    if (i === 0 && !form.year) {
      showToast('error', 'Year is required');
      return false;
    }
    if (!form.title) {
      showToast('error', 'Title is required');
      return false;
    }
    const data = new FormData();
    data.append('mainTitle', forms[0].mainTitle);
    data.append('year', forms[0].year);
    data.append('title', form.title);
    data.append('points', JSON.stringify(form.points.filter(pt => pt.trim() !== '')));
    // For edit: if no new image selected, keep the old image (from preview URL)
    if (form.images?.length) {
      form.images.forEach((img, idx) => {
        if (img instanceof File) {
          data.append('images', img);
        } else if (!img && form.previews && form.previews[idx] && form.previews[idx].startsWith('http')) {
          // Send a flag or the old image URL/name to backend to keep it
          data.append('existingImages', form.previews[idx].replace('${API_BASE_URL}/uploads/', ''));
        }
      });
    }
    try {
      const token = localStorage.getItem('token');
      if (editYear && form._id) {
        // Edit mode: update existing goal
        await axios.put(`${API_BASE_URL}/goals/${form._id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        // Create mode: add new goal
        await axios.post(`${API_BASE_URL}/goals`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
      }
      return true;
    } catch (err) {
      showToast('error', 'Failed to submit goal');
      return false;
    }
  };

  const handleSubmitAll = async () => {
    setSubmitting(true);
    for (let i = 0; i < forms.length; i++) {
      const success = await handleSubmitSingle(i);
      if (!success) {
        setSubmitting(false);
        return;
      }
    }
    showToast('success', 'All goals submitted successfully!');
    setForms([createEmptyForm()]);
    setSubmitting(false);
    if (onSuccess) onSuccess();
    navigate('/goals');
  };

return (
  <div className="container my-4">
    <h3 className="text-primary fw-bold mb-4">{editYear ? 'Edit Company Goals' : 'Add Company Goals'}</h3>
    <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>&larr; Back</button>

    {/* Main Title and Year above the cards */}
    <div className="card p-4 mb-4 text-center bg-light border-0 shadow-sm">
      <div className="row justify-content-center align-items-center">
        <div className="col-md-6 mb-2 mb-md-0">
          <label className="fw-bold">Main Title</label>
          <input
            type="text"
            className="form-control text-center"
            value={forms[0]?.mainTitle || ''}
            onChange={(e) => handleInput(0, 'mainTitle', e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label className="fw-bold">Year</label>
          <select
            className="form-control text-center"
            value={forms[0]?.year || ''}
            onChange={(e) => handleInput(0, 'year', e.target.value)}
          >
            <option value="">Select Year</option>
            {Array.from(
              { length: Math.max(new Date().getFullYear(), 2030) - 1990 + 1 },
              (_, i) => {
                const year = 1990 + i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              }
            )}
          </select>
        </div>
      </div>
    </div>

    {loading ? (
      <div className="text-center my-5">Loading...</div>
    ) : forms.map((form, idx) => (
      <div className="card p-4 mb-4 shadow-sm" key={idx}>
        {/* Centered goal title inside card */}
        <div className="mb-3 text-center">
          <input
            type="text"
            className="form-control form-control-lg text-center fw-bold mb-0"
            placeholder="Enter Sub Title"
            value={form.title}
            onChange={(e) => handleInput(idx, 'title', e.target.value)}
            style={{ fontSize: '1.3rem' }}
          />
        </div>
        <div className="row">
            <div className="col-md-5 mb-3">
              <div className="row">
                {[0, 1].map((i) => (
                  <div
                    key={i}
                    className="border rounded d-flex justify-content-center align-items-center mb-2"
                    style={{ cursor: 'pointer', backgroundColor: '#f8f9fa', minHeight: '100px', maxHeight: '300px', padding: '10px' }}
                    onClick={() => document.getElementById(`image-input-${idx}-${i}`).click()}
                  >
                    {form.previews[i] ? (
                      <img
                        src={form.previews[i]}
                        alt="preview"
                        style={{ width: '100%', height: 'auto', objectFit: 'contain', maxHeight: '100%' }}
                      />
                    ) : (
                      <span>Click to Upload Image {i + 1}</span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      id={`image-input-${idx}-${i}`}
                      style={{ display: 'none' }}
                      onChange={(e) => handleSingleImageChange(idx, i, e.target.files[0])}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="col-md-7">
              <label>Points</label>
              {[
                ...form.points,
                ...Array(Math.max(0, 3 - form.points.length)).fill('')
              ].map((pt, i, arr) => (
                <div key={i} className="input-group mb-2">
                  <span className="input-group-text">
                    <FaArrowRight />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    value={pt}
                    onChange={(e) => handlePointChange(idx, i, e.target.value)}
                  />
                  {i === arr.length - 1 && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => handleAddPoint(idx)}
                    >
                      <FaPlus />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-4">
            {forms.length > 1 && editYear && (
              <button
                type="button"
                className="btn btn-outline-danger d-flex align-items-center gap-2"
                onClick={async () => {
                  const formToDelete = forms[idx];
                  if (formToDelete._id) {
                    try {
                      const token = localStorage.getItem('token');
                      await axios.delete(`${API_BASE_URL}/goals/section/${formToDelete._id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                      });
                      showToast('success', 'Section deleted');
                    } catch (err) {
                      showToast('error', 'Failed to delete section');
                      return;
                    }
                  }
                  setForms(prev => prev.filter((_, i) => i !== idx));
                }}
              >
                Delete Section
              </button>
            )}
            {idx === forms.length - 1 && (
              <button
                type="button"
                className="btn btn-outline-primary d-flex align-items-center gap-2"
                onClick={() => setForms(prev => [...prev, createEmptyForm()])}
              >
                <FaPlusCircle />
                Add Another Goal
              </button>
            )}
          </div>
        </div>
      ))}
      <div className="text-end mt-4">
        <button
          className="btn btn-success"
          onClick={handleSubmitAll}
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit All Goals'}
        </button>
      </div>
    </div>
  );
};

export default CreateGoals;
