import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    const [isOrgSetupOpen, setIsOrgSetupOpen] = useState(false);

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

                            <li style={{ marginBottom: '10px' }}>
                                <Link
                                    to="/dashboard"
                                    className="waves-effect"
                                    style={isActive('/dashboard') ? activeLinkStyle : normalDashboardStyle}
                                >
                                    <i className="mdi mdi-view-dashboard" style={{ marginRight: '10px' }}></i>
                                    <span style={{ flexGrow: 1 }}>Dashboard</span>
                                    <span style={{
                                        backgroundColor: '#17a2b8',
                                        color: 'white',
                                        borderRadius: '12px',
                                        padding: '2px 8px',
                                        fontSize: '12px',
                                        fontWeight: 'bold'
                                    }}>3</span>
                                </Link>
                            </li>

                            <li>
                                <a
                                    href="#"
                                    onClick={toggleOrgSetup}
                                    className={`has-arrow waves-effect ${isOrgSetupOpen ? 'active' : ''}`}
                                    style={{
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '8px 10px',
                                        color: isOrgSetupOpen ? '#4a90e2' : '#000',
                                        fontWeight: isOrgSetupOpen ? 'bold' : 'normal',
                                        borderRadius: '4px',
                                        userSelect: 'none',
                                        textDecoration: 'none',
                                        marginBottom: '5px'
                                    }}
                                >
                                    <i className="mdi mdi-book-open-page-variant" style={{ marginRight: '10px' }}></i>
                                    <span>Organization Setup</span>
                                    <span style={{ marginLeft: 'auto', fontSize: '12px', transform: isOrgSetupOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
                                        ▶
                                    </span>
                                </a>

                                {isOrgSetupOpen && (
                                    <ul className="sub-menu" aria-expanded="true" style={{ listStyle: 'none', paddingLeft: '20px', marginTop: 0 }}>
                                        {/* <li>
                                            <Link
                                                to="/company-profile"
                                                style={isActive('/company-profile') ? activeSubMenuStyle : normalSubMenuStyle}
                                            >
                                                Company Profile
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/personal-profile"
                                                style={isActive('/personal-profile') ? activeSubMenuStyle : normalSubMenuStyle}
                                            >
                                                Personal Profile
                                            </Link>
                                        </li> */}
                                        <li>
                                            <Link
                                                to="/vision-mission-core"
                                                style={isActive('/vision-mission-core') ? activeSubMenuStyle : normalSubMenuStyle}
                                            >
                                                Vision | Mission | Core
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/goals"
                                                style={isActive('/goals') ? activeSubMenuStyle : normalSubMenuStyle}
                                            >
                                                Goals
                                            </Link>
                                        </li>
                                    </ul>
                                )}
                            </li>
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
