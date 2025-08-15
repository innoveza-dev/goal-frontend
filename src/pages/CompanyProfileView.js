import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { FaYahoo, FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import Swal from 'sweetalert2';
// import API_BASE_URL from '../api';

const CompanyProfileView = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    const API_BASE_URL = process.env.REACT_APP_API_URL;

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


    const cleanSocialLink = (link) => (link && link !== 'N/A' ? link : '');

    const fetchProfile = async () => {
        try {
            console.log("Fetching profile with ID:", id);

            const token = localStorage.getItem('token');
            if (!token) {
                console.warn("Token not found.");
                showToast('error', 'Authentication token not found!');
                return;
            }

            const res = await axios.get(`${API_BASE_URL}/api/company-profiles/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const profileData = res.data;

            if (!profileData || Object.keys(profileData).length === 0) {
                showToast('warning', 'Profile not found!');
                return;
            }


            const socialLinks = {
                Yahoo: cleanSocialLink(profileData.socialYahoo),
                Facebook: cleanSocialLink(profileData.socialFacebook),
                Instagram: cleanSocialLink(profileData.socialInstagram),
                Twitter: cleanSocialLink(profileData.socialTwitter),
                Youtube: cleanSocialLink(profileData.socialYoutube),
            };

            profileData.socialLinks = socialLinks;
            setProfile(profileData);

            showToast('success', 'Profile loaded successfully!');
        } catch (error) {
            console.error('Error fetching profile', error);
            showToast('error', 'Failed to load profile.');
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [id]);

    if (!profile) {
        return <div className="container py-5 text-center">Loading profile, please wait...</div>;
    }

    const socialIcons = {
        Yahoo: <FaYahoo color="#430297" />,
        Facebook: <FaFacebook color="#3b5998" />,
        Instagram: <FaInstagram color="#e4405f" />,
        Twitter: <FaTwitter color="#1da1f2" />,
        Youtube: <FaYoutube color="#ff0000" />,
    };

    const handleBack = () => {
        showToast('info', 'Going back...');
        navigate(-1);
    };

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-primary">Company Profile</h2>
                <Button
                    variant="outline-primary"
                    className="fw-semibold shadow-sm px-4 py-2"
                    onClick={handleBack}
                >
                    ⬅ Go Back
                </Button>
            </div>

            <div className="card border-0 shadow-lg mb-5">
                <div className="card-body">
                    <div className="row g-4 mb-4 align-items-center">
                        <div className="col-md-3 text-center">
                            {profile.logoUrl ? (
                                <img
                                    src={`${API_BASE_URL}/companyLogos/${profile.logoUrl}`}
                                    alt="Company Logo"
                                    className="img-fluid rounded shadow-sm border p-2 bg-white"
                                    style={{ maxHeight: '150px', objectFit: 'contain' }}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/default-logo.png';
                                    }}
                                />
                            ) : (
                                <div className="text-muted small">No Logo Available</div>
                            )}
                        </div>

                        <div className="col-md-9">
                            <h4 className="fw-bold text-dark border-bottom pb-2 mb-3">
                                {profile.companyName}
                            </h4>

                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="bg-light border rounded p-2 shadow-sm h-100">
                                        <strong className="text-muted small">Email</strong>
                                        <div>{profile.emailId || 'N/A'}</div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="bg-light border rounded p-2 shadow-sm h-100">
                                        <strong className="text-muted small">Password (Hashed)</strong>
                                        <div className="text-break">
                                            {profile.password || 'N/A'}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="bg-light border rounded p-2 shadow-sm h-100">
                                        <strong className="text-muted small">Mobile</strong>
                                        <div>{profile.mobileNumber || 'N/A'}</div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="bg-light border rounded p-2 shadow-sm h-100">
                                        <strong className="text-muted small">WhatsApp</strong>
                                        <div>{profile.whatsappNumber || 'N/A'}</div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="bg-light border rounded p-2 shadow-sm h-100">
                                        <strong className="text-muted small">Website</strong>
                                        <div>{profile.website || 'N/A'}</div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="bg-light border rounded p-2 shadow-sm h-100">
                                        <strong className="text-muted small">Company Type</strong>
                                        <div>{profile.companyType || 'N/A'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="mb-4" />

                    {/* Address */}
                    <div className="mb-4">
                        <h5 className="fw-semibold text-secondary mb-3">Address</h5>
                        <div className="card bg-light border-0 shadow-sm mb-3">
                            <div className="card-body p-3">
                                <div className="mb-3">
                                    <div className="fw-semibold small text-muted">Full Address</div>
                                    <div>{profile.address || 'N/A'}</div>
                                </div>

                                <div className="row row-cols-2 row-cols-md-4 g-3">
                                    <div className="col">
                                        <div className="border rounded p-2 bg-light shadow-sm h-100">
                                            <div className="fw-semibold small text-muted">City</div>
                                            <div>{profile.city || 'N/A'}</div>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="border rounded p-2 bg-light shadow-sm h-100">
                                            <div className="fw-semibold small text-muted">State</div>
                                            <div>{profile.state || 'N/A'}</div>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="border rounded p-2 bg-light shadow-sm h-100">
                                            <div className="fw-semibold small text-muted">Nation</div>
                                            <div>{profile.nation || 'N/A'}</div>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="border rounded p-2 bg-light shadow-sm h-100">
                                            <div className="fw-semibold small text-muted">Pincode</div>
                                            <div>{profile.pincode || 'N/A'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* About Company */}
                    <div className="mb-5">
                        <h5 className="fw-semibold text-secondary mb-3">About Company</h5>
                        <div className="card border-0 bg-light p-3 shadow-sm">
                            <p className="mb-0">{profile.aboutCompany || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Social Media Links */}
                    <div className="mb-4">
                        <h5 className="fw-semibold text-secondary mb-3">Social Media Links</h5>
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
                            {profile.socialLinks && typeof profile.socialLinks === 'object' ? (
                                Object.entries(profile.socialLinks).map(([label, value], index) => (
                                    <div className="col" key={index}>
                                        <div className="card h-100 border-0 shadow-sm p-3 d-flex flex-column justify-content-between">
                                            <div className="fw-semibold mb-2 text-muted d-flex align-items-center gap-2">
                                                {socialIcons[label] || null}
                                                {label}
                                            </div>
                                            {value ? (
                                                <a
                                                    href={value}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-decoration-none text-primary small"
                                                >
                                                    {value}
                                                </a>
                                            ) : (
                                                <span className="text-muted small">N/A</span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-muted">No social links available</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyProfileView;
