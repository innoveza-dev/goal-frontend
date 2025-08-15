import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FaYahoo, FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import Swal from 'sweetalert2';
// import API_BASE_URL from '../api';

const companyTypes = [
  'Private Limited', 'Public Limited', 'Partnership', 'LLP',
  'Sole Proprietorship', 'Government', 'NGO',
];

const API_BASE_URL = process.env.REACT_APP_API_URL;

const socialPlatforms = [
  { name: 'Yahoo', icon: <FaYahoo size={30} color="#430297" /> },
  { name: 'Facebook', icon: <FaFacebook size={30} color="#3b5998" /> },
  { name: 'Instagram', icon: <FaInstagram size={30} color="#e4405f" /> },
  { name: 'Twitter', icon: <FaTwitter size={30} color="#1da1f2" /> },
  { name: 'YouTube', icon: <FaYoutube size={30} color="#ff0000" /> },
];


const getUserRole = () => localStorage.getItem('role') || 'user';

const CompanyProfile = () => {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [socialLinks, setSocialLinks] = useState({
    Yahoo: '', Facebook: '', Instagram: '', Twitter: '', YouTube: '',
  });
  const [editingSocial, setEditingSocial] = useState(null);
  const [tempLink, setTempLink] = useState('');
  const userRole = getUserRole();
  const [isEdit, setIsEdit] = useState(false);
  const [formDataState, setFormDataState] = useState({});


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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = formRef.current;
    form.classList.remove('was-validated');
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      showToast('warning', 'Please fill out all required fields.');
      return;
    }

    const formData = new FormData(form);
    if (logo) formData.set('logoUrl', logo);

    formData.set('socialYahoo', socialLinks.Yahoo || '');
    formData.set('socialFacebook', socialLinks.Facebook || '');
    formData.set('socialInstagram', socialLinks.Instagram || '');
    formData.set('socialTwitter', socialLinks.Twitter || '');
    formData.set('socialYoutube', socialLinks.YouTube || '');

    try {
      const token = localStorage.getItem('token');
      if (isEdit && id) {
        await axios.put(`${API_BASE_URL}/api/company-profiles/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        showToast('success', 'Company profile updated successfully!');
      } else {
        await axios.post(`${API_BASE_URL}/api/company-profiles`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        showToast('success', 'Company profile created successfully!');
      }
      form.reset();
      setLogo(null);
      setLogoPreview(null);
      setSocialLinks({ Yahoo: '', Facebook: '', Instagram: '', Twitter: '', YouTube: '' });
      if(localStorage.getItem('role') === 'superadmin') {
        navigate('/company-profile');
      }else {
        navigate('/vision-mission-core');
      }
    } catch (error) {
      console.error(error);
      const msg = error?.response?.data?.message || (isEdit ? 'Error updating profile.' : 'Error creating profile.');
      showToast('error', msg);
    }
  };

  // Fetch profile data if editing
  useEffect(() => {
    if (id) {
      setIsEdit(true);
      (async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(`${API_BASE_URL}/api/company-profiles/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = res.data;
          setFormDataState(data);
          setLogoPreview(data.logoUrl ? `${API_BASE_URL}/companyLogos/${data.logoUrl}` : null);
          setSocialLinks(data.socialLinks || { Yahoo: '', Facebook: '', Instagram: '', Twitter: '', YouTube: '' });
          // Set form values
          setTimeout(() => {
            if (formRef.current) {
              Object.keys(data).forEach(key => {
                if (formRef.current[key] && data[key] && formRef.current[key].type !== 'file') {
                  formRef.current[key].value = data[key];
                }
              });
            }
          }, 100);
        } catch (err) {
          showToast('error', 'Failed to load company profile for editing.');
        }
      })();
    } else {
      setIsEdit(false);
    }
  }, [id]);

  const openSocialPopup = (platform) => {
    setTempLink(socialLinks[platform] || '');
    setEditingSocial(platform);
  };

  const saveSocialLink = () => {
    setSocialLinks({ ...socialLinks, [editingSocial]: tempLink.trim() });
    setEditingSocial(null);
    setTempLink('');
  };

  const currentIcon = editingSocial ? socialPlatforms.find(sp => sp.name === editingSocial)?.icon : null;

  return (
    <div className="container py-5">
      <h2 className="text-center text-primary fw-bold mb-4">{isEdit ? 'Edit Company Profile' : 'Create Company Profile'}</h2>
      <div className="shadow p-4 rounded bg-light">
        <form ref={formRef} className="needs-validation" noValidate onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Upload Logo</label>
              <input
                type="file"
                name="logoUrl"
                className="form-control"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setLogo(file);
                  setLogoPreview(file ? URL.createObjectURL(file) : null);
                }}
              />
            </div>
            <div className="col-md-6 text-center">
              {logoPreview && (
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  className="img-thumbnail mt-2"
                  style={{ maxHeight: 150 }}
                />
              )}
            </div>
          </div>


          <div className="mb-3">
            <label className="form-label">Company Name</label>
            <input type="text" name="companyName" className="form-control" required />
          </div>

          <div className="row mb-3">
            <div className="col-md-3">
              <label className="form-label">Email ID</label>
              <input type="email" name="emailId" className="form-control" required />
            </div>
            {userRole === 'superadmin' && (
              <div className="col-md-3">
                <label className="form-label">Password</label>
                <input type="password" name="password" className="form-control" required />
              </div>
            )}
            <div className="col-md-3">
              <label className="form-label">Mobile Number</label>
              <input type="text" name="mobileNumber" className="form-control" required />
            </div>
            <div className="col-md-3">
              <label className="form-label">WhatsApp Number</label>
              <input type="text" name="whatsappNumber" className="form-control" />
            </div>
          </div>


          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Website</label>
              <input type="url" name="website" className="form-control" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Company Type</label>
              <select name="companyType" className="form-select" required>
                <option value="">Select Type</option>
                {companyTypes.map((type, idx) => (
                  <option key={idx} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Address</label>
            <textarea name="address" className="form-control" rows={2} required></textarea>
          </div>

          <div className="row mb-3">
            {['state', 'city', 'nation', 'pincode'].map((field, idx) => (
              <div className="col-md-3" key={idx}>
                <label className="form-label text-capitalize">{field}</label>
                <input type="text" name={field} className="form-control" required />
              </div>
            ))}
          </div>

          <div className="mb-3">
            <label className="form-label">About Company</label>
            <textarea name="aboutCompany" className="form-control" rows={4} maxLength={600}></textarea>
          </div>

          {/* Social Links */}
          <div className="mb-3 d-flex justify-content-center gap-4">
            {socialPlatforms.map(({ name, icon }) => (
              <span
                key={name}
                style={{ cursor: 'pointer' }}
                title={socialLinks[name] ? `${name} Link Added` : `Add ${name} Link`}
                onClick={() => openSocialPopup(name)}
              >
                {icon}
              </span>
            ))}
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-primary px-4">{isEdit ? 'Update Profile' : 'Create Profile'}</button>
          </div>
        </form>

        {/* Social Link Modal */}
        {editingSocial && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ background: 'rgba(0,0,0,0.6)', zIndex: 1050 }}
            onClick={() => setEditingSocial(null)}
          >
            <div
              className="bg-white p-4 rounded shadow"
              style={{ maxWidth: 500, width: '90%' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="d-flex align-items-center gap-3 mb-3">
                <div>{currentIcon}</div>
                <h5 className="mb-0">Add {editingSocial} Link</h5>
              </div>
              <input
                type="url"
                className="form-control"
                placeholder={`Enter full ${editingSocial} URL`}
                value={tempLink}
                onChange={(e) => setTempLink(e.target.value)}
                autoFocus
              />
              <div className="d-flex justify-content-end gap-2 mt-3">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingSocial(null)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={saveSocialLink}>Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyProfile;
