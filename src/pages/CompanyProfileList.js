import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaPlus, FaEdit, FaTrash, FaEye,
  FaYahoo, FaFacebook, FaInstagram, FaTwitter, FaYoutube
} from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Swal from 'sweetalert2';
// import API_BASE_URL from '../api';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const companyTypes = [
  'Private Limited', 'Public Limited', 'Partnership', 'LLP',
  'Sole Proprietorship', 'Government', 'NGO',
];

const socialPlatforms = [
  { name: 'Yahoo', icon: <FaYahoo size={22} color="#430297" /> },
  { name: 'Facebook', icon: <FaFacebook size={22} color="#3b5998" /> },
  { name: 'Instagram', icon: <FaInstagram size={22} color="#e4405f" /> },
  { name: 'Twitter', icon: <FaTwitter size={22} color="#1da1f2" /> },
  { name: 'YouTube', icon: <FaYoutube size={22} color="#ff0000" /> },
];

const CompanyProfileList = () => {
  const [profiles, setProfiles] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ socialLinks: {} });
  const [errors, setErrors] = useState({});
  const [editingSocial, setEditingSocial] = useState(null);
  const [tempLink, setTempLink] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const showToast = (icon, title) => {
    Swal.fire({ toast: true, position: 'top-end', icon, title, showConfirmButton: false, timer: 2500 });
  };

  useEffect(() => {
    const savedRole = localStorage.getItem('role')?.toLowerCase();
    setRole(savedRole);

    fetchProfiles();
    const hasUpdated = localStorage.getItem('hasUpdatedProfile');
    if (savedRole === 'admin' && !hasUpdated) {
      fetchAdminProfile(true);
    }
  }, []);

  const parseSocialLinks = (data) => {
    try {
      if (typeof data === 'string') return JSON.parse(data);
      return data || {};
    } catch (e) {
      console.warn('Invalid socialLinks JSON:', data);
      return {};
    }
  };

  const fetchProfiles = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/company-profiles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfiles(res.data);
    } catch (error) {
      console.error(error);
      showToast('error', 'Failed to fetch profiles');
    }
  };

  const fetchAdminProfile = async (showModalOnLoad = false) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/company-profiles`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.length > 0) {
        const profile = res.data[0];
        const id = profile.id || profile._id;
        const socialLinks = parseSocialLinks(profile.socialLinks);
        setEditData({ ...profile, id, socialLinks });

        if (showModalOnLoad) {
          setShowEditModal(true);
        }
      }
    } catch (error) {
      console.error(error);
      showToast('error', 'Failed to fetch admin profile');
    }
  };


  const handleEditClick = (profile) => {
    const id = profile.id || profile._id;
    let socialLinks = parseSocialLinks(profile.socialLinks);

    if (!Object.keys(socialLinks).length) {
      socialLinks = {
        Yahoo: profile.socialYahoo || '',
        Facebook: profile.socialFacebook || '',
        Instagram: profile.socialInstagram || '',
        Twitter: profile.socialTwitter || '',
        YouTube: profile.socialYoutube || '',
      };
    }

    setEditData({ ...profile, id, socialLinks });
    setErrors({});
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialLinkChange = (platform, value) => {
    setEditData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value },
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const is10Digit = /^[0-9]{10}$/;

    if (!is10Digit.test(editData.mobileNumber || '')) {
      newErrors.mobileNumber = 'Mobile number must be exactly 10 digits';
    }
    if (editData.whatsappNumber && !is10Digit.test(editData.whatsappNumber)) {
      newErrors.whatsappNumber = 'WhatsApp number must be exactly 10 digits';
    }
    if (!companyTypes.includes(editData.companyType)) {
      newErrors.companyType = 'Invalid company type selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditSubmit = async () => {
    if (!validateForm()) return showToast('warning', 'Please fix errors');

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      const allowedFields = [
        'companyName', 'emailId', 'password', 'website', 'companyType', 'mobileNumber',
        'whatsappNumber', 'address', 'state', 'city', 'nation', 'pincode',
        'aboutCompany', 'socialLinks'
      ];

      for (const key of allowedFields) {
        if (key === 'socialLinks') {
          formData.append(key, JSON.stringify(editData.socialLinks || {}));
        } else {
          formData.append(key, editData[key] || '');
        }
      }

      if (editData.logoFile) {
        formData.append('logoUrl', editData.logoFile);
      }

      const response = await axios.put(
        `${API_BASE_URL}/api/company-profiles/${editData.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setShowEditModal(false);
      fetchProfiles();
      localStorage.setItem('hasUpdatedProfile', 'true');
      showToast('success', 'Profile updated successfully!');

    } catch (error) {
      console.error('Update Error:', error?.response?.data || error.message);
      showToast('error', error?.response?.data?.message || 'Failed to update profile.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this profile?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_BASE_URL}/api/company-profiles/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchProfiles();
        showToast('success', 'Profile deleted successfully!');
      } catch (err) {
        console.error(err);
        showToast('error', 'Failed to delete profile');
      }
    }
  };

  const openSocialPopup = (platform) => {
    setTempLink(editData.socialLinks?.[platform] || '');
    setEditingSocial(platform);
  };

  const saveSocialLink = () => {
    if (!tempLink.trim()) return showToast('warning', 'Please enter a valid link');
    handleSocialLinkChange(editingSocial, tempLink.trim());
    setEditingSocial(null);
    setTempLink('');
    showToast('success', `${editingSocial} saved`);
  };

  const currentSocialIcon = editingSocial
    ? socialPlatforms.find(p => p.name === editingSocial)?.icon
    : null;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">Company Profiles List</h2>

        {role === 'superadmin' && (
          <button className="btn btn-primary" onClick={() => navigate('/company-profile/add')}>
            <FaPlus className="me-2" /> Add Company
          </button>
        )}
      </div>

      {profiles.length === 0 ? (
        <div className="alert alert-warning">No profiles found.</div>
      ) : (
        <div className="table-responsive shadow-sm border rounded-3">
          <table className="table table-hover table-bordered align-middle mb-0 text-center">
            <thead>
              <tr>
                <th>#</th>
                <th>Logo</th>
                <th>Company Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile, idx) => (
                <tr key={profile._id || profile.id || idx}>
                  <td>{idx + 1}</td>
                  <td>
                    {profile.logoUrl ? (
                      <img
                        src={`${API_BASE_URL}/api/companyLogos/${profile.logoUrl}`}
                        alt="Logo"
                        width="50"
                        height="50"
                        className="rounded-circle object-fit-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/default-logo.png';
                        }}
                      />
                    ) : 'N/A'}
                  </td>
                  <td>{profile.companyName}</td>
                  <td>{profile.emailId}</td>
                  <td>{profile.mobileNumber}</td>
                  <td>{profile.companyType}</td>
                  <td className="text-nowrap">
                    {role === 'superadmin' && (
                      <button
                        className="btn btn-sm text-info border-info me-2"
                        onClick={() => navigate(`/company-profile/view/${profile._id || profile.id}`)}
                        title="View"
                      >
                        <FaEye />
                      </button>
                    )}

                    {(role === 'admin' || role === 'superadmin') && (
                      <button
                        className="btn btn-sm text-primary border-primary me-2"
                        onClick={() => handleEditClick(profile)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                    )}


                    {role === 'superadmin' && (
                      <button
                        className="btn btn-sm text-danger border-danger"
                        onClick={() => handleDelete(profile._id || profile.id)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {['admin', 'superadmin'].includes(role) && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg" backdrop="static" keyboard={false}>
          <Modal.Header closeButton>
            <Modal.Title className="text-primary">Edit Company Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Upload Logo</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setEditData((prev) => ({
                        ...prev,
                        logoFile: file,
                        logoPreview: URL.createObjectURL(file),
                      }));
                    }
                  }}
                />

                {(editData.logoPreview || editData.logoUrl) && (
                  <img
                    src={
                      editData.logoPreview ||
                      `${API_BASE_URL}/api/companyLogos/${editData.logoUrl}`
                    }
                    alt="Logo Preview"
                    height={100}
                    className="mt-2 rounded border"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-logo.png';
                    }}
                  />
                )}
              </Form.Group>


              <Form.Group className="mb-3">
                <Form.Label>Company Name</Form.Label>
                <Form.Control
                  name="companyName"
                  value={editData.companyName || ''}
                  onChange={handleEditChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="emailId"
                  value={editData.emailId || ''}
                  onChange={handleEditChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={editData.password || ''}
                  onChange={handleEditChange}
                  placeholder="Enter new password"
                />
              </Form.Group>


              <Form.Group className="mb-3">
                <Form.Label>Mobile</Form.Label>
                <Form.Control
                  name="mobileNumber"
                  value={editData.mobileNumber || ''}
                  onChange={handleEditChange}
                  isInvalid={!!errors.mobileNumber}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.mobileNumber}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>WhatsApp</Form.Label>
                <Form.Control
                  name="whatsappNumber"
                  value={editData.whatsappNumber || ''}
                  onChange={handleEditChange}
                  isInvalid={!!errors.whatsappNumber}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.whatsappNumber}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Website</Form.Label>
                <Form.Control
                  type="url"
                  name="website"
                  value={editData.website || ''}
                  onChange={handleEditChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Company Type</Form.Label>
                <Form.Select
                  name="companyType"
                  value={editData.companyType || ''}
                  onChange={handleEditChange}
                  isInvalid={!!errors.companyType}
                >
                  <option value="">Select Type</option>
                  {companyTypes.map((type, i) => (
                    <option key={i} value={type}>{type}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.companyType}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  as="textarea"
                  name="address"
                  rows={2}
                  value={editData.address || ''}
                  onChange={handleEditChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>State</Form.Label>
                <Form.Control
                  name="state"
                  value={editData.state || ''}
                  onChange={handleEditChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>City</Form.Label>
                <Form.Control
                  name="city"
                  value={editData.city || ''}
                  onChange={handleEditChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Nation</Form.Label>
                <Form.Control
                  name="nation"
                  value={editData.nation || ''}
                  onChange={handleEditChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Pincode</Form.Label>
                <Form.Control
                  name="pincode"
                  value={editData.pincode || ''}
                  onChange={handleEditChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>About Company</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="aboutCompany"
                  maxLength={600}
                  value={editData.aboutCompany || ''}
                  onChange={handleEditChange}
                />
              </Form.Group>

              {/* Social Links */}
              <hr />
              <h5>Social Links</h5>
              {console.log("🟩 Current socialLinks:", editData.socialLinks)}

              <div className="d-flex gap-3 flex-wrap mb-3">
                {socialPlatforms.map(({ name, icon }) => {
                  const hasLink = editData.socialLinks && editData.socialLinks[name];
                  console.log(`🔗 ${name} link:`, editData.socialLinks?.[name]);
                  return (
                    <Button
                      key={name}
                      variant="outline-secondary"
                      className={`d-flex align-items-center gap-2 ${hasLink ? 'text-success' : ''}`}
                      onClick={() => openSocialPopup(name)}
                      title={hasLink ? `${name} Link Added` : `Add ${name} Link`}
                    >
                      {icon} {name}
                    </Button>
                  );
                })}
              </div>


              {/* Social Modal */}
              {editingSocial && (
                <div
                  className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                  style={{ background: 'rgba(0,0,0,0.6)', zIndex: 1050 }}
                  onClick={() => setEditingSocial(null)}
                >
                  <div
                    className="bg-white p-4 rounded shadow"
                    style={{ maxWidth: 450, width: '90%' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div>{currentSocialIcon}</div>
                      <h5 className="mb-0">Add {editingSocial} Link</h5>
                    </div>
                    <input
                      type="url"
                      className="form-control"
                      placeholder={`Enter full ${editingSocial} URL`}
                      value={tempLink}
                      onChange={(e) => setTempLink(e.target.value)}
                    />
                    <div className="mt-3 d-flex justify-content-end gap-2">
                      <button className="btn btn-secondary" onClick={() => setEditingSocial(null)}>Cancel</button>
                      <button className="btn btn-primary" onClick={saveSocialLink}>Save</button>
                    </div>
                  </div>
                </div>
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
            <Button variant="primary" onClick={handleEditSubmit}>Save Changes</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default CompanyProfileList;


