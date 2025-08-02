import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL;

// Dummy function to get user role. Replace with real auth/user context as needed.
function getUserRole() {
    // Example: return localStorage.getItem('role') || 'user';
    // For now, just return a hardcoded value for demonstration.
    return localStorage.getItem('role') || 'user';
}

const Sidebar = () => {
    const location = useLocation();
    const [isOrgSetupOpen, setIsOrgSetupOpen] = useState(false);
    const userRole = getUserRole();

    const toggleOrgSetup = (e) => {
        e.preventDefault();
        setIsOrgSetupOpen(prev => !prev);
    };

    const activeLinkStyle = {
        fontWeight: 'bold',
        color: '#4a90e2',
        backgroundColor: '#e6f0ff',
        borderRadius: '4px',
        padding: '8px 10px',
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none'
    };


    const normalDashboardStyle = {
        color: '#000',
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        padding: '8px 10px',
        borderRadius: '4px'
    };

    const activeSubMenuStyle = {
        fontWeight: 'bold',
        color: '#4a90e2',
        backgroundColor: '#e6f0ff',
        borderRadius: '4px',
        padding: '5px 10px',
        display: 'block',
        textDecoration: 'none'
    };

    const normalSubMenuStyle = {
        color: '#000',
        padding: '5px 10px',
        display: 'block',
        textDecoration: 'none'
    };

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* ========== Left Sidebar Start ========== */}
            <div className="vertical-menu" style={{ width: '250px', backgroundColor: '#f8f9fa', height: '100vh', overflowY: 'auto' }}>
                <div data-simplebar style={{ height: '100%' }}>
                    {/* Sidemenu */}
                    <div id="sidebar-menu" style={{ padding: '15px' }}>
                        {/* Left Menu Start */}
                        <ul className="metismenu list-unstyled" id="side-menu" style={{ listStyle: 'none', paddingLeft: 0 }}>
                            <li className="menu-title" style={{ marginBottom: '15px', fontWeight: 'bold', fontSize: '16px', color: '#333' }}>
                                Menu
                            </li>
                            {/* Only show Company menu for supperadmin, otherwise show Vision/Mission/Core and Goals */}
                            {userRole === 'superadmin' ? (
                                <li style={{ marginBottom: '10px' }}>
                                    <Link
                                        to="/company-profile"
                                        className="waves-effect"
                                        style={isActive('/company-profile') ? activeLinkStyle : normalDashboardStyle}
                                    >
                                        <i className="mdi mdi-domain" style={{ marginRight: '10px' }}></i>
                                        <span style={{ flexGrow: 1 }}>Company</span>
                                    </Link>
                                </li>
                            ) : (
                                <>
                                    <li style={{ marginBottom: '10px' }}>
                                        <Link
                                            to="/vision-mission-core"
                                            className="waves-effect"
                                            style={isActive('/vision-mission-core') ? activeLinkStyle : normalDashboardStyle}
                                        >
                                            <i className="mdi mdi-view-dashboard" style={{ marginRight: '10px' }}></i>
                                            <span style={{ flexGrow: 1 }}>Vision | Mission | Core</span>
                                        </Link>
                                    </li>
                                    <li style={{ marginBottom: '10px' }}>
                                        <Link
                                            to="/goals"
                                            className="waves-effect"
                                            style={isActive('/goals') ? activeLinkStyle : normalDashboardStyle}
                                        >
                                            <i className="mdi mdi-view-dashboard" style={{ marginRight: '10px' }}></i>
                                            <span style={{ flexGrow: 1 }}>Goals</span>
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                    {/* Sidebar */}
                </div>
            </div>
            {/* Left Sidebar End */}
        </>
    );
};

export default Sidebar;
