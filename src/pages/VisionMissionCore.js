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
    // setTempForms([{ preview: "", description: "" }]);
    setTempForms([...tempForms, { preview: "", description: "" }]);
    // setTempMissionForms([{ preview: "", description: "" }]);
    // setTempCoreForms([{ preview: "", title: "" }]);
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


 const handleSubmitAllVMC = async () => {
  try {
    const formData = new FormData();

    const visionData = tempForms.map((v, i) => {
      const imageKey = `visionImage_${i}`;
      if (v.file) formData.append(imageKey, v.file); // ✅ append file
      return {
        description: v.description,
        ...(v.file && { imageUrl: imageKey }),
      };
    });

    const missionData = tempMissionForms.map((m, i) => {
      const imageKey = `missionImage_${i}`;
      if (m.file) formData.append(imageKey, m.file); // ✅ append file
      return {
        description: m.description,
        ...(m.file && { imageUrl: imageKey }),
      };
    });

    const coreData = tempCoreForms.map((c, i) => {
      const imageKey = `coreImage_${i}`;
      if (c.file) formData.append(imageKey, c.file); // ✅ append file
      return {
        title: c.title,
        ...(c.file && { imageUrl: imageKey }),
      };
    });

    const data = {
      vision: visionData,
      mission: missionData,
      core: coreData,
    };

    formData.append("data", JSON.stringify(data));

    const token = localStorage.getItem("token");

    await axios.post("http://localhost:5000/api/vmc/vision", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    alert("✅ Submitted successfully!");
    setTempForms([]);
    setTempMissionForms([]);
    setTempCoreForms([]);
    fetchData();
    fetchMissions();
    fetchCoreValues();
  } catch (err) {
    console.error("❌ Submit error:", err);
    alert("Error submitting Vision, Mission, and Core Values");
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
              <label
                htmlFor={`temp-image-${index}`}
                style={{ display: 'block', height: '250px', cursor: 'pointer' }}
              >
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

        {/* {tempForms.length > 0 && (
          <div className="text-end">
            <button className="btn btn-primary" onClick={handleSubmitAll}>
              Submit All Visions
            </button>
          </div>
        )} */}
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

          {/* {tempMissionForms.length > 0 && (
            <div className="text-end">
              <button className="btn btn-primary" onClick={handleSubmitAllMissions}>
                Submit All Missions
              </button>
            </div>
          )} */}
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

          {/* {tempCoreForms.length > 0 && (
            <div className="text-end">
              <button className="btn btn-primary" onClick={handleSubmitAllCores}>
                Submit All Core Values
              </button>
            </div>
          )} */}
          {tempForms.length > 0 && (
            <div className="text-end">
              <button className="btn btn-primary" onClick={handleSubmitAllVMC}>
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

     
    </div>

  );
};

export default VisionSection;
