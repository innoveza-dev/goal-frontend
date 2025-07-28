// import React, { useEffect, useRef, useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit, faSave, faPlus, faTrash, faFilePdf } from '@fortawesome/free-solid-svg-icons';
// import html2pdf from 'html2pdf.js';
// import Swal from 'sweetalert2';

// const VisionMissionCore = () => {
//   const pdfRef = useRef();

//   const showToast = (icon, title) => {
//     Swal.fire({
//       toast: true,
//       position: 'top-end',
//       icon,
//       title,
//       showConfirmButton: false,
//       timer: 2000,
//       timerProgressBar: true,
//     });
//   };

//   const [companyLogo] = useState('https://5.imimg.com/data5/SELLER/Default/2023/10/355852561/BG/UM/LS/14406187/logo-2-250x250.png');

//   const [companyName, setCompanyName] = useState('INNOVEZA BUSINESS SOFTWARE SOLUTIONS');
//   const [companyNameLocked, setCompanyNameLocked] = useState(() => {
//     return localStorage.getItem('companyName') ? true : true;
//   });

//   const [showAllAddForms, setShowAllAddForms] = useState(false);
//   const [personalName, setPersonalName] = useState(() => {
//     return localStorage.getItem('personalName') || '';
//   });
//   const [isEditingName, setIsEditingName] = useState(false);
//   const [personalPhoto, setPersonalPhoto] = useState(() => {
//     return localStorage.getItem('personalPhoto') || 'https://via.placeholder.com/100?text=Photo';
//   });



//   useEffect(() => {
//     if (companyName) {
//       localStorage.setItem('companyName', companyName);
//       setCompanyNameLocked(true);
//     }
//   }, [companyName]);

//   useEffect(() => {
//     localStorage.setItem('personalPhoto', personalPhoto);
//   }, [personalPhoto]);

//   useEffect(() => {
//     localStorage.setItem('personalName', personalName);
//   }, [personalName]);

//   const handleImageChange = (e, type) => {
//     if (type === 'personalPhoto') {
//       const file = e.target.files[0];
//       if (file) {
//         const reader = new FileReader();
//         reader.onload = () => {
//           setPersonalPhoto(reader.result);
//         };
//         reader.readAsDataURL(file);
//       }
//     }
//   };

//   const [visions, setVisions] = useState(() => {
//     const saved = localStorage.getItem('visions');
//     return saved
//       ? JSON.parse(saved)
//       : [
//         {
//           imageUrl: 'https://cdn-icons-png.flaticon.com/256/562/562539.png',
//           title: '1 > Vision',
//           description:
//             'We aim to become a global leader by driving innovation, advancing technology, and promoting sustainable growth. Our vision is to build a future where creativity thrives, change is embraced, and individuals are empowered to make a difference. By uplifting businesses and enriching communities, we strive to create a lasting positive impact on society and future generations. This commitment goes beyond profit about purpose, progress, and people.',
//         },
//       ];
//   });

//   const [missions, setMissions] = useState(() => {
//     const saved = localStorage.getItem('missions');
//     return saved
//       ? JSON.parse(saved)
//       : [
//         {
//           imageUrl: 'https://gnitipu.in/front_assets/images/mission%20image.png',
//           title: '2 > Mission',
//           description:
//             'Our mission is to empower people and businesses with forward-thinking solutions that fuel growth and long-term success. We focus on delivering outstanding value through cutting-edge technology, ethical practices, and a customer-centric mindset. By encouraging teamwork and continuous learning, we strive to make a meaningful and lasting difference in every community we serve.'
//         },
//       ];
//   });


//   useEffect(() => {
//     localStorage.setItem('visions', JSON.stringify(visions));
//   }, [visions]);

//   useEffect(() => {
//     localStorage.setItem('missions', JSON.stringify(missions));
//   }, [missions]);

//   const defaultCoreValues = [
//     { image: 'https://cdn-icons-png.flaticon.com/512/3062/3062634.png', title: 'Integrity' },
//     { image: 'https://cdn-icons-png.flaticon.com/512/1995/1995574.png', title: 'Innovation' },
//     { image: 'https://cdn-icons-png.flaticon.com/512/2983/2983421.png', title: 'Customer First' },
//     { image: 'https://cdn-icons-png.flaticon.com/512/1792/1792934.png', title: 'Teamwork' },
//     { image: 'https://cdn-icons-png.flaticon.com/512/1647/1647560.png', title: 'Accountability' },
//     { image: 'https://cdn-icons-png.flaticon.com/512/2920/2920130.png', title: 'Leadership' },
//   ];

//   const [coreValues, setCoreValues] = useState(() => {
//     const saved = localStorage.getItem('coreValues');
//     return saved ? JSON.parse(saved) : defaultCoreValues;
//   });

//   useEffect(() => {
//     localStorage.setItem('coreValues', JSON.stringify(coreValues));
//   }, [coreValues]);

//   const [editingVisionIndexes, setEditingVisionIndexes] = useState([]);
//   const [editingMissionIndexes, setEditingMissionIndexes] = useState([]);

//   const [showAddVisionForm, setShowAddVisionForm] = useState(false);
//   const [showAddMissionForm, setShowAddMissionForm] = useState(false);

//   const [newVision, setNewVision] = useState({ imageUrl: '', title: '', description: '' });
//   const [newMission, setNewMission] = useState({ imageUrl: '', title: '', description: '' });

//   const [editingCoreIndexes, setEditingCoreIndexes] = useState([]);
//   const [showAddCoreForm, setShowAddCoreForm] = useState(false);
//   const [newCore, setNewCore] = useState({ image: '', title: '' });

//   const toggleEditVision = (index) => {
//     setEditingVisionIndexes((prev) =>
//       prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
//     );
//   };
//   const toggleEditMission = (index) => {
//     setEditingMissionIndexes((prev) =>
//       prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
//     );
//   };
//   const toggleEditCore = (index) => {
//     setEditingCoreIndexes((prev) =>
//       prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
//     );
//   };

//   const handleVisionChange = (index, field, value) => {
//     const updated = [...visions];
//     updated[index][field] = value;
//     setVisions(updated);
//   };

//   const handleMissionChange = (index, field, value) => {
//     const updated = [...missions];
//     updated[index][field] = value;
//     setMissions(updated);
//   };

//   const handleSaveVision = (index) => {
//     toggleEditVision(index);
//     showToast('success', `Vision updated`);
//   };

//   const handleSaveMission = (index) => {
//     toggleEditMission(index);
//     showToast('success', `Mission updated`);
//   };

//   const handleDeleteVision = (index) => {
//     const copy = [...visions];
//     copy.splice(index, 1);
//     setVisions(copy);
//     showToast('success', 'Vision deleted');
//   };
//   const handleDeleteMission = (index) => {
//     const copy = [...missions];
//     copy.splice(index, 1);
//     setMissions(copy);
//     showToast('success', 'Mission deleted');
//   };

//   const handleNewVisionChange = (field, value) => {
//     setNewVision((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleNewMissionChange = (field, value) => {
//     setNewMission((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleAddVision = () => {
//     if (!newVision.imageUrl || !newVision.title || !newVision.description) {
//       showToast('warning', 'Please fill all Vision fields');
//       return;
//     }
//     setVisions((prev) => [...prev, newVision]);
//     showToast('success', `Vision "${newVision.title}" added`);
//     setNewVision({ imageUrl: '', title: '', description: '' });
//     setShowAddVisionForm(false);
//   };

//   const handleAddMission = () => {
//     if (!newMission.imageUrl || !newMission.title || !newMission.description) {
//       showToast('warning', 'Please fill all Mission fields');
//       return;
//     }
//     setMissions((prev) => [...prev, newMission]);
//     showToast('success', `Mission "${newMission.title}" added`);
//     setNewMission({ imageUrl: '', title: '', description: '' });
//     setShowAddMissionForm(false);
//   };

//   const toggleEditCore = (index) => {
//     setEditingCoreIndexes((prev) =>
//       prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
//     );
//   };

//   const handleEditCoreInputChange = (index, field, value) => {
//     const updated = [...coreValues];
//     updated[index][field] = value;
//     setCoreValues(updated);
//   };
//   const handleSaveCore = (index) => {
//     toggleEditCore(index);
//     showToast('success', `Core value "${coreValues[index].title}" updated`);
//   };
//   const handleDeleteCore = (index) => {
//     const deletedTitle = coreValues[index].title;
//     setCoreValues(coreValues.filter((_, i) => i !== index));
//     showToast('success', `Core value "${deletedTitle}" deleted`);
//   };

//   const handleAddCoreInputChange = (field, value) => setNewCore({ ...newCore, [field]: value });
//   const handleSaveNewCore = () => {
//     if (newCore.image && newCore.title) {
//       setCoreValues([...coreValues, newCore]);
//       showToast('success', `Core value "${newCore.title}" added`);
//       setNewCore({ image: '', title: '' });
//       setShowAddCoreForm(false);
//     } else {
//       showToast('warning', 'Please enter both image and title');
//     }
//   };

//   const imageStyle = { width: '400px', height: '250px', objectFit: 'cover' };
//   const circleImageStyle = {
//     width: '100px',
//     height: '100px',
//     objectFit: 'cover',
//     borderRadius: '50%',
//     border: '4px solid #6a11cb',
//     padding: '5px',
//     backgroundColor: '#fff',
//   };
//   const descStyle = { fontSize: '17px', lineHeight: '1.6' };

//   const handleDownloadPDF = async () => {
//     const element = pdfRef.current;

//     const toDataURL = (url) => {
//       return new Promise((resolve) => {
//         const timeout = setTimeout(() => resolve(null), 10000);
//         fetch(url, { mode: 'cors' })
//           .then((response) => response.blob())
//           .then((blob) => {
//             const reader = new FileReader();
//             reader.onloadend = () => {
//               clearTimeout(timeout);
//               resolve(reader.result);
//             };
//             reader.readAsDataURL(blob);
//           })
//           .catch(() => {
//             clearTimeout(timeout);
//             resolve(null);
//           });
//       });
//     };

//     const images = element.querySelectorAll('img');
//     const promises = Array.from(images).map(async (img) => {
//       if (img.src.startsWith('data:')) return;
//       const dataUrl = await toDataURL(img.src);
//       if (dataUrl) img.src = dataUrl;
//     });

//     await Promise.all(promises);

//     const options = {
//       margin: 0.5,
//       filename: 'VisionMissionCore.pdf',
//       image: { type: 'jpeg', quality: 0.98 },
//       html2canvas: {
//         scale: 2,
//         useCORS: true,
//         allowTaint: true,
//         logging: false,
//         timeout: 20000,
//       },
//       jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
//     };

//     html2pdf().set(options).from(element).save().then(() => {
//       showToast('success', 'PDF downloaded successfully');
//     });
//   };

//   return (
//     <div className="container py-4">
//       <div className="text-end mb-3">
//         <button className="btn btn-danger" onClick={handleDownloadPDF}>
//           <FontAwesomeIcon icon={faFilePdf} className="me-2" />
//           Download PDF
//         </button>
//       </div>

//       <div ref={pdfRef}>
//         {/* 🆕 Top Section with Logo, Company Name, Personal Photo */}
//         <div className="card shadow-sm border-0 mb-4 p-3">
//           <div className="row align-items-center text-center">
//             <div className="col-md-3 text-center">
//               <img
//                 src={companyLogo}
//                 alt="Company Logo"
//                 style={{
//                   width: '100px',
//                   height: '100px',
//                   objectFit: 'cover',
//                   borderRadius: '8px',
//                   border: '3px solid #8e44ad',
//                 }}
//               />
//               <p className="mt-2 mb-0 fw-semibold text-muted">Company Logo</p>
//             </div>

//             <div className="col-md-6">
//               <input
//                 type="text"
//                 className="form-control text-center fw-bold fs-5"
//                 placeholder="Enter Company Name"
//                 value={companyName}
//                 onChange={(e) => {
//                   if (!companyNameLocked) setCompanyName(e.target.value);
//                 }}
//                 disabled={companyNameLocked}
//               />
//               {companyNameLocked && <small className="text-muted">Company Name</small>}
//             </div>

//             <div className="col-md-3 text-center">
//               <label htmlFor="personalPhotoInput" style={{ cursor: 'pointer' }}>
//                 <img
//                   src={personalPhoto}
//                   alt="Personal"
//                   style={{
//                     width: '100px',
//                     height: '100px',
//                     objectFit: 'cover',
//                     borderRadius: '8px',
//                     border: '3px solid #8e44ad',
//                   }}
//                 />
//                 <input
//                   type="file"
//                   id="personalPhotoInput"
//                   accept="image/*"
//                   onChange={(e) => handleImageChange(e, 'personalPhoto')}
//                   style={{ display: 'none' }}
//                 />
//               </label>
//               {isEditingName ? (
//                 <input
//                   type="text"
//                   className="form-control form-control-sm text-center mt-2"
//                   placeholder="Enter Your Name"
//                   value={personalName}
//                   onChange={(e) => setPersonalName(e.target.value)}
//                   onBlur={() => setIsEditingName(false)}
//                   autoFocus
//                 />
//               ) : (
//                 <h6
//                   className="fw-bold text-muted mt-2 mb-0"
//                   onClick={() => setIsEditingName(true)}
//                   style={{ cursor: 'pointer' }}
//                 >
//                   {personalName || 'Enter Your Name'}
//                 </h6>
//               )}
//             </div>
//           </div>
//         </div>


//         {/* Vision Section */}
//         <div className="card mb-4 shadow-sm border-0">
//           <div className="card-header bg-white d-flex justify-content-between align-items-center">
//             <h5 className="mb-0 text-primary fw-bold">Visions</h5>
//             <button
//               className="btn btn-sm btn-outline-primary"
//               onClick={() => setShowAddVisionForm(true)}
//               title="Add Vision"
//             >
//               <FontAwesomeIcon icon={faPlus} />
//             </button>
//           </div>

//           <div className="card-body">
//             {visions.map((vision, index) => (
//               <div
//                 key={index}
//                 className="mb-4 p-3 rounded shadow-sm bg-light d-flex align-items-start"
//               >
//                 <div style={{ width: '400px', marginRight: '30px' }}>
//                   <img
//                     src={vision.imageUrl}
//                     alt="Vision"
//                     style={{
//                       width: '100%',
//                       height: '250px',
//                       objectFit: 'cover',
//                       borderRadius: '8px',
//                       border: '1px solid #ddd',
//                     }}
//                   />
//                 </div>

//                 <div style={{ flex: 1 }}>
//                   <h5 className="fw-bold text-primary mb-3">{vision.title}</h5>
//                   <p style={{ fontSize: '1rem', lineHeight: '1.8', textAlign: 'justify' }}>
//                     {vision.description}
//                   </p>
//                 </div>
//               </div>
//             ))}

//             {/* Add Vision Form */}
//             {showAddVisionForm && (
//               <div className="p-3 rounded shadow-sm bg-light d-flex align-items-start mb-4">
//                 <div style={{ width: '400px', marginRight: '30px' }}>
//                   <input
//                     type="text"
//                     className="form-control mb-2"
//                     value={newVision.imageUrl}
//                     onChange={(e) => handleNewVisionChange('imageUrl', e.target.value)}
//                     placeholder="Image URL"
//                   />
//                   <div
//                     style={{
//                       width: '100%',
//                       height: '250px',
//                       background: '#f8f9fa',
//                       border: '1px dashed #ccc',
//                       borderRadius: '8px',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       color: '#999',
//                       fontSize: '0.9rem',
//                     }}
//                   >
//                     Image Preview Here
//                   </div>
//                 </div>

//                 <div style={{ flex: 1 }}>
//                   <h6 className="fw-bold mb-2 text-primary">Add New Vision</h6>
//                   <input
//                     type="text"
//                     className="form-control mb-2"
//                     value={newVision.title}
//                     onChange={(e) => handleNewVisionChange('title', e.target.value)}
//                     placeholder="Vision Title"
//                   />
//                   <textarea
//                     rows={4}
//                     className="form-control mb-2"
//                     value={newVision.description}
//                     onChange={(e) => handleNewVisionChange('description', e.target.value)}
//                     placeholder="Vision Description"
//                   />
//                   <div className="d-flex justify-content-end gap-2">
//                     <button
//                       className="btn btn-secondary"
//                       onClick={() => {
//                         setShowAddVisionForm(false);
//                         setNewVision({ imageUrl: '', title: '', description: '' });
//                       }}
//                     >
//                       Cancel
//                     </button>
//                     <button className="btn btn-primary" onClick={handleAddVision}>
//                       Add Vision
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Mission Section */}
//         <div className="card mb-4 shadow-sm border-0">
//           <div className="card-header bg-white d-flex justify-content-between align-items-center">
//             <h5 className="mb-0 text-primary fw-bold">Missions</h5>
//             <button
//               className="btn btn-sm btn-outline-primary"
//               onClick={() => setShowAddMissionForm(true)}
//               title="Add Mission"
//             >
//               <FontAwesomeIcon icon={faPlus} />
//             </button>
//           </div>

//           <div className="card-body">
//             {missions.map((mission, index) => (
//               <div
//                 key={index}
//                 className="mb-4 p-3 rounded shadow-sm bg-light d-flex align-items-start justify-content-between"
//               >
//                 <div className="d-flex">
//                   <div style={{ width: '400px', marginRight: '30px' }}>
//                     <img
//                       src={mission.imageUrl}
//                       alt="Mission"
//                       style={{
//                         width: '100%',
//                         height: '250px',
//                         objectFit: 'cover',
//                         borderRadius: '8px',
//                         border: '1px solid #ddd',
//                       }}
//                     />
//                   </div>

//                   <div style={{ flex: 1 }}>
//                     {!editingMissionIndexes.includes(index) ? (
//                       <>
//                         <h5 className="fw-bold text-primary mb-3">{mission.title}</h5>
//                         <p style={{ fontSize: '1rem', lineHeight: '1.8', textAlign: 'justify' }}>
//                           {mission.description}
//                         </p>
//                       </>
//                     ) : (
//                       <>
//                         <input
//                           type="text"
//                           className="form-control mb-2"
//                           value={mission.title}
//                           onChange={(e) => handleMissionChange(index, 'title', e.target.value)}
//                           placeholder="Mission Title"
//                         />
//                         <input
//                           type="text"
//                           className="form-control mb-2"
//                           value={mission.imageUrl}
//                           onChange={(e) => handleMissionChange(index, 'imageUrl', e.target.value)}
//                           placeholder="Image URL"
//                         />
//                         <textarea
//                           rows={4}
//                           className="form-control"
//                           value={mission.description}
//                           onChange={(e) => handleMissionChange(index, 'description', e.target.value)}
//                           placeholder="Mission Description"
//                         />
//                       </>
//                     )}
//                   </div>
//                 </div>

//                 <div className="d-flex flex-column align-items-center ms-3">
//                   {!editingMissionIndexes.includes(index) ? (
//                     <div className="d-flex gap-1">
//                       <button
//                         className="btn btn-sm btn-outline-primary"
//                         onClick={() => toggleEditMission(index)}
//                         title="Edit Mission"
//                       >
//                         <FontAwesomeIcon icon={faEdit} />
//                       </button>
//                       <button
//                         className="btn btn-sm btn-outline-danger"
//                         onClick={() => handleDeleteMission(index)}
//                         title="Delete Mission"
//                       >
//                         <FontAwesomeIcon icon={faTrash} />
//                       </button>
//                     </div>
//                   ) : (
//                     <button
//                       className="btn btn-sm btn-success"
//                       onClick={() => handleSaveMission(index)}
//                       title="Save Mission"
//                     >
//                       <FontAwesomeIcon icon={faSave} />
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}

//             {/* Add Mission Form */}
//             {showAddMissionForm && (
//               <div className="p-3 rounded shadow-sm bg-light d-flex align-items-start mb-4">
//                 <div style={{ width: '400px', marginRight: '30px' }}>
//                   <input
//                     type="text"
//                     className="form-control mb-2"
//                     value={newMission.imageUrl}
//                     onChange={(e) => handleNewMissionChange('imageUrl', e.target.value)}
//                     placeholder="Image URL"
//                   />
//                   <div
//                     style={{
//                       width: '100%',
//                       height: '250px',
//                       background: '#f8f9fa',
//                       border: '1px dashed #ccc',
//                       borderRadius: '8px',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       color: '#999',
//                       fontSize: '0.9rem',
//                     }}
//                   >
//                     Image Preview Here
//                   </div>
//                 </div>

//                 <div style={{ flex: 1 }}>
//                   <h6 className="fw-bold mb-2 text-primary">Add New Mission</h6>
//                   <input
//                     type="text"
//                     className="form-control mb-2"
//                     value={newMission.title}
//                     onChange={(e) => handleNewMissionChange('title', e.target.value)}
//                     placeholder="Mission Title"
//                   />
//                   <textarea
//                     rows={4}
//                     className="form-control mb-2"
//                     value={newMission.description}
//                     onChange={(e) => handleNewMissionChange('description', e.target.value)}
//                     placeholder="Mission Description"
//                   />
//                   <div className="d-flex justify-content-end gap-2">
//                     <button
//                       className="btn btn-secondary"
//                       onClick={() => {
//                         setShowAddMissionForm(false);
//                         setNewMission({ imageUrl: '', title: '', description: '' });
//                       }}
//                     >
//                       Cancel
//                     </button>
//                     <button className="btn btn-success" onClick={handleAddMission}>
//                       Add Mission
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Core Values Section */}
//             <div className="card shadow-sm border-0">
//               <div className="card-header bg-white d-flex justify-content-between align-items-center">
//                 <h5 className="mb-0 text-primary fw-bold mb-4">3 &gt; Core Values</h5>
//                 <button
//                   className="btn btn-sm btn-outline-primary"
//                   onClick={() => setShowAddCoreForm(true)}
//                   title="Add Core Value"
//                 >
//                   <FontAwesomeIcon icon={faPlus} className="me-1" /> Add
//                 </button>
//               </div>

//               <div className="card-body row g-3 bg-light rounded shadow-sm p-3">
//                 {coreValues.map((core, index) => (
//                   <div className="col-md-4 col-6 text-center" key={index}>
//                     {editingCoreIndexes.includes(index) ? (
//                       <>
//                         <input
//                           type="text"
//                           className="form-control mb-2"
//                           value={core.image}
//                           onChange={(e) => handleEditCoreInputChange(index, 'image', e.target.value)}
//                           placeholder="Image URL"
//                         />
//                         <input
//                           type="text"
//                           className="form-control mb-2"
//                           value={core.title}
//                           onChange={(e) => handleEditCoreInputChange(index, 'title', e.target.value)}
//                           placeholder="Title"
//                         />
//                         <div>
//                           <button
//                             className="btn btn-success btn-sm me-2"
//                             onClick={() => handleSaveCore(index)}
//                           >
//                             <FontAwesomeIcon icon={faSave} />
//                           </button>
//                           <button
//                             className="btn btn-secondary btn-sm"
//                             onClick={() => toggleEditCore(index)}
//                           >
//                             Cancel
//                           </button>
//                         </div>
//                       </>
//                     ) : (
//                       <>
//                         <img
//                           src={core.image}
//                           alt={core.title}
//                           className="mb-2"
//                           style={circleImageStyle}
//                         />
//                         <h6 className="fw-semibold">{core.title}</h6>
//                         <div>
//                           <button
//                             className="btn btn-outline-primary btn-sm me-2"
//                             onClick={() => toggleEditCore(index)}
//                           >
//                             <FontAwesomeIcon icon={faEdit} />
//                           </button>
//                           <button
//                             className="btn btn-outline-danger btn-sm"
//                             onClick={() => handleDeleteCore(index)}
//                           >
//                             <FontAwesomeIcon icon={faTrash} />
//                           </button>
//                         </div>
//                       </>
//                     )}
//                   </div>
//                 ))}

//                 {showAddCoreForm && (
//                   <div className="col-md-4 col-6">
//                     <input
//                       type="text"
//                       className="form-control mb-2"
//                       placeholder="Image URL"
//                       value={newCore.image}
//                       onChange={(e) => handleAddCoreInputChange('image', e.target.value)}
//                     />
//                     <input
//                       type="text"
//                       className="form-control mb-2"
//                       placeholder="Title"
//                       value={newCore.title}
//                       onChange={(e) => handleAddCoreInputChange('title', e.target.value)}
//                     />
//                     <button className="btn btn-success btn-sm me-2" onClick={handleSaveNewCore}>
//                       <FontAwesomeIcon icon={faSave} /> Save
//                     </button>
//                     <button className="btn btn-secondary btn-sm" onClick={() => setShowAddCoreForm(false)}>
//                       Cancel
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VisionMissionCore;

// import React, { useState, useEffect } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFilePdf, faPlus, faEdit, faTrash, faSave } from '@fortawesome/free-solid-svg-icons';
// import html2pdf from 'html2pdf.js';
// import { getAllVMC, addVision, addMission, addCore } from '../api/visionMissionCoreApi';
// const VisionMissionCore = () => {
//   const pdfRef = React.useRef(null);
//   const [companyName, setCompanyName] = useState(() => {
//     return localStorage.getItem('companyName') || '';
//   });
//   const [companyLogo, setCompanyLogo] = useState(() => {
//     return localStorage.getItem('companyLogo') || 'https://via.placeholder.com/100?text=Logo';
//   });
//   const [companyNameLocked, setCompanyNameLocked] = useState(() => {
//     return localStorage.getItem('companyName') ? true : false;
//   });
//   const [personalPhoto, setPersonalPhoto] = useState(() => {
//     return localStorage.getItem('personalPhoto') || 'https://via.placeholder.com/100?text=Personal+Photo';
//   });
//   const [personalName, setPersonalName] = useState(() => {
//     return localStorage.getItem('personalName') || '';
//   });
//   const [isEditingName, setIsEditingName] = useState(false);
//   const [visions, setVisions] = useState([]);
//   const [missions, setMissions] = useState([]);
//   const [coreValues, setCoreValues] = useState([]);
//   const [showAddVisionForm, setShowAddVisionForm] = useState(false);
//   const [showAddMissionForm, setShowAddMissionForm] = useState(false);
//   const [showAddCoreForm, setShowAddCoreForm] = useState(false);
//   const [newVision, setNewVision] = useState({ imageUrl: '', title: '', description: '' });
//   const [newMission, setNewMission] = useState({ imageUrl: '', title: '', description: '' });
//   const [newCore, setNewCore] = useState({ image: '', title: '' });
//   const [editingVisionIndexes, setEditingVisionIndexes] = useState([]);
//   const [editingMissionIndexes, setEditingMissionIndexes] = useState([]);
//   const [editingCoreIndexes, setEditingCoreIndexes] = useState([]);
//   const [tempLink, setTempLink] = useState('');
//   const [editingSocial, setEditingSocial] = useState(null);
//   const [currentIcon, setCurrentIcon] = useState(null);
//   const socialLinks = {
//     facebook: '',
//     twitter: '',
//     linkedin: '',
//     instagram: '',
//     youtube: '',
//   };
//   const [socials, setSocials] = useState(socialLinks);
//   const [showSocialForm, setShowSocialForm] = useState(false);
//   const [showToast, setShowToast] = useState({ show: false, type: '', message: '' });
//   const triggerToast = (type, message) => {
//     setShowToast({ show: true, type, message });
//     setTimeout(() => setShowToast({ show: false }), 3000);
//   };

//   const handleImageChange = (e, type) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         if (type === 'companyLogo') {
//           setCompanyLogo(reader.result);
//           localStorage.setItem('companyLogo', reader.result);
//         } else if (type === 'personalPhoto') {
//           setPersonalPhoto(reader.result);
//           localStorage.setItem('personalPhoto', reader.result);
//         }
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleDownloadPDF = async () => {
//     const element = pdfRef.current;

//     const options = {
//       margin: 0.5,
//       filename: 'VisionMissionCore.pdf',
//       image: { type: 'jpeg', quality: 0.98 },
//       html2canvas: {
//         scale: 2,
//         useCORS: true,
//         allowTaint: true,
//         logging: false,
//         timeout: 20000,
//       },
//       jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
//     };

//     html2pdf().set(options).from(element).save().then(() => {
//       triggerToast('success', 'PDF downloaded successfully');
//     });
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const { data } = await getAllVMC();
//         setVisions(data.visions || []);
//         setMissions(data.missions || []);
//         setCoreValues(data.coreValues || []);
//       } catch (error) {
//         console.error('Error fetching VMC data:', error);
//       }
//     };
//     fetchData();
//   }
//     , []);
//   useEffect(() => {
//     localStorage.setItem('companyName', companyName);
//   }, [companyName]);
//   useEffect(() => {
//     localStorage.setItem('companyLogo', companyLogo);
//   }, [companyLogo]);
//   useEffect(() => {
//     localStorage.setItem('personalPhoto', personalPhoto);
//   }, [personalPhoto]);
//   useEffect(() => {
//     localStorage.setItem('personalName', personalName);
//   }, [personalName]);
//   useEffect(() => {
//     localStorage.setItem('socials', JSON.stringify(socials));
//   }, [socials]);

//   const handleSocialChange = (e) => {
//     const { name, value } = e.target;
//     setSocials((prev) => ({ ...prev, [name]: value }));
//   }

//   const handleSocialSubmit = (e) => {
//     e.preventDefault();
//     if (tempLink.trim() === '') {
//       triggerToast('warning', 'Please enter a valid link');
//       return;
//     }
//     if (editingSocial) {
//       setSocials((prev) => ({ ...prev, [editingSocial]: tempLink }));
//       setEditingSocial(null);
//     } else {
//       setSocials((prev) => ({ ...prev, [currentIcon]: tempLink }));
//     }
//     setTempLink('');
//     setShowSocialForm(false);
//     triggerToast('success', 'Social link updated successfully');
//   }

//   const handleSocialEdit = (platform) => {
//     setEditingSocial(platform);
//     setTempLink(socials[platform] || '');
//     setCurrentIcon(platform);
//     setShowSocialForm(true);
//   };

//   const handleVisionEdit = (index) => {
//     setEditingVisionIndexes((prev) =>
//       prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
//     );
//   };

//   const handleMissionEdit = (index) => {
//     setEditingMissionIndexes((prev) =>
//       prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
//     );
//   };


//   const handleCoreEdit = (index) => {
//     setEditingCoreIndexes((prev) =>
//       prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
//     );
//   };

//   const handleVisionChange = (index, field, value) => {
//     setVisions((prev) =>
//       prev.map((vision, i) =>
//         i === index ? { ...vision, [field]: value } : vision
//       )
//     );
//   };

//   const handleMissionChange = (index, field, value) => {
//     setMissions((prev) =>
//       prev.map((mission, i) =>
//         i === index ? { ...mission, [field]: value } : mission
//       )
//     );
//   };

//   const handleCoreChange = (index, field, value) => {
//     setCoreValues((prev) =>
//       prev.map((core, i) =>
//         i === index ? { ...core, [field]: value } : core
//       )
//     );
//   };

//   const handleSaveVision = async (index) => {
//     try {
//       await addVision(visions[index]);
//       triggerToast('success', 'Vision updated successfully');
//       handleVisionEdit(index);
//     } catch (error) {
//       console.error('Error updating vision:', error);
//       triggerToast('error', 'Failed to update vision');
//     }
//   };

//   const handleSaveMission = async (index) => {
//     try {
//       await addMission(missions[index]);
//       triggerToast('success', 'Mission updated successfully');
//       handleMissionEdit(index);
//     } catch (error) {
//       console.error('Error updating mission:', error);
//       triggerToast('error', 'Failed to update mission');
//     }
//   };

//   const handleSaveCore = async (index) => {
//     try {
//       await addCore(coreValues[index]);
//       triggerToast('success', 'Core value updated successfully');
//       handleCoreEdit(index);
//     } catch (error) {
//       console.error('Error updating core value:', error);
//       triggerToast('error', 'Failed to update core value');
//     }
//   };

//   const handleAddVision = async () => {
//     if (!newVision.imageUrl || !newVision.title || !newVision.description) {
//       triggerToast('warning', 'Please fill all fields');
//       return;
//     }
//     try {
//       await addVision(newVision);
//       setVisions((prev) => [...prev, newVision]);
//       triggerToast('success', 'Vision added successfully');
//       setNewVision({ imageUrl: '', title: '', description: '' });
//       setShowAddVisionForm(false);
//     } catch (error) {
//       console.error('Error adding vision:', error);
//       triggerToast('error', 'Failed to add vision');
//     }
//   };

//   const handleAddMission = async () => {
//     if (!newMission.imageUrl || !newMission.title || !newMission.description) {
//       triggerToast('warning', 'Please fill all fields');
//       return;
//     }
//     try {
//       await addMission(newMission);
//       setMissions((prev) => [...prev, newMission]);
//       triggerToast('success', 'Mission added successfully');
//       setNewMission({ imageUrl: '', title: '', description: '' });
//       setShowAddMissionForm(false);
//     } catch (error) {
//       console.error('Error adding mission:', error);
//       triggerToast('error', 'Failed to add mission');
//     }
//   };

//   const handleAddCore = async () => {
//     if (!newCore.image || !newCore.title) {
//       triggerToast('warning', 'Please fill all fields');
//       return;
//     }
//     try {
//       await addCore(newCore);
//       setCoreValues((prev) => [...prev, newCore]);
//       triggerToast('success', 'Core value added successfully');
//       setNewCore({ image: '', title: '' });
//       setShowAddCoreForm(false);
//     } catch (error) {
//       console.error('Error adding core value:', error);
//       triggerToast('error', 'Failed to add core value');
//     }
//   }

//   const handleDeleteVision = (index) => {
//     setVisions((prev) => prev.filter((_, i) => i !== index));
//     triggerToast('success', 'Vision deleted successfully');
//   };

//   const handleDeleteMission = (index) => {
//     setMissions((prev) => prev.filter((_, i) => i !== index));
//     triggerToast('success', 'Mission deleted successfully');
//   };

//   const handleDeleteCore = (index) => {
//     setCoreValues((prev) => prev.filter((_, i) => i !== index));
//     triggerToast('success', 'Core value deleted successfully');
//   };


//   const circleImageStyle = {
//     width: '100px',
//     height: '100px',
//     objectFit: 'cover',
//     borderRadius: '50%',
//     border: '2px solid #8e44ad',
//   };

//   return (
//     <div className="container py-4">
//       <div className="text-end mb-3">
//         <button className="btn btn-danger" onClick={handleDownloadPDF}>
//           <FontAwesomeIcon icon={faFilePdf} className="me-2" />
//           Download PDF
//         </button>
//       </div>

//       <div ref={pdfRef}>
//         {/* 🆕

//           Top Section with Logo, Company Name, Personal Photo */}
//         <div className="card shadow-sm border-0 mb-4 p-3">
//           <div className="row align-items-center text-center">
//             <div className="col-md-3 text-center">
//               <img
//                 src={companyLogo}
//                 alt="Company Logo"
//                 style={{
//                   width: '100px',
//                   height: '100px',
//                   objectFit: 'cover',
//                   borderRadius: '8px',
//                   border: '3px solid #8e44ad',
//                 }}
//               />
//               <p className="mt-2 mb-0 fw-semibold text-muted">Company Logo</p>
//             </div>

//             <div className="col-md-6">
//               <input
//                 type="text"
//                 className="form-control text-center fw-bold fs-5"
//                 placeholder="Enter Company Name"
//                 value={companyName}
//                 onChange={(e) => setCompanyName(e.target.value)}
//                 disabled={companyNameLocked}
//               />
//               {companyNameLocked && <small className="text-muted">Company Name</small>}
//             </div>

//             <div className="col-md-3 text-center">
//               <label htmlFor="personalPhotoInput" style={{ cursor: 'pointer' }}>
//                 <img
//                   src={personalPhoto}
//                   alt="Personal"
//                   style={{
//                     width: '100px',
//                     height: '100px',
//                     objectFit: 'cover',
//                     borderRadius: '8px',
//                     border: '3px solid #8e44ad',
//                   }}
//                 />
//                 <input
//                   type="file"
//                   id="personalPhotoInput"
//                   accept="image/*"
//                   onChange={(e) => handleImageChange(e, 'personalPhoto')}
//                   style={{ display: 'none' }}
//                 />
//               </label>
//               {isEditingName ? (
//                 <input
//                   type="text"
//                   className="form-control form-control-sm text-center mt-2"
//                   placeholder="Enter Your Name"
//                   value={personalName}
//                   onChange={(e) => setPersonalName(e.target.value)}
//                   onBlur={() => setIsEditingName(false)}
//                   autoFocus
//                 />
//               ) : (
//                 <h6
//                   className="fw-bold text-muted mt-2 mb-0"
//                   onClick={() => setIsEditingName(true)}
//                   style={{ cursor: 'pointer' }}
//                 >
//                   {personalName || 'Enter Your Name'}
//                 </h6>
//               )}
//             </div>

//           </div>
//         </div>
//         {/* 🆕
//           Vision Section */}
//         <div className="card mb-4 shadow-sm border-0">
//           <div className="card-header bg-white d-flex justify-content-between align-items-center">
//             <h5 className="mb-0 text-primary fw-bold">Visions</h5>
//             <button
//               className="btn btn-sm btn-outline-primary"
//               onClick={() => setShowAddVisionForm(true)}
//               title="Add Vision"
//             >
//               <FontAwesomeIcon icon={faPlus} />
//             </button>
//           </div>

//           <div className="card-body">
//             {visions.map((vision, index) => (
//               <div
//                 key={index}
//                 className="mb-4 p-3 rounded shadow-sm bg-light d-flex align-items-start"
//               >
//                 <div style={{ width: '400px', marginRight: '30px' }}>
//                   <img
//                     src={vision.imageUrl}
//                     alt="Vision"
//                     style={{
//                       width: '100%',
//                       height: '250px',
//                       objectFit: 'cover',
//                       borderRadius: '8px',
//                       border: '1px solid #ddd',
//                     }}
//                   />
//                 </div>

//                 <div style={{ flex: 1 }}>
//                   <h5 className="fw-bold text-primary mb-3">{vision.title}</h5>
//                   <p style={{ fontSize: '1rem', lineHeight: '1.8', textAlign: 'justify' }}>
//                     {vision.description}
//                   </p>
//                 </div>
//               </div>
//             ))}

//             {/* Add Vision Form */}
//             {showAddVisionForm && (
//               <div className="p-3 rounded shadow-sm bg-light d-flex align-items-start mb-4">
//                 <div style={{ width: '400px', marginRight: '30px' }}>
//                   <input
//                     type="text"
//                     className="form-control mb-2"
//                     value={newVision.imageUrl}
//                     onChange={(e) => setNewVision({ ...newVision, imageUrl: e.target.value })}
//                     placeholder="Image URL"
//                   />
//                   <div
//                     style={{
//                       width: '100%',
//                       height: '250px',
//                       background: '#f8f9fa',
//                       border: '1px dashed #ccc',
//                       borderRadius: '8px',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       color: '#999',
//                       fontSize: '0.9rem',
//                     }}
//                   >
//                     Image Preview Here
//                   </div>
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   <h6 className="fw-bold mb-2 text-primary">Add New Vision</h6>
//                   <input
//                     type="text"
//                     className="form-control mb-2"
//                     value={newVision.title}
//                     onChange={(e) => setNewVision({ ...newVision, title: e.target.value })}
//                     placeholder="Vision Title"
//                   />
//                   <textarea
//                     rows={4}
//                     className="form-control mb-2"
//                     value={newVision.description}
//                     onChange={(e) => setNewVision({ ...newVision, description: e.target.value })}
//                     placeholder="Vision Description"
//                   />
//                   <div className="d-flex justify-content-end gap-2">
//                     <button
//                       className="btn btn-secondary"
//                       onClick={() => {
//                         setShowAddVisionForm(false);
//                         setNewVision({ imageUrl: '', title: '', description: '' });
//                       }}
//                     >
//                       Cancel
//                     </button>
//                     <button className="btn btn-primary" onClick={handleAddVision}>
//                       Add Vision
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//             {/* Social Links */}
//             <div className="mb-3 d-flex justify-content-center gap-4">
//               {Object.keys(socialLinks).map((platform) => (
//                 <span
//                   key={platform}
//                   style={{ cursor: 'pointer' }}
//                   title={socials[platform] ? `${platform} Link Added` : `Add ${platform} Link`}
//                   onClick={() => handleSocialEdit(platform)}
//                 >
//                   <FontAwesomeIcon icon={['fab', platform]} size="2x" />
//                 </span>
//               ))}
//             </div>
//             {/* Social Link Modal */}
//             {showSocialForm && (
//               <div
//                 className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
//                 style={{ background: 'rgba(0,0,0,0.6)', zIndex: 1050 }}
//                 onClick={() => setShowSocialForm(false)}
//               >
//                 <div
//                   className="bg-white p-4 rounded shadow"
//                   style={{ maxWidth: 500, width: '90%' }}
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   <h5 className="mb-3">Add Social Link</h5>
//                   <form onSubmit={handleSocialSubmit}>
//                     <input
//                       type="url"
//                       className="form-control mb-3"
//                       placeholder={`Enter full ${editingSocial} URL`}
//                       value={tempLink}
//                       onChange={(e) => setTempLink(e.target.value)}
//                       autoFocus
//                     />
//                     <div className="d-flex justify-content-end gap-2">
//                       <button type="button" className="btn btn-secondary" onClick={() => setShowSocialForm(false)}>Cancel</button>
//                       <button type="submit" className="btn btn-primary">Save</button>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//         {/* 🆕
//           Mission Section */}
//         <div className="card mb-4 shadow-sm border-0">
//           <div className="card-header bg-white d-flex justify-content-between align-items-center">
//             <h5 className="mb-0 text-primary fw-bold">Missions</h5>
//             <button
//               className="btn btn-sm btn-outline-primary"
//               onClick={() => setShowAddMissionForm(true)}
//               title="Add Mission"
//             >
//               <FontAwesomeIcon icon={faPlus} />
//             </button>
//           </div>

//           <div className="card-body">
//             {missions.map((mission, index) => (
//               <div
//                 key={index}
//                 className="mb-4 p-3 rounded shadow-sm bg-light d-flex align-items-start"
//               >
//                 <div style={{ width: '400px', marginRight: '30px' }}>
//                   <img
//                     src={mission.imageUrl}
//                     alt="Mission"
//                     style={{
//                       width: '100%',
//                       height: '250px',
//                       objectFit: 'cover',
//                       borderRadius: '8px',
//                       border: '1px solid #ddd',
//                     }}
//                   />
//                 </div>

//                 <div style={{ flex: 1 }}>
//                   <h5 className="fw-bold text-primary mb-3">{mission.title}</h5>
//                   <p style={{ fontSize: '1rem', lineHeight: '1.8', textAlign: 'justify' }}>
//                     {mission.description}
//                   </p>
//                 </div>
//                 <div className="d-flex flex-column align-items-center ms-3">
//                   {!editingMissionIndexes.includes(index) ? (
//                     <div className="d-flex gap-1">
//                       <button
//                         className="btn btn-sm btn-outline-primary"
//                         onClick={() => handleMissionEdit(index)}
//                         title="Edit Mission"
//                       >
//                         <FontAwesomeIcon icon={faEdit} />
//                       </button>
//                       <button
//                         className="btn btn-sm btn-outline-danger"
//                         onClick={() => handleDeleteMission(index)}
//                         title="Delete Mission"
//                       >
//                         <FontAwesomeIcon icon={faTrash} />
//                       </button>
//                     </div>
//                   ) : (
//                     <button
//                       className="btn btn-sm btn-success"
//                       onClick={() => handleSaveMission(index)}
//                       title="Save Mission"
//                     >
//                       <FontAwesomeIcon icon={faSave} />
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//             {/* Add Mission Form */}
//             {showAddMissionForm && (
//               <div className="p-3 rounded shadow-sm bg-light d-flex align-items-start mb-4">
//                 <div style={{ width: '400px', marginRight: '30px' }}>
//                   <input
//                     type="text"
//                     className="form-control mb-2"
//                     value={newMission.imageUrl}
//                     onChange={(e) => setNewMission({ ...newMission, imageUrl: e.target.value })}
//                     placeholder="Image URL"
//                   />
//                   <div
//                     style={{
//                       width: '100%',
//                       height: '250px',
//                       background: '#f8f9fa',
//                       border: '1px dashed #ccc',
//                       borderRadius: '8px',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       color: '#999',
//                       fontSize: '0.9rem',
//                     }}
//                   >
//                     Image Preview Here
//                   </div>
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   <h6 className="fw-bold mb-2 text-primary">Add New Mission</h6>
//                   <input
//                     type="text"
//                     className="form-control mb-2"
//                     value={newMission.title}
//                     onChange={(e) => setNewMission({ ...newMission, title: e.target.value })}
//                     placeholder="Mission Title"
//                   />
//                   <textarea
//                     rows={4}
//                     className="form-control mb-2"
//                     value={newMission.description}
//                     onChange={(e) => setNewMission({ ...newMission, description: e.target.value })}
//                     placeholder="Mission Description"
//                   />
//                   <div className="d-flex justify-content-end gap-2">
//                     <button
//                       className="btn btn-secondary"
//                       onClick={() => {
//                         setShowAddMissionForm(false);
//                         setNewMission({ imageUrl: '', title: '', description: '' });
//                       }
//                       }
//                     >
//                       Cancel
//                     </button>
//                     <button className="btn btn-primary" onClick={handleAddMission}>
//                       Add Mission
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//         {/* 🆕
//           Core Values Section */}
//         <div className="card shadow-sm border-0 mb-4">
//           <div className="card-header bg-white d-flex justify-content-between align-items-center">
//             <h5 className="mb-0 text-primary fw-bold">Core Values</h5>
//             <button
//               className="btn btn-sm btn-outline-primary"
//               onClick={() => setShowAddCoreForm(true)}
//               title="Add Core Value"
//             >
//               <FontAwesomeIcon icon={faPlus} />
//             </button>
//           </div>

//           <div className="card-body row g-3 bg-light rounded shadow-sm p-3">
//             {coreValues.map((core, index) => (
//               <div className="col-md-4 col-6 text-center" key={index}>
//                 {editingCoreIndexes.includes(index) ? (
//                   <>
//                     <input
//                       type="text"
//                       className="form-control mb-2"
//                       value={core.image}
//                       onChange={(e) => handleCoreChange(index, 'image', e.target.value)}
//                       placeholder="Image URL"
//                     />
//                     <input
//                       type="text"
//                       className="form-control mb-2"
//                       value={core.title}
//                       onChange={(e) => handleCoreChange(index, 'title', e.target.value)}
//                       placeholder="Title"
//                     />
//                     <div>
//                       <button
//                         className="btn btn-success btn-sm me-2"
//                         onClick={() => handleSaveCore(index)}
//                       >
//                         <FontAwesomeIcon icon={faSave} />
//                       </button>
//                       <button
//                         className="btn btn-secondary btn-sm"
//                         onClick={() => handleCoreEdit(index)}
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </>
//                 ) : (
//                   <>
//                     <img
//                       src={core.image}
//                       alt={core.title}
//                       className="mb-2"
//                       style={circleImageStyle}
//                     />
//                     <h6 className="fw-semibold">{core.title}</h6>
//                     <div>
//                       <button
//                         className="btn btn-outline-primary btn-sm me-2"
//                         onClick={() => handleCoreEdit(index)}
//                       >
//                         <FontAwesomeIcon icon={faEdit} />
//                       </button>
//                       <button
//                         className="btn btn-outline-danger btn-sm"
//                         onClick={() => handleDeleteCore(index)}
//                       >
//                         <FontAwesomeIcon icon={faTrash} />
//                       </button>
//                     </div>
//                   </>
//                 )}
//               </div>
//             ))}
//             {showAddCoreForm && (
//               <div className="col-md-4 col-6">
//                 <input
//                   type="text"
//                   className="form-control mb-2"
//                   placeholder="Image URL"
//                   value={newCore.image}
//                   onChange={(e) => setNewCore({ ...newCore, image: e.target.value })}
//                 />
//                 <input
//                   type="text"
//                   className="form-control mb-2"
//                   placeholder="Title"
//                   value={newCore.title}
//                   onChange={(e) => setNewCore({ ...newCore, title: e.target.value })}
//                 />
//                 <button className="btn btn-success btn-sm me-2" onClick={handleAddCore}>
//                   <FontAwesomeIcon icon={faSave} /> Save
//                 </button>
//                 <button className="btn btn-secondary btn-sm" onClick={() => setShowAddCoreForm(false)}>
//                   Cancel
//                 </button>
//               </div>
//             )}
//             {coreValues.length === 0 && (
//               <div className="col-12 text-center text-muted">
//                 No core values added yet.
//               </div>
//             )}
//           </div>
//         </div>
//         {/* 🆕
//           Toast Notification */}
//         {showToast.show && (
//           <div className={`toast align-items-center text-bg-${showToast.type} border-0 position-fixed bottom-0 end-0 m-3`} role="alert" aria-live="assertive" aria-atomic="true">
//             <div className="d-flex">
//               <div className="toast-body">
//                 {showToast.message}
//               </div>
//               <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
//             </div>
//           </div>
//         )}
//       </div>

//     </div>
//   );
// }
// export default VisionMissionCore;



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faEdit, faSave } from '@fortawesome/free-solid-svg-icons';

const VisionSection = () => {
  const [visions, setVisions] = useState([]);
  const [submittedVisions, setSubmittedVisions] = useState([]);
  const [tempForms, setTempForms] = useState([]);
  const [missions, setMissions] = useState([]);
  const [submittedMissions, setSubmittedMissions] = useState([]);
  const [tempMissionForms, setTempMissionForms] = useState([]);
  const [submittedCoreValues, setSubmittedCoreValues] = useState([]);
  const [tempCoreForms, setTempCoreForms] = useState([]);
  const [editingMissionId, setEditingMissionId] = useState(null);
  const [editingMissionIndex, setEditingMissionIndex] = useState(null);
  const [editedDescription, setEditedDescription] = useState('');
  const [editedImage, setEditedImage] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState('');


  const [editingCoreId, setEditingCoreId] = useState(null);
  const [editingCoreIndex, setEditingCoreIndex] = useState(null);
  const [editedCoreImage, setEditedCoreImage] = useState(null);
  const [editedCoreTitle, setEditedCoreTitle] = useState('');
  const [showTempSection, setShowTempSection] = useState(false);



    

  const defaultMissionImage = 'https://gnitipu.in/front_assets/images/mission%20image.png';
  const defaultMissionDescription = `Our mission is to deliver innovative and high-quality solutions that enhance the lives of our customers.
We are committed to excellence, ethical practices, and continuous improvement in everything we do.
By fostering a culture of collaboration and inclusivity, we strive to build a sustainable future.
Our focus remains on creating impact-driven outcomes that benefit society and the environment.`;

  const defaultImage = 'https://cdn-icons-png.flaticon.com/256/562/562539.png';
  const defaultDescription = `Our vision is to innovate and lead with integrity, shaping a better future through technology and collaboration.
We strive to empower communities, drive sustainable growth, and deliver exceptional value to our stakeholders.
With a strong focus on quality, transparency, and customer-centric solutions, we aim to become a global benchmark in our industry.
Together, we envision a world where progress is inclusive and opportunity is accessible to all.`;

  const defaultCoreValues = [
    {
      title: 'Integrity',
      image: 'https://cdn-icons-png.flaticon.com/512/3062/3062634.png',
    },
    {
      title: 'Innovation',
      image: 'https://cdn-icons-png.flaticon.com/512/1995/1995574.png',
    },
    {
      title: 'Customer First',
      image: 'https://cdn-icons-png.flaticon.com/512/2983/2983421.png',
    },
    {
      title: "Teamwork",
      image: "https://cdn-icons-png.flaticon.com/512/1532/1532702.png"
    },
    {
      title: "Excellence",
      image: "https://cdn-icons-png.flaticon.com/512/609/609803.png"
    },
    {
      title: "Accountability",
      image: "https://cdn-icons-png.flaticon.com/512/3909/3909444.png"
    },
    {
      title: "Respect",
      image: "https://cdn-icons-png.flaticon.com/512/3103/3103446.png"
    },
    {
      title: "Responsibility",
      image: "https://cdn-icons-png.flaticon.com/512/4359/4359879.png"
    },
  ];

const handleAddMoreOne = () => {
  setTempForms([{ preview: "", description: "" }]);
  setTempMissionForms([{ preview: "", description: "" }]);
  setTempCoreForms([{ preview: "", title: "" }]);
  setShowTempSection(true);
};


const handleRemoveAllSections = () => {
  setTempForms([]);
  setTempMissionForms([]);
  setTempCoreForms([]);
  setShowTempSection(false);
};


  // vision
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');

      const res = await axios.get('http://localhost:5000/api/vmc', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const records = res.data.data || [];

      setVisions(records);

      const mapped = records
        .filter((r) => r.vision && typeof r.vision === 'string' && r.vision.length > 0)
        .map((r) => {
          let parsed = [];
          try {
            parsed = JSON.parse(r.vision);
          } catch (e) {
            console.error('Invalid vision JSON:', e);
          }

          return {
            id: r.id,
            vision: parsed.map((v) => ({
              description: v.visionDescription,
              preview: `http://localhost:5000/${v.visionImageUrl.replace(/\\/g, '/')}`,
            })),
          };
        });
      console.log(mapped);

      setSubmittedVisions(mapped);
    } catch (err) {
      console.error('Error fetching visions:', err);
    }
  };

  // mission
  const fetchMissions = async () => {
    try {
      const token = localStorage.getItem('token');

      const res = await axios.get('http://localhost:5000/api/vmc', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      const records = res.data.data || [];

      setMissions(records);

      const mapped = records
        .filter((r) => r.mission && typeof r.mission === 'string' && r.mission.length > 0)
        .map((r) => {
          let parsed = [];
          try {
            parsed = JSON.parse(r.mission);
          } catch (e) {
            console.error('Invalid mission JSON:', e);
          }

          return {
            id: r.id,
            mission: parsed.map((v) => ({
              description: v.missionDescription || '',
              preview: v.missionImageUrl
                ? `http://localhost:5000/${v.missionImageUrl.replace(/\\/g, '/')}`
                : 'https://via.placeholder.com/400x250?text=No+Image',
            })),
          };
        });

      console.log(mapped);

      setSubmittedMissions(mapped);
    } catch (err) {
      console.error('Error fetching missions:', err);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchData();
    fetchMissions();
    fetchCoreValues()
  }, []);

  const handleAddVisionBlock = () => {
    setTempForms([
      ...tempForms,
      {
        description: '',
        preview: null,
        file: null,
      },
    ]);
  };

  const handleTempImageChange = (index, file) => {
    if (!file) return;
    const updated = [...tempForms];
    updated[index].file = file;
    updated[index].preview = URL.createObjectURL(file);
    setTempForms(updated);
  };

  const handleTempDescriptionChange = (index, value) => {
    const updated = [...tempForms];
    updated[index].description = value;
    setTempForms(updated);
  };

  const handleDeleteTempForm = (index) => {
    const updated = [...tempForms];
    updated.splice(index, 1);
    setTempForms(updated);
  };

  const handleDeleteVision = async (id) => {
    try {
      const token = localStorage.getItem('token');

      await axios.delete(`http://localhost:5000/api/vmc/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSubmittedVisions(prev =>
        prev.filter(v => v.id !== id)
      );
      alert('Vision deleted successfully!');
    } catch (error) {
      console.error('Error deleting vision:', error);
      alert('Failed to delete vision.');
    }
  };

  const handleSubmitAll = async () => {
    try {
      const formData = new FormData();

      tempForms.forEach((v, index) => {
        formData.append('visionImage', v.file);
        formData.append(`visionDescription_${index}`, v.description);
      });
      const token = localStorage.getItem('token');

      await axios.post('http://localhost:5000/api/vmc/vision', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Visions submitted successfully!');
      setTempForms([]);
      fetchData();
    } catch (err) {
      console.error('Submit error:', err);
      alert('Error submitting visions');
    }
  };

  // Handlers for temp missions
  const handleAddMissionBlock = () => {
    setTempMissionForms([
      ...tempMissionForms,
      {
        description: '',
        preview: null,
        file: null,
      },
    ]);
  };

  const handleTempMissionImageChange = (index, file) => {
    if (!file) return;
    const updated = [...tempMissionForms];
    updated[index].file = file;
    updated[index].preview = URL.createObjectURL(file);
    setTempMissionForms(updated);
  };

  const handleTempMissionDescriptionChange = (index, value) => {
    const updated = [...tempMissionForms];
    updated[index].description = value;
    setTempMissionForms(updated);
  };

  const handleDeleteTempMissionForm = (index) => {
    const updated = [...tempMissionForms];
    updated.splice(index, 1);
    setTempMissionForms(updated);
  };

  const handleDeleteMission = async (id) => {
    try {
      const token = localStorage.getItem('token');

      await axios.delete(`http://localhost:5000/api/vmc/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSubmittedMissions((prev) => prev.filter((m) => m.id !== id));
      alert('Mission deleted successfully! ✅');
    } catch (error) {
      console.error('Error deleting mission:', error);
      alert('Failed to delete mission. ❌');
    }
  };

  const handleEditMission = (id, index) => {
    setEditingMissionId(id);
    setEditingMissionIndex(index);

    const missionItem = submittedMissions.find(m => m.id === id)?.mission[index];
    setEditedDescription(missionItem?.description || '');
    setEditedImage(null);
    setExistingImageUrl(missionItem?.preview || '');
  };


  const handleSaveMission = async () => {
    try {
      console.log("Submitting mission update...");
      console.log("✏️ Description:", editedDescription);
      console.log("🆔 Editing ID:", editingMissionId);
      console.log("🔢 Index:", editingMissionIndex);
      console.log("🖼️ Image:", editedImage);

      const formData = new FormData();
      formData.append('missionDescription', editedDescription);
      if (editedImage) {
        formData.append('missionImage', editedImage);
      }

      const token = localStorage.getItem('token');

      const res = await axios.put(
        `http://localhost:5000/api/vmc/${editingMissionId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'upload-section': 'mission',
            Authorization: `Bearer ${token}`,
          },
        }
      );


      console.log("✅ Mission updated: ", res.data);
      fetchMissions();

      // Clear edit mode
      setEditingMissionId(null);
      setEditingMissionIndex(null);
      setEditedDescription('');
      setEditedImage(null);
    } catch (err) {
      console.error("❌ Mission update error:", err);
    }
  };


  const handleSubmitAllMissions = async () => {
    try {
      const formData = new FormData();

      tempMissionForms.forEach((m, index) => {
        formData.append('missionImage', m.file);
        formData.append(`missionDescription_${index}`, m.description);
      });

      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/vmc/mission', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      alert('Missions submitted successfully!');
      setTempMissionForms([]);
      fetchMissions();
    } catch (err) {
      console.error('Submit error:', err);
      alert('Error submitting missions');
    }
  };
  // -----------------------------------------------mission section end---------------------------------------------
  // core values section start
  const fetchCoreValues = async () => {
    try {
      console.log("Fetching core values...");

      const token = localStorage.getItem('token');

      const res = await axios.get('http://localhost:5000/api/vmc', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Response received:", res);

      const records = res.data.data || [];
      console.log("Records fetched core:", records);

      const mapped = records.map((r, i) => {
        console.log(`Processing record core ${i + 1}:`, r);

        let parsed = [];

        if (r.core) {
          try {
            parsed = JSON.parse(r.core);
            console.log(`Parsed coreValues for record ${i + 1}:`, parsed);
          } catch (e) {
            console.error(`Invalid JSON in record ${i + 1}:`, e);
          }
        } else {
          console.warn(`No coreValues found in record ${i + 1}`);
        }

        const coreItem = {
          id: r.id,
          values: Array.isArray(parsed)
            ? parsed.map((v) => ({
              title: v.coreTitle,
              preview: v.coreImageUrl
                ? `http://localhost:5000/${v.coreImageUrl.replace(/\\/g, '/')}`
                : '',
            }))
            : [],
        };

        console.log(`Final mapped core item ${i + 1}:`, coreItem);
        return coreItem;
      });

      console.log("All mapped core values:", mapped);
      setSubmittedCoreValues(mapped);
      console.log("🟩 submittedCoreValues SET:", mapped);
    } catch (err) {
      console.error("Error fetching core values:", err);
    }
  };

  const handleAddCoreBlock = () => {
    setTempCoreForms([
      ...tempCoreForms,
      {
        title: '',
        preview: null,
        file: null,
      },
    ]);
  };

  const handleTempCoreImageChange = (index, file) => {
    if (!file) return;
    const updated = [...tempCoreForms];
    updated[index].file = file;
    updated[index].preview = URL.createObjectURL(file);
    setTempCoreForms(updated);
  };

  const handleTempCoreTitleChange = (index, value) => {
    const updated = [...tempCoreForms];
    updated[index].title = value;
    setTempCoreForms(updated);
  };

  const handleDeleteTempCoreForm = (index) => {
    const updated = [...tempCoreForms];
    updated.splice(index, 1);
    setTempCoreForms(updated);
  };

  const handleDeleteCore = async (id) => {
    try {
      const token = localStorage.getItem('token');

      await axios.delete(`http://localhost:5000/api/vmc/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSubmittedCoreValues((prev) => prev.filter((c) => c.id !== id));
      alert('Core value deleted successfully! ✅');
    } catch (error) {
      console.error('Error deleting core value:', error);
      alert('Failed to delete core value ❌');
    }
  };

  const handleEditCore = (id, index) => {
    console.log("✏️ Edit core clicked:", id, index);

    const block = submittedCoreValues.find(c => c.id === id);
    const item = block?.values[index];
    console.log("🔍 Editing item:", item);

    if (!item) return;

    setEditingCoreId(id);
    setEditingCoreIndex(index);
    setEditedCoreTitle(item.title);
    setEditedCoreImage(null);
  };

  const handleSaveCore = async () => {
    try {
      console.log("⏳ Starting core value update...");
      console.log("Editing Core ID:", editingCoreId);
      console.log("Edited Core Title:", editedCoreTitle);
      console.log("Edited Core Image:", editedCoreImage);

      const formData = new FormData();
      formData.append('coreTitle', editedCoreTitle);
      if (editedCoreImage) {
        formData.append('coreImage', editedCoreImage);
      }

      for (let [key, value] of formData.entries()) {
        console.log(`📦 FormData Entry - ${key}:`, value);
      }
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/vmc/${editingCoreId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'upload-section': 'core',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Core updated successfully:", response.data);
      alert('Core updated successfully ✅');
      fetchCoreValues();

      setEditingCoreId(null);
      setEditingCoreIndex(null);
      setEditedCoreTitle('');
      setEditedCoreImage(null);
    } catch (error) {
      console.error('❌ Error updating core value:', error);
      alert('Failed to update core value ❌');
    }
  };

  const handleSubmitAllCores = async () => {
    try {
      const formData = new FormData();

      tempCoreForms.forEach((item, index) => {
        formData.append('coreImage', item.file);
        formData.append(`coreTitle_${index}`, item.title);
      });

      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/vmc/core', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });


      alert('Core values submitted successfully!');
      setTempCoreForms([]);
      fetchCoreValues();
    } catch (err) {
      console.error('Submit error:', err);
      alert('Error submitting core values');
    }
  };

  return (

    <div className="card mb-4 shadow-sm border-0">
      <div className="card-header bg-white d-flex justify-content-between align-items-center">
        <div className="w-100 text-center">
          <h2 className="text-primary fw-bold mb-0">Visions</h2>
        </div>
        <button className="btn btn-sm btn-outline-primary" onClick={handleAddVisionBlock}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>

      <div className="card-body">
        {/* Default Vision Block */}
        <div className="mb-4 p-3 rounded shadow-sm bg-light d-flex align-items-start" style={{ gap: '20px' }}>
          <div style={{ width: '400px' }}>
            <img
              src={defaultImage}
              alt="Default Vision"
              className="img-fluid mb-2"
              style={{
                width: '100%',
                height: '250px',
                objectFit: 'cover',
                borderRadius: '8px',
                border: '1px solid #ddd',
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <h6 className="fw-bold text-primary" style={{ fontSize: '18px', marginBottom: '10px' }}>
              1 &gt; Vision
            </h6>
            <p style={{ textAlign: 'justify', fontSize: '16px', lineHeight: '1.6' }}>{defaultDescription}</p>
          </div>
        </div>

        {/* Submitted Visions */}
        {submittedVisions.map((v) =>
          v.vision.map((item, i) => (
            <div
              key={`${v.id}-${i}`}
              className="mb-4 p-3 rounded shadow-sm bg-light d-flex align-items-start justify-content-between"
            >
              <div style={{ width: '400px', marginRight: '30px' }}>
                <img
                  src={item.preview}
                  alt="Submitted Vision"
                  className="img-fluid mb-2"
                  style={{
                    width: '100%',
                    height: '250px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ textAlign: 'justify', fontSize: '16px', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                  {item.description}
                </p>
              </div>
              <button className="btn btn-sm btn-danger mt-2" onClick={() => handleDeleteVision(v.id)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))
        )}

        {/* TEMP Vision Inputs (newly added but not submitted yet) */}
        {tempForms.map((vision, index) => (
          <div
            key={`temp-${index}`}
            className="mb-4 p-3 rounded shadow-sm bg-light d-flex align-items-start justify-content-between"
          >
            <div style={{ width: '400px', marginRight: '30px' }}>
              <label htmlFor={`temp-image-${index}`} style={{ display: 'block', height: '250px', cursor: 'pointer' }}>
                {vision.preview ? (
                  <img
                    src={vision.preview}
                    alt="Preview"
                    className="img-fluid mb-2"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                    }}
                  />
                ) : (
                  <div
                    className="d-flex justify-content-center align-items-center text-muted mb-2"
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#f8f9fa',
                      border: '1px dashed #ccc',
                      borderRadius: '8px',
                    }}
                  >
                    Click to select image
                  </div>
                )}
              </label>
              <input
                id={`temp-image-${index}`}
                type="file"
                accept="image/*"
                onChange={(e) => handleTempImageChange(index, e.target.files[0])}
                style={{ display: 'none' }}
              />
            </div>

            <div style={{ flex: 1, position: 'relative' }}>
              <textarea
                rows={4}
                className="form-control"
                placeholder={`Enter description for Vision ${index + 2}`}
                value={vision.description}
                onChange={(e) => handleTempDescriptionChange(index, e.target.value)}
              />
              <button className="btn btn-sm btn-danger mt-2" onClick={() => handleDeleteTempForm(index)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        ))}

        {tempForms.length > 0 && (
          <div className="text-end">
            <button className="btn btn-primary" onClick={handleSubmitAll}>
              Submit All Visions
            </button>
          </div>
        )}
      </div>

      {/* mission start */}
      <div className="card mb-4 shadow-sm border-0">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <div className="w-100 text-center">
            <h2 className="text-primary fw-bold mb-0">Missions</h2>
          </div>
          <button className="btn btn-sm btn-outline-primary" onClick={handleAddMissionBlock}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>

        <div className="card-body">
          {/* Default Mission Block */}
          <div className="mb-4 p-3 rounded shadow-sm bg-light d-flex align-items-start" style={{ gap: '20px' }}>
            <div style={{ width: '400px' }}>
              {defaultMissionImage && (
                <img
                  src={defaultMissionImage}
                  alt="Default Mission"
                  className="img-fluid mb-2"
                  style={{
                    width: '100%',
                    height: '250px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                  }}
                />
              )}

            </div>
            <div style={{ flex: 1 }}>
              <h6 className="fw-bold text-primary" style={{ fontSize: '18px', marginBottom: '10px' }}>
                2 &gt; Mission
              </h6>
              <p style={{ textAlign: 'justify', fontSize: '16px', lineHeight: '1.6' }}>{defaultMissionDescription}</p>
            </div>
          </div>

          {/* Submitted Missions */}
          {submittedMissions.map((m) =>
            m.mission.map((item, i) => {
              const isEditing = editingMissionId === m.id && editingMissionIndex === i;

              const getPreviewUrl = () => {
                if (isEditing && editedImage) {
                  return URL.createObjectURL(editedImage);
                } else if (item.preview && item.preview.trim() !== "") {
                  return item.preview;
                } else {
                  return null;
                }
              };

              const previewUrl = getPreviewUrl();

              return (
                <div
                  key={`${m.id}-${i}`}
                  className="mb-4 p-3 rounded shadow-sm bg-light d-flex align-items-start"
                  style={{ gap: "20px" }}
                >
                  {/* ✅ LEFT: Image */}
                  <div style={{ width: "400px" }}>
                    {isEditing ? (
                      <>
                        <input
                          type="file"
                          className="form-control mb-2"
                          onChange={(e) => setEditedImage(e.target.files[0])}
                        />
                        {previewUrl && (
                          <img
                            src={previewUrl}
                            alt="Edited"
                            className="img-fluid"
                            style={{
                              width: "100%",
                              height: "250px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              border: "1px solid #ddd",
                            }}
                          />
                        )}
                      </>
                    ) : (
                      previewUrl && (
                        <img
                          src={previewUrl}
                          alt="Submitted Mission"
                          className="img-fluid"
                          style={{
                            width: "100%",
                            height: "250px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                          }}
                        />
                      )
                    )}
                  </div>

                  {/* ✅ CENTER: Description */}
                  <div style={{ flex: 1 }}>
                    {isEditing ? (
                      <textarea
                        rows={4}
                        className="form-control"
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                      />
                    ) : (
                      <p
                        style={{
                          textAlign: "justify",
                          fontSize: "16px",
                          lineHeight: "1.6",
                          whiteSpace: "pre-line",
                          margin: 0,
                        }}
                      >
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* ✅ RIGHT: Actions */}
                  <div className="d-flex flex-column align-items-end gap-2">
                    {isEditing ? (
                      <>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={(e) => {
                            e.preventDefault();
                            handleSaveMission();
                          }}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => {
                            setEditingMissionId(null);
                            setEditingMissionIndex(null);
                            setEditedDescription("");
                            setEditedImage(null);
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <div className="d-flex align-items-center gap-2">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleEditMission(m.id, i)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteMission(m.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}


          {/* Temp Missions */}
          {tempMissionForms.map((mission, index) => (
            <div
              key={`temp-mission-${index}`}
              className="mb-4 p-3 rounded shadow-sm bg-light d-flex align-items-start justify-content-between"
            >
              <div style={{ width: '400px', marginRight: '30px' }}>
                <label htmlFor={`temp-mission-image-${index}`} style={{ display: 'block', height: '250px', cursor: 'pointer' }}>
                  {mission.preview ? (
                    <img
                      src={mission.preview}
                      alt="Preview"
                      className="img-fluid mb-2"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                      }}
                    />
                  ) : (
                    <div
                      className="d-flex justify-content-center align-items-center text-muted mb-2"
                      style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#f8f9fa',
                        border: '1px dashed #ccc',
                        borderRadius: '8px',
                      }}
                    >
                      Click to select image
                    </div>
                  )}
                </label>
                <input
                  id={`temp-mission-image-${index}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleTempMissionImageChange(index, e.target.files[0])}
                  style={{ display: 'none' }}
                />
              </div>

              <div style={{ flex: 1, position: 'relative' }}>
                <textarea
                  rows={4}
                  className="form-control"
                  placeholder={`Enter description for Mission ${index + 2}`}
                  value={mission.description}
                  onChange={(e) => handleTempMissionDescriptionChange(index, e.target.value)}
                />
                <button className="btn btn-sm btn-danger mt-2" onClick={() => handleDeleteTempMissionForm(index)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}

          {tempMissionForms.length > 0 && (
            <div className="text-end">
              <button className="btn btn-primary" onClick={handleSubmitAllMissions}>
                Submit All Missions
              </button>
            </div>
          )}
        </div>
      </div>
      {/* mission end */}

      {/* core values */}
      <div className="card mb-4 shadow-sm border-0">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <div className="w-100 text-center">
            <h2 className="text-primary fw-bold mb-0">CoreValues</h2>
          </div>
          <button className="btn btn-sm btn-outline-primary" onClick={handleAddCoreBlock}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>

        {/* Default core Block */}
        <div className="card-body">
          <div className="row">
            {defaultCoreValues.map((core, index) => (
              <div key={`default-core-${index}`} className="col-md-3 col-sm-6 mb-4 text-center">
                <div
                  className="p-3 shadow-sm bg-light rounded d-flex flex-column align-items-center"
                  style={{ height: '100%' }}
                >
                  <img
                    src={core.image}
                    alt={core.title}
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'contain',
                      borderRadius: '50%',
                      border: '1px solid #ddd',
                      padding: '10px',
                      backgroundColor: '#fff',
                    }}
                  />
                  <h6 className="fw-semibold mt-3">{core.title}</h6>
                </div>
              </div>
            ))}
          </div>

          {/* Submitted Cores */}
          {submittedCoreValues.length > 0 && (
            <div className="row">
              {submittedCoreValues.flatMap((block) =>
                block.values.map((item, i) => {
                  const isEditing = editingCoreId === block.id && editingCoreIndex === i;

                  return (
                    <div key={`${block.id}-${i}`} className="col-md-3 col-sm-6 mb-4 text-center">
                      <div
                        className="p-3 shadow-sm bg-light rounded d-flex flex-column align-items-center"
                        style={{ height: '100%', position: 'relative' }}
                      >
                        {isEditing ? (
                          <>
                            <input
                              type="file"
                              className="form-control mb-2"
                              onChange={(e) => setEditedCoreImage(e.target.files[0])}
                            />
                            <img
                              src={
                                editedCoreImage
                                  ? URL.createObjectURL(editedCoreImage)
                                  : item.preview
                              }
                              alt="Edited Core"
                              style={{
                                width: '100px',
                                height: '100px',
                                objectFit: 'cover',
                                borderRadius: '50%',
                                border: '1px solid #ddd',
                                padding: '5px',
                              }}
                            />
                            <input
                              type="text"
                              className="form-control mt-2"
                              value={editedCoreTitle}
                              onChange={(e) => setEditedCoreTitle(e.target.value)}
                            />
                            <div className="mt-2 d-flex gap-2">
                              <button className="btn btn-sm btn-success" onClick={handleSaveCore}>
                                Save
                              </button>
                              <button
                                className="btn btn-sm btn-secondary"
                                onClick={() => {
                                  setEditingCoreId(null);
                                  setEditingCoreIndex(null);
                                  setEditedCoreImage(null);
                                  setEditedCoreTitle('');
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <img
                              src={item.preview}
                              alt="Submitted Core"
                              style={{
                                width: '100px',
                                height: '100px',
                                objectFit: 'cover',
                                borderRadius: '50%',
                                border: '1px solid #ddd',
                                padding: '5px',
                              }}
                            />
                            <h6 className="fw-semibold mt-3">{item.title}</h6>
                            <div className="d-flex gap-2 mt-2">
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => handleEditCore(block.id, i)}
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDeleteCore(block.id)}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Temp Core Forms */}
          {tempCoreForms.map((core, index) => (
            <div
              key={`temp-core-${index}`}
              className="mb-3 p-3 rounded shadow-sm bg-light d-flex align-items-center justify-content-between"
            >
              <div className="d-flex gap-3 align-items-center">
                <label htmlFor={`temp-core-image-${index}`} style={{ cursor: 'pointer' }}>
                  {core.preview ? (
                    <img
                      src={core.preview}
                      alt="Preview"
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: '50%',
                        border: '1px solid #ccc',
                      }}
                    />
                  ) : (
                    <div
                      className="d-flex justify-content-center align-items-center text-muted"
                      style={{
                        width: '100px',
                        height: '100px',
                        backgroundColor: '#f8f9fa',
                        border: '1px dashed #ccc',
                        borderRadius: '50%',
                      }}
                    >
                      Click to upload
                    </div>
                  )}
                </label>
                <input
                  id={`temp-core-image-${index}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleTempCoreImageChange(index, e.target.files[0])}
                  style={{ display: 'none' }}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder={`Enter title for Core Value ${index + 1}`}
                  value={core.title}
                  onChange={(e) => handleTempCoreTitleChange(index, e.target.value)}
                />
              </div>
              <button className="btn btn-sm btn-danger ms-3" onClick={() => handleDeleteTempCoreForm(index)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}

          {tempCoreForms.length > 0 && (
            <div className="text-end">
              <button className="btn btn-primary" onClick={handleSubmitAllCores}>
                Submit All Core Values
              </button>
            </div>
          )}
        </div>
      </div>
      {/* ----------------------------------------------------------------------------------------------------------------- */}
   

      <div className="text-end my-3">
        <button className="btn btn-success" onClick={handleAddMoreOne}>
          Add More One
        </button>
      </div>

      <div className="card mb-4 shadow-sm border-0">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <div className="w-100 text-center">
            <h2 className="text-primary fw-bold mb-0">Visions</h2>
          </div>
          <button className="btn btn-sm btn-outline-primary" onClick={handleAddVisionBlock}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>

        <div className="card-body">
          {/* Submitted Visions */}
          {submittedVisions.map((v) =>
            v.vision.map((item, i) => (
              <div
                key={`${v.id}-${i}`}
                className="mb-4 p-3 rounded shadow-sm bg-light d-flex align-items-start justify-content-between"
              >
                <div style={{ width: '400px', marginRight: '30px' }}>
                  <img
                    src={item.preview}
                    alt="Submitted Vision"
                    className="img-fluid mb-2"
                    style={{
                      width: '100%',
                      height: '250px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ textAlign: 'justify', fontSize: '16px', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                    {item.description}
                  </p>
                </div>
                <button className="btn btn-sm btn-danger mt-2" onClick={() => handleDeleteVision(v.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))
          )}

          {/* TEMP Vision Inputs (newly added but not submitted yet) */}
          {tempForms.map((vision, index) => (
            <div
              key={`temp-${index}`}
              className="mb-4 p-3 rounded shadow-sm bg-light d-flex align-items-start justify-content-between"
            >
              <div style={{ width: '400px', marginRight: '30px' }}>
                <label htmlFor={`temp-image-${index}`} style={{ display: 'block', height: '250px', cursor: 'pointer' }}>
                  {vision.preview ? (
                    <img
                      src={vision.preview}
                      alt="Preview"
                      className="img-fluid mb-2"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                      }}
                    />
                  ) : (
                    <div
                      className="d-flex justify-content-center align-items-center text-muted mb-2"
                      style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#f8f9fa',
                        border: '1px dashed #ccc',
                        borderRadius: '8px',
                      }}
                    >
                      Click to select image
                    </div>
                  )}
                </label>
                <input
                  id={`temp-image-${index}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleTempImageChange(index, e.target.files[0])}
                  style={{ display: 'none' }}
                />
              </div>

              <div style={{ flex: 1, position: 'relative' }}>
                <textarea
                  rows={4}
                  className="form-control"
                  placeholder={`Enter description for Vision ${index + 2}`}
                  value={vision.description}
                  onChange={(e) => handleTempDescriptionChange(index, e.target.value)}
                />
                <button className="btn btn-sm btn-danger mt-2" onClick={() => handleDeleteTempForm(index)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}

          {tempForms.length > 0 && (
            <div className="text-end">
              <button className="btn btn-primary" onClick={handleSubmitAll}>
                Submit All Visions
              </button>
            </div>
          )}
        </div>

        {/* mission start */}
        <div className="card mb-4 shadow-sm border-0">
          <div className="card-header bg-white d-flex justify-content-between align-items-center">
            <div className="w-100 text-center">
              <h2 className="text-primary fw-bold mb-0">Missions</h2>
            </div>
            <button className="btn btn-sm btn-outline-primary" onClick={handleAddMissionBlock}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>

          <div className="card-body">
            {/* Submitted Missions */}
            {submittedMissions.map((m) =>
              m.mission.map((item, i) => {
                const isEditing = editingMissionId === m.id && editingMissionIndex === i;

                const getPreviewUrl = () => {
                  if (isEditing && editedImage) {
                    return URL.createObjectURL(editedImage);
                  } else if (item.preview && item.preview.trim() !== "") {
                    return item.preview;
                  } else {
                    return null;
                  }
                };

                const previewUrl = getPreviewUrl();

                return (
                  <div
                    key={`${m.id}-${i}`}
                    className="mb-4 p-3 rounded shadow-sm bg-light d-flex align-items-start"
                    style={{ gap: "20px" }}
                  >
                    {/* ✅ LEFT: Image */}
                    <div style={{ width: "400px" }}>
                      {isEditing ? (
                        <>
                          <input
                            type="file"
                            className="form-control mb-2"
                            onChange={(e) => setEditedImage(e.target.files[0])}
                          />
                          {previewUrl && (
                            <img
                              src={previewUrl}
                              alt="Edited"
                              className="img-fluid"
                              style={{
                                width: "100%",
                                height: "250px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                border: "1px solid #ddd",
                              }}
                            />
                          )}
                        </>
                      ) : (
                        previewUrl && (
                          <img
                            src={previewUrl}
                            alt="Submitted Mission"
                            className="img-fluid"
                            style={{
                              width: "100%",
                              height: "250px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              border: "1px solid #ddd",
                            }}
                          />
                        )
                      )}
                    </div>

                    {/* ✅ CENTER: Description */}
                    <div style={{ flex: 1 }}>
                      {isEditing ? (
                        <textarea
                          rows={4}
                          className="form-control"
                          value={editedDescription}
                          onChange={(e) => setEditedDescription(e.target.value)}
                        />
                      ) : (
                        <p
                          style={{
                            textAlign: "justify",
                            fontSize: "16px",
                            lineHeight: "1.6",
                            whiteSpace: "pre-line",
                            margin: 0,
                          }}
                        >
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* ✅ RIGHT: Actions */}
                    <div className="d-flex flex-column align-items-end gap-2">
                      {isEditing ? (
                        <>
                          <button
                            className="btn btn-sm btn-success"
                            onClick={(e) => {
                              e.preventDefault();
                              handleSaveMission();
                            }}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => {
                              setEditingMissionId(null);
                              setEditingMissionIndex(null);
                              setEditedDescription("");
                              setEditedImage(null);
                            }}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <div className="d-flex align-items-center gap-2">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleEditMission(m.id, i)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteMission(m.id)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}


            {/* Temp Missions */}
            {tempMissionForms.map((mission, index) => (
              <div
                key={`temp-mission-${index}`}
                className="mb-4 p-3 rounded shadow-sm bg-light d-flex align-items-start justify-content-between"
              >
                <div style={{ width: '400px', marginRight: '30px' }}>
                  <label htmlFor={`temp-mission-image-${index}`} style={{ display: 'block', height: '250px', cursor: 'pointer' }}>
                    {mission.preview ? (
                      <img
                        src={mission.preview}
                        alt="Preview"
                        className="img-fluid mb-2"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid #ddd',
                        }}
                      />
                    ) : (
                      <div
                        className="d-flex justify-content-center align-items-center text-muted mb-2"
                        style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: '#f8f9fa',
                          border: '1px dashed #ccc',
                          borderRadius: '8px',
                        }}
                      >
                        Click to select image
                      </div>
                    )}
                  </label>
                  <input
                    id={`temp-mission-image-${index}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleTempMissionImageChange(index, e.target.files[0])}
                    style={{ display: 'none' }}
                  />
                </div>

                <div style={{ flex: 1, position: 'relative' }}>
                  <textarea
                    rows={4}
                    className="form-control"
                    placeholder={`Enter description for Mission ${index + 2}`}
                    value={mission.description}
                    onChange={(e) => handleTempMissionDescriptionChange(index, e.target.value)}
                  />
                  <button className="btn btn-sm btn-danger mt-2" onClick={() => handleDeleteTempMissionForm(index)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))}

            {tempMissionForms.length > 0 && (
              <div className="text-end">
                <button className="btn btn-primary" onClick={handleSubmitAllMissions}>
                  Submit All Missions
                </button>
              </div>
            )}
          </div>
        </div>
        {/* mission end */}

        {/* core values */}
        <div className="card mb-4 shadow-sm border-0">
          <div className="card-header bg-white d-flex justify-content-between align-items-center">
            <div className="w-100 text-center">
              <h2 className="text-primary fw-bold mb-0">CoreValues</h2>
            </div>
            <button className="btn btn-sm btn-outline-primary" onClick={handleAddCoreBlock}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>

          {/* Default core Block */}
          <div className="card-body">


            {/* Submitted Cores */}
            {submittedCoreValues.length > 0 && (
              <div className="row">
                {submittedCoreValues.flatMap((block) =>
                  block.values.map((item, i) => {
                    const isEditing = editingCoreId === block.id && editingCoreIndex === i;

                    return (
                      <div key={`${block.id}-${i}`} className="col-md-3 col-sm-6 mb-4 text-center">
                        <div
                          className="p-3 shadow-sm bg-light rounded d-flex flex-column align-items-center"
                          style={{ height: '100%', position: 'relative' }}
                        >
                          {isEditing ? (
                            <>
                              <input
                                type="file"
                                className="form-control mb-2"
                                onChange={(e) => setEditedCoreImage(e.target.files[0])}
                              />
                              <img
                                src={
                                  editedCoreImage
                                    ? URL.createObjectURL(editedCoreImage)
                                    : item.preview
                                }
                                alt="Edited Core"
                                style={{
                                  width: '100px',
                                  height: '100px',
                                  objectFit: 'cover',
                                  borderRadius: '50%',
                                  border: '1px solid #ddd',
                                  padding: '5px',
                                }}
                              />
                              <input
                                type="text"
                                className="form-control mt-2"
                                value={editedCoreTitle}
                                onChange={(e) => setEditedCoreTitle(e.target.value)}
                              />
                              <div className="mt-2 d-flex gap-2">
                                <button className="btn btn-sm btn-success" onClick={handleSaveCore}>
                                  Save
                                </button>
                                <button
                                  className="btn btn-sm btn-secondary"
                                  onClick={() => {
                                    setEditingCoreId(null);
                                    setEditingCoreIndex(null);
                                    setEditedCoreImage(null);
                                    setEditedCoreTitle('');
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </>
                          ) : (
                            <>
                              <img
                                src={item.preview}
                                alt="Submitted Core"
                                style={{
                                  width: '100px',
                                  height: '100px',
                                  objectFit: 'cover',
                                  borderRadius: '50%',
                                  border: '1px solid #ddd',
                                  padding: '5px',
                                }}
                              />
                              <h6 className="fw-semibold mt-3">{item.title}</h6>
                              <div className="d-flex gap-2 mt-2">
                                <button
                                  className="btn btn-sm btn-primary"
                                  onClick={() => handleEditCore(block.id, i)}
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </button>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleDeleteCore(block.id)}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Temp Core Forms */}
            {tempCoreForms.map((core, index) => (
              <div
                key={`temp-core-${index}`}
                className="mb-3 p-3 rounded shadow-sm bg-light d-flex align-items-center justify-content-between"
              >
                <div className="d-flex gap-3 align-items-center">
                  <label htmlFor={`temp-core-image-${index}`} style={{ cursor: 'pointer' }}>
                    {core.preview ? (
                      <img
                        src={core.preview}
                        alt="Preview"
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '50%',
                          border: '1px solid #ccc',
                        }}
                      />
                    ) : (
                      <div
                        className="d-flex justify-content-center align-items-center text-muted"
                        style={{
                          width: '100px',
                          height: '100px',
                          backgroundColor: '#f8f9fa',
                          border: '1px dashed #ccc',
                          borderRadius: '50%',
                        }}
                      >
                        Click to upload
                      </div>
                    )}
                  </label>
                  <input
                    id={`temp-core-image-${index}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleTempCoreImageChange(index, e.target.files[0])}
                    style={{ display: 'none' }}
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`Enter title for Core Value ${index + 1}`}
                    value={core.title}
                    onChange={(e) => handleTempCoreTitleChange(index, e.target.value)}
                  />
                </div>
                <button className="btn btn-sm btn-danger ms-3" onClick={() => handleDeleteTempCoreForm(index)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}

            {tempCoreForms.length > 0 && (
              <div className="text-end">
                <button className="btn btn-primary" onClick={handleSubmitAllCores}>
                  Submit All Core Values
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

  );
};

export default VisionSection;
