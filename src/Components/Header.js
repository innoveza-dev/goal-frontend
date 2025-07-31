import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@mdi/font/css/materialdesignicons.min.css';

// Dummy function to get user role. Replace with real auth/user context as needed.
function getUserRole() {
    return localStorage.getItem('role') || 'user';
}

function Header() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        firstName: '',
        photo: '',
    });
    const userRole = getUserRole();
    
    useEffect(() => {
        const loadProfile = () => {
            const data = JSON.parse(localStorage.getItem('user')) || {};
            if (data) {
                setProfile(data);
            }
        };

        loadProfile();
        window.addEventListener('profileDataUpdated', loadProfile);

        return () => {
            window.removeEventListener('profileDataUpdated', loadProfile);
        };
    }, []);

    const profileImage = profile?.photo
        ? `http://localhost:5000/uploads/${profile.photo}`
        : 'assets/images/users/avatar-1.jpg';
    const handleGoToProfile = () => {
        navigate('/personal-profile');
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/signup');
    };

    return (
        <header id="page-topbar">
            <div className="navbar-header">
                <div className="navbar-brand-box d-flex align-items-left align-items-center">
                    <img src="/assets/images/logo-small.png" alt="Logo" height="24" style={{ marginRight: '8px' }} />

                    <span className="font-weight-bold mb-0 text-nowrap d-block" style={{ color: 'white', fontSize: '20px' }}>Soft Goal</span>

                    <button type="button" className="btn btn-sm mr-2 d-lg-none px-3 font-size-16 header-item waves-effect waves-light" id="vertical-menu-btn">
                        <i className="fa fa-fw fa-bars"></i>
                    </button>
                </div>


                <div className="d-flex align-items-center">

                    <div className="dropdown d-inline-block ml-2">
                        <button
                            type="button"
                            className="btn header-item waves-effect waves-light"
                            id="page-header-user-dropdown"
                            data-bs-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                        >
                            <img
                                className="rounded-circle header-profile-user"
                                src={profileImage}
                                alt="Header Avatar"
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    objectFit: 'cover',
                                    objectPosition: 'top center'
                                }}
                            />

                            <span className="d-none d-sm-inline-block ml-1">
                                {profile.firstName || 'Guest'}
                            </span>
                            <i className="mdi mdi-chevron-down d-none d-sm-inline-block"></i>
                        </button>

                        <div className="dropdown-menu dropdown-menu-end" aria-labelledby="page-header-user-dropdown">
                            <a
                                className="dropdown-item d-flex align-items-center justify-content-between"
                                href="#"
                                onClick={async (e) => {
                                    e.preventDefault();
                                    if (userRole !== 'superadmin') {
                                        try {
                                            const token = localStorage.getItem('token');
                                            const res = await fetch('http://localhost:5000/api/company-profiles', {
                                                headers: { Authorization: `Bearer ${token}` }
                                            });
                                            if (!res.ok) {
                                                const errData = await res.json();
                                                alert(errData.message || 'Failed to fetch company profile.');
                                                return;
                                            }
                                            const data = await res.json();
                                            const firstId = data && data.length > 0 ? (data[0]._id || data[0].id) : null;
                                            if (firstId) {
                                                navigate(`/company-profile/edit/${firstId}`);
                                            } else {
                                                alert('No company profile found for your account.');
                                            }
                                        } catch (err) {
                                            alert('An error occurred while fetching your company profile.');
                                        }
                                    }
                                }}
                            >
                                <span>Company Profile</span>
                            </a>
                            <a
                                className="dropdown-item d-flex align-items-center justify-content-between"
                                href="#"
                                onClick={handleGoToProfile}
                            >
                                <span>Profile</span>
                            </a>
                            <a
                                className="dropdown-item d-flex align-items-center justify-content-between"
                                href="#"
                                onClick={handleLogout}
                            >
                                <span>Log Out</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
