import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaSave } from 'react-icons/fa';
// import API_BASE_URL from '../api';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const ProfileFormPage = () => {
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    photo: '',
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    gender: '',
    dateOfBirth: '',
    anniversaryDate: '',
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const [userId, setUserId] = useState('');

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

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      setFormData({ ...res.data, photo: '' });
      showToast('success', 'Profile loaded successfully!');

      localStorage.setItem('profileData', JSON.stringify(res.data));

      const reloadEvent = new CustomEvent('profileDataUpdated');
      window.dispatchEvent(reloadEvent);

      if (res.data.photo) {
        setPreviewUrl(`${API_BASE_URL}/uploads/${res.data.photo}`);
      }
    } catch (err) {
      console.warn('No profile yet.');
      showToast('warning', 'No profile found. Please complete your profile.');
    }
  };


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.id) setUserId(user.id);
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo' && files?.[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
      setFormData((prev) => ({ ...prev, [name]: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add('was-validated');
      return;
    }

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'photo' && !value) return;
      payload.append(key, value);
    });

    try {
      await axios.post(`${API_BASE_URL}/api/user/profile`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      showToast('success', 'Profile saved');
      fetchProfile();
      form.classList.remove('was-validated');
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Save failed');
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <h3 className="text-primary fw-bold mb-4">Update Personal Profile</h3>
      <form
        ref={formRef}
        className="needs-validation border rounded p-4 bg-light shadow-sm"
        noValidate
        onSubmit={handleSubmit}
      >
        <div className="row">
          <div className="col-md-4">
            <div className="border p-2 bg-white text-center rounded">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="img-fluid rounded"
                  style={{ height: '250px', objectFit: 'contain' }}
                />
              ) : (
                <div
                  className="text-muted d-flex justify-content-center align-items-center"
                  style={{ height: '250px' }}
                >
                  No Image
                </div>
              )}
            </div>
            <input
              type="file"
              name="photo"
              accept="image/*"
              className="form-control mt-2"
              onChange={handleChange}
            />
          </div>

          <div className="col-md-8">
            <div className="row">
              {[
                { name: 'firstName', label: 'First Name' },
                { name: 'lastName', label: 'Last Name' },
                { name: 'email', label: 'Email', type: 'email' },
                { name: 'mobile', label: 'Mobile', pattern: '\\d{10}' },
              ].map((field, i) => (
                <div key={i} className="col-md-6 mb-3">
                  <label className="fw-semibold">{field.label}</label>
                  <input
                    type={field.type || 'text'}
                    name={field.name}
                    className="form-control"
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                    pattern={field.pattern}
                  />
                </div>
              ))}

              <div className="col-md-12 mb-3">
                <label className="fw-semibold">Gender</label>
                <div className="d-flex gap-3">
                  {['male', 'female', 'other'].map((g) => (
                    <div className="form-check" key={g}>
                      <input
                        type="radio"
                        className="form-check-input"
                        name="gender"
                        id={g}
                        value={g}
                        checked={formData.gender === g}
                        onChange={handleChange}
                        required
                      />
                      <label
                        htmlFor={g}
                        className="form-check-label text-capitalize text-primary"
                      >
                        {g}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {['dateOfBirth', 'anniversaryDate'].map((d) => (
                <div key={d} className="col-md-6 mb-3">
                  <label className="fw-semibold">
                    {d === 'dateOfBirth' ? 'Date of Birth' : 'Anniversary Date'}
                  </label>
                  <input
                    type="date"
                    name={d}
                    className="form-control"
                    value={formData[d]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}

            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <button className="btn btn-primary px-4 py-2" type="submit">
            <FaSave className="me-2" /> Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileFormPage;
