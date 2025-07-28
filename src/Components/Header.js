import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@mdi/font/css/materialdesignicons.min.css';

function Header() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        firstName: '',
        photo: '',
    });

    useEffect(() => {
        const loadProfile = () => {
            const data = JSON.parse(localStorage.getItem('profileData'));
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
        localStorage.removeItem('token');
        localStorage.removeItem('user');
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

                    <div class="dropdown d-none d-sm-inline-block ml-2" id="searchDropdownWrapper">
                        <button type="button" class="btn header-item noti-icon waves-effect waves-light"
                            id="page-header-search-dropdown">
                            <i class="mdi mdi-magnify"></i>
                        </button>

                        <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right p-0" id="searchDropdownMenu">
                            <form class="p-3">
                                <div class="form-group m-0">
                                    <div class="input-group">
                                        <input type="text" class="form-control" placeholder="Search ..." aria-label="Search input" />
                                        <div class="input-group-append">
                                            <button class="btn btn-primary" type="submit">
                                                <i class="mdi mdi-magnify"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="dropdown d-inline-block">
                        <button
                            type="button"
                            className="btn header-item"
                            data-bs-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                        >
                            <img src="assets/images/flags/us.jpg" alt="Header Language" height="16" />
                            <span className="d-none d-sm-inline-block ms-1">English</span>
                            <i className="mdi mdi-chevron-down d-none d-sm-inline-block"></i>
                        </button>

                        <div className="dropdown-menu dropdown-menu-end">
                            <a href="#" className="dropdown-item notify-item">
                                <img src="https://flagcdn.com/w40/in.png" alt="India" className="me-1" height="12" />
                                <span className="align-middle">Hindi</span>
                            </a>
                            <a href="#" className="dropdown-item notify-item">
                                <img src="assets/images/flags/spain.jpg" alt="Spanish" className="me-1" height="12" />
                                <span className="align-middle">Spanish</span>
                            </a>
                            <a href="#" className="dropdown-item notify-item">
                                <img src="assets/images/flags/french.jpg" alt="French" className="me-1" height="12" />
                                <span className="align-middle">French</span>
                            </a>
                            <a href="#" className="dropdown-item notify-item">
                                <img src="assets/images/flags/germany.jpg" alt="German" className="me-1" height="12" />
                                <span className="align-middle">German</span>
                            </a>
                            <a href="#" className="dropdown-item notify-item">
                                <img src="assets/images/flags/italy.jpg" alt="Italian" className="me-1" height="12" />
                                <span className="align-middle">Italian</span>
                            </a>
                            <a href="#" className="dropdown-item notify-item">
                                <img src="assets/images/flags/russia.jpg" alt="Russian" className="me-1" height="12" />
                                <span className="align-middle">Russian</span>
                            </a>
                        </div>
                    </div>

                    <div className="dropdown d-inline-block position-relative">
                        <button
                            type="button"
                            className="btn header-item noti-icon waves-effect waves-light position-relative"
                            id="page-header-notifications-dropdown"
                            data-bs-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                        >
                            <i className="mdi mdi-bell fs-4"></i>

                            <span
                                className="badge badge-danger badge-pill position-absolute"
                                style={{
                                    top: '14px',
                                    right: '5px',
                                    fontSize: '10px',
                                    padding: '3px 6px',
                                    lineHeight: '1',
                                }}
                            >
                                5
                            </span>
                        </button>


                        <ul
                            className="dropdown-menu dropdown-menu-end shadow p-0 mt-2"
                            aria-labelledby="notificationDropdown"
                            style={{ minWidth: '320px', width: '320px' }}
                        >
                            <li className="border-bottom px-3 py-2 bg-light d-flex justify-content-between align-items-center">
                                <span className="fw-bold">Notifications</span>
                                <a href="#!" className="text-primary small">
                                    View All
                                </a>
                            </li>

                            {/* Notification Item 1: Project Deadline */}
                            <li>
                                <a href="#!" className="dropdown-item px-3 py-2 d-flex align-items-start gap-2">
                                    <div
                                        className="bg-danger text-white rounded-circle d-flex justify-content-center align-items-center"
                                        style={{ width: '40px', height: '40px' }}
                                    >
                                        <i className="mdi mdi-calendar-alert-outline fs-5"></i>
                                    </div>
                                    <div>
                                        <div className="fw-semibold">Project Deadline Reminder</div>
                                        <small className="text-muted">Due today by 5 PM</small>
                                    </div>
                                </a>
                            </li>


                            {/* Notification Item 2: New Client Message */}
                            <li>
                                <a href="#!" className="dropdown-item px-3 py-2 d-flex align-items-start gap-2">
                                    <div
                                        className="bg-success text-white rounded-circle d-flex justify-content-center align-items-center"
                                        style={{ width: '40px', height: '40px' }}
                                    >
                                        <i className="mdi mdi-email-outline fs-5"></i>
                                    </div>
                                    <div>
                                        <div className="fw-semibold">New Client Message</div>
                                        <small className="text-muted">XYZ Corp sent a message</small>
                                    </div>
                                </a>
                            </li>

                            {/* Notification Item 3: System Update */}
                            <li>
                                <a href="#!" className="dropdown-item px-3 py-2 d-flex align-items-start gap-2">
                                    <div
                                        className="bg-warning text-white rounded-circle d-flex justify-content-center align-items-center"
                                        style={{ width: '40px', height: '40px' }}
                                    >
                                        <i className="mdi mdi-laptop-off fs-5"></i>
                                    </div>
                                    <div>
                                        <div className="fw-semibold">System Update</div>
                                        <small className="text-muted">Downtime tonight 11 PM</small>
                                    </div>
                                </a>
                            </li>

                            {/* Notification Item 4: Task Completed */}
                            <li>
                                <a href="#!" className="dropdown-item px-3 py-2 d-flex align-items-start gap-2">
                                    <div
                                        className="bg-info text-white rounded-circle d-flex justify-content-center align-items-center"
                                        style={{ width: '40px', height: '40px' }}
                                    >
                                        <i className="mdi mdi-check-circle-outline fs-5"></i>
                                    </div>
                                    <div>
                                        <div className="fw-semibold">Task Completed</div>
                                        <small className="text-muted">Design task marked as complete</small>
                                    </div>
                                </a>
                            </li>

                            {/* Notification Item 5: User Joined */}
                            <li>
                                <a href="#!" className="dropdown-item px-3 py-2 d-flex align-items-start gap-2">
                                    <div
                                        className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center"
                                        style={{ width: '40px', height: '40px' }}
                                    >
                                        <i className="mdi mdi-account-plus-outline fs-5"></i>
                                    </div>
                                    <div>
                                        <div className="fw-semibold">New Member Joined</div>
                                        <small className="text-muted">John added to your team</small>
                                    </div>
                                </a>
                            </li>


                            {/* Footer */}
                            <li className="border-top text-center p-2">
                                <a href="#!" className="btn btn-sm btn-light w-100">
                                    <i className="mdi mdi-arrow-down-circle me-1"></i> Load More
                                </a>
                            </li>
                        </ul>
                    </div>



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
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/company-profile');
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
                                <span><span className="badge bg-warning rounded-pill">1</span></span>
                            </a>
                            <a className="dropdown-item d-flex align-items-center justify-content-between" href="#">
                                Settings
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
