import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaArrowRight, FaPlus, FaEye, FaTrash, FaEdit, FaCalendarAlt, FaPlusCircle
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import API_BASE_URL from '../api';

const Goals = () => {
  // ======= Helpers =======
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

  const createEmptyForm = () => ({
    _id: null,
    mainTitle: '',
    year: '',
    yearHeading: '',
    title: '',
    points: ['', '', ''],
    previews: ['', ''],
    images: [],
    isViewMode: false,
  });

  // ======= State =======
  const [goals, setGoals] = useState([]);
  const [viewMode, setViewMode] = useState(false);
  const [forms, setForms] = useState([createEmptyForm()]);
  const [isEditMode, setIsEditMode] = useState(false);


  // ======= Fetch Goals =======
  useEffect(() => { fetchGoals(); }, []);
  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/goals`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setGoals(res.data);
    } catch (error) {
      console.error('Fetch Goals Error:', error);
    }
  };


  // ======= Handlers =======
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
            const newPreviews = [...form.previews];
            newPreviews[imgIdx] = reader.result;

            const newImages = [...form.images];
            newImages[imgIdx] = file;

            return { ...form, previews: newPreviews, images: newImages };
          }
          return form;
        })
      );
    };

    if (file) reader.readAsDataURL(file);
  };

  // 2. Single form submit handler
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

    if (form.images?.length) {
      form.images.forEach(img => {
        if (img instanceof File) {
          data.append('images', img);
        }
      });
    }

    try {
      const token = localStorage.getItem('token');
      if (form._id) {
        await axios.put(`${API_BASE_URL}/goals/${form._id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        await axios.post(`${API_BASE_URL}/goals`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
      }
      return true;
    } catch (err) {
      console.error('Submit Goal Error:', err.response?.data || err.message || err);
      showToast('error', 'Failed to submit goal');
      return false;
    }
  };

  // 3. Submit all forms handler
  const handleSubmitAll = async () => {
    for (let i = 0; i < forms.length; i++) {
      const success = await handleSubmitSingle(i);
      if (!success) {
        return;
      }
    }
    showToast('success', 'All goals submitted successfully!');
    await fetchGoals();
    setForms([createEmptyForm()]);
    setViewMode(false);
  };


  const handleViewGoal = (yearGoals) => {
    const year = yearGoals[0]?.year || '';
    const mainTitle = yearGoals[0]?.mainTitle || '';

    const allForms = yearGoals.map((goal, i) => {
      let imageList = [];

      // Parse imageURL from string or array
      if (Array.isArray(goal.imageURL)) {
        imageList = goal.imageURL;
      } else if (typeof goal.imageURL === 'string') {
        try {
          const parsed = JSON.parse(goal.imageURL);
          imageList = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          imageList = [goal.imageURL];
        }
      }

      const imageURLs = imageList.map(img => `http://localhost:5000/uploads/${img}`);
      console.log(imageURLs);
      let parsedPoints = [];
      if (Array.isArray(goal.points)) {
        parsedPoints = goal.points;
      } else if (typeof goal.points === 'string') {
        try {
          parsedPoints = JSON.parse(goal.points);
        } catch {
          parsedPoints = [goal.points];
        }
      }

      return {
        _id: goal.id || goal._id,
        mainTitle,
        year: goal.year,
        title: goal.title,
        points: parsedPoints,
        images: imageList,
        previews: imageURLs,
        isViewMode: true,
        yearHeading: i === 0 ? year : null
      };
    });

    setForms(allForms);
    setViewMode(true);
  };


  const handleEdit = (index) => {
    const editable = { ...forms[index], isViewMode: false };
    setForms([editable]);
    setIsEditMode(true);
  };

  const handleUpdateAll = async () => {
    try {
      for (const form of forms) {
        await updateGoalAPI(form);
      }

      Swal.fire({
        icon: 'success',
        title: 'Goals Updated',
        toast: true,
        timer: 3000,
        position: 'top-end',
        showConfirmButton: false,
      });

      setViewMode(false);
      setIsEditMode(false);
      fetchGoals();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Please try again.',
      });
    }
  };

  const updateGoalAPI = async (form) => {
    const data = new FormData();
    data.append('mainTitle', forms[0].mainTitle);
    data.append('year', form.year);
    data.append('title', form.title);
    data.append('points', JSON.stringify(form.points.filter(pt => pt.trim() !== '')));

    if (form.images?.length) {
      form.images.forEach(img => data.append('images', img));
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/goals/${form._id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error('Update Goal Error:', err);
      throw err;
    }
  };



  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_BASE_URL}/goals/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        showToast('success', 'Goal deleted successfully!');
        fetchGoals();
        setForms([]);
        setViewMode(false);
      } catch (err) {
        console.error('Delete Goal Error:', err);
        showToast('error', 'Failed to delete goal');
      }
    }
  };

  // ======= Grouping & Title =======
  const groupedGoals = goals.reduce((acc, g) => {
    const y = g.year.toString().trim();
    if (!acc[y]) acc[y] = [];
    acc[y].push(g);
    return acc;
  }, {});

  const getTitle = () => {
    if (viewMode && forms[0]?.isViewMode) return 'View Goals';
    if (viewMode) return forms[0]?._id ? 'Edit Company Goals' : 'Add Company Goals';
    return 'View Goals';
  };

  return (
    <motion.div className="container my-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-primary fw-bold">{getTitle()}</h3>
        <div className="d-flex gap-3">
          <button
            className={`btn ${!viewMode ? 'btn-primary' : 'btn-outline-primary'} rounded-circle p-3`}
            onClick={() => { setViewMode(false); setForms([]); }}
            title="View Goals"
          >
            <FaCalendarAlt size={20} />
          </button>
          <button
            className={`btn ${viewMode && !forms[0]?.isViewMode ? 'btn-success' : 'btn-outline-success'} rounded-circle p-3`}
            onClick={() => { setViewMode(true); setForms([createEmptyForm()]); }}
            title="Add Goals"
          >
            <FaPlusCircle size={20} />
          </button>
        </div>
      </div>

      {/* {successMessage && <motion.div className="alert alert-success" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>{successMessage}</motion.div>} */}

      <AnimatePresence>
        {viewMode && forms.map((form, idx) => (
          <React.Fragment key={idx}>
            {/* Main Title and Year (only show once above all forms) */}
            {idx === 0 && (
              <div className="container my-4">
                <div className="row">
                  <div className="col-md-6">
                    <label>Main Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={forms[0]?.mainTitle || ''}
                      onChange={(e) => handleInput(0, 'mainTitle', e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label>Year</label>
                    <select
                      className="form-control"
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
            )}

            {idx === 0 && form.yearHeading && (
              <h4 className="text-center text-primary fw-bold mb-3 fs-4">
                <hr className="mb-2" />
                {form.yearHeading}
                <hr className="mt-2" />
              </h4>
            )}

            <motion.div
              className="card p-4 mb-4 shadow-sm"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {form.isViewMode ? (
                <div className="row">
                  <div className="col-md-5 mb-3">
                    <div className="row">
                      {form.previews.map((src, i) => (
                        <div key={i} className="col-6 mb-3">
                          <motion.img
                            src={src}
                            alt={`goal-${i}`}
                            className="img-fluid rounded border shadow-sm"
                            style={{ height: '120px', objectFit: 'cover', width: '100%' }}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-md-7">
                    <p><strong>🎯 Title:</strong> {form.title}</p>
                    <p><strong>📝 Points:</strong></p>
                    <ul>
                      {form.points.map((pt, i) => <li key={i}>{pt}</li>)}
                    </ul>
                    <div className="d-flex justify-content-end gap-2 mt-3">
                      <button className="btn btn-outline-primary" onClick={() => handleEdit(idx)}><FaEdit /></button>
                      <button className="btn btn-outline-danger" onClick={() => handleDelete(form._id)}><FaTrash /></button>
                    </div>
                  </div>
                </div>
              ) : (

                <>
                  <div className="container">
                    <div className="border p-4 rounded">
                      <div className="text-center mb-4">
                        <input
                          type="text"
                          className="form-control form-control-lg text-center"
                          placeholder="Enter Sub Title"
                          value={form.title}
                          onChange={(e) => handleInput(idx, 'title', e.target.value)}
                        />
                      </div>

                      <div className="row">
                        <div className="col-md-6 d-flex flex-column gap-3">
                          {[0, 1].map((i) => (
                            <div
                              key={i}
                              className="border rounded d-flex justify-content-center align-items-center"
                              style={{
                                cursor: 'pointer',
                                backgroundColor: '#f8f9fa',
                                position: 'relative',
                                overflow: 'hidden',
                                minHeight: '100px',
                                maxHeight: '300px',
                                padding: '10px',
                              }}
                              onClick={() => document.getElementById(`image-input-${idx}-${i}`).click()}
                            >
                              {form.previews[i] ? (
                                <img
                                  src={form.previews[i]}
                                  alt="preview"
                                  style={{
                                    width: '100%',
                                    height: 'auto',
                                    objectFit: 'contain',
                                    maxHeight: '100%',
                                  }}
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

                        <div className="col-md-6">
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

                    </div>
                  </div>

                  {/* Add Another Goal button only at the last form */}
                  {idx === forms.length - 1 && (
                    <div className="text-end mt-4">
                      <button
                        type="button"
                        className="btn btn-outline-primary d-flex align-items-center gap-2"
                        onClick={() => setForms(prev => [...prev, createEmptyForm()])}
                      >
                        <FaPlusCircle />
                        Add Another Goal
                      </button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </React.Fragment>
        ))}
      </AnimatePresence>
      {viewMode && forms.length > 0 && !forms[0]?.isViewMode && (
        <div className="text-end mt-4">
          <button
            className="btn btn-primary"
            onClick={isEditMode ? handleUpdateAll : handleSubmitAll}
          >
            {isEditMode ? 'Update Goals' : 'Submit All Goals'}
          </button>
        </div>
      )}



      {!viewMode && (
        <>
          <h4 className="text-center text-primary fw-bold mb-4 border-bottom pb-2">📅 Goals by Year</h4>
          {Object.entries(groupedGoals).map(([year, yearGoals]) => (
            <motion.div key={year} className="bg-light border-start border-4 border-primary rounded shadow-sm px-4 py-3 mb-4" whileHover={{ scale: 1.01 }}>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center bg-white border rounded-pill px-3 py-1 shadow-sm">
                  <FaCalendarAlt className="text-primary me-2" />
                  <span className="text-dark fw-semibold fs-5">{year}</span>
                  <span className="badge bg-primary ms-2">{yearGoals.length} goal{yearGoals.length > 1 ? 's' : ''}</span>
                </div>
                <div className="flex-grow-1 text-center">
                  <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                    {yearGoals[0]?.mainTitle}
                  </span>
                </div>
                <button className="btn btn-outline-primary rounded-circle" style={{ width: 42, height: 42 }} onClick={() => {
                  console.log('yearGoals:', yearGoals);
                  handleViewGoal(yearGoals);
                }}>
                  <FaEye size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </>
      )}
    </motion.div>
  );
};

export default Goals;



