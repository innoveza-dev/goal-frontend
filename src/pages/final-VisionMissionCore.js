import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faEdit, faSave } from '@fortawesome/free-solid-svg-icons';

const VisionSection = () => {
  const [visions, setVisions] = useState([]);
  const [submittedVisions, setSubmittedVisions] = useState([]);
  const [missions, setMissions] = useState([]);
  const [submittedMissions, setSubmittedMissions] = useState([]);
  const [submittedCoreValues, setSubmittedCoreValues] = useState([]);
  const [tempCoreForms, setTempCoreForms] = useState([]);
  
  // Vision editing states
  const [editingVisionId, setEditingVisionId] = useState(null);
  const [editingVisionIndex, setEditingVisionIndex] = useState(null);
  const [editedVisionDescription, setEditedVisionDescription] = useState('');
  const [editedVisionImage, setEditedVisionImage] = useState(null);
  const [existingVisionImageUrl, setExistingVisionImageUrl] = useState('');
  
  // Mission editing states
  const [editingMissionId, setEditingMissionId] = useState(null);
  const [editingMissionIndex, setEditingMissionIndex] = useState(null);
  const [editedDescription, setEditedDescription] = useState('');
  const [editedImage, setEditedImage] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState('');

  // Core editing states
  const [editingCoreId, setEditingCoreId] = useState(null);
  const [editingCoreIndex, setEditingCoreIndex] = useState(null);
  const [editedCoreImage, setEditedCoreImage] = useState(null);
  const [editedCoreTitle, setEditedCoreTitle] = useState('');
  const [showTempSection, setShowTempSection] = useState(false);
  const [cardSets, setCardSets] = useState([0]); // Track multiple card sets
  const [additionalCardSets, setAdditionalCardSets] = useState([]); // Track additional card sets
  const [additionalCardForms, setAdditionalCardForms] = useState({}); // Track forms for each additional card set

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

  const handleAddMore = () => {
    // Add a new additional card set
    const newSetId = Date.now(); // Use timestamp as unique ID
    setAdditionalCardSets([...additionalCardSets, newSetId]);
    // Initialize empty forms for the new card set
    setAdditionalCardForms({
      ...additionalCardForms,
      [newSetId]: {
        visions: [],
        mission: [],
        core: []
      }
    });
  };

  const handleRemoveCardSet = (setId) => {
    setAdditionalCardSets(additionalCardSets.filter(id => id !== setId));
    // Remove forms for this card set
    const updatedForms = { ...additionalCardForms };
    delete updatedForms[setId];
    setAdditionalCardForms(updatedForms);
  };

  // Functions for additional card sets
  const handleAddVisionBlockToSet = (setId) => {
    if (setId === 'main') {
      // Handle main card set

    } else {
      // Handle additional card set
      setAdditionalCardForms({
        ...additionalCardForms,
        [setId]: {
          ...additionalCardForms[setId],
          visions: [
            ...additionalCardForms[setId]?.visions || [],
            {
              description: '',
              preview: null,
              file: null,
            }
          ]
        }
      });
    }
  };

  const handleAddMissionBlockToSet = (setId) => {
    if (setId === 'main') {
      // Handle main card set

    } else {
      // Handle additional card set
      setAdditionalCardForms({
        ...additionalCardForms,
        [setId]: {
          ...additionalCardForms[setId],
          mission: [
            ...additionalCardForms[setId]?.mission || [],
            {
              description: '',
              preview: null,
              file: null,
            }
          ]
        }
      });
    }
  };

  const handleAddCoreBlockToSet = (setId) => {
    if (setId === 'main') {
      // Handle main card set
      setTempCoreForms([
        ...tempCoreForms,
        {
          title: '',
          preview: null,
          file: null,
        },
      ]);
      setShowTempSection(true); // Show the form when adding
    } else {
      // Handle additional card set
      setAdditionalCardForms({
        ...additionalCardForms,
        [setId]: {
          ...additionalCardForms[setId],
          core: [
            ...additionalCardForms[setId]?.core || [],
            {
              title: '',
              preview: null,
              file: null,
            }
          ]
        }
      });
    }
  };

  // Helper functions for additional card sets
  const handleTempImageChangeForSet = (setId, index, file) => {
    if (!file) return;
    if (setId === 'main') {

    } else {
      const updatedForms = { ...additionalCardForms };
      updatedForms[setId].visions[index].file = file;
      updatedForms[setId].visions[index].preview = URL.createObjectURL(file);
      setAdditionalCardForms(updatedForms);
    }
  };

  const handleTempDescriptionChangeForSet = (setId, index, value) => {
    if (setId === 'main') {

    } else {
      const updatedForms = { ...additionalCardForms };
      updatedForms[setId].visions[index].description = value;
      setAdditionalCardForms(updatedForms);
    }
  };

  const handleDuplicateVisionBlockForSet = (setId, index) => {
    if (setId === 'main') {

    } else {
      const updatedForms = { ...additionalCardForms };
      const block = updatedForms[setId].visions[index];
      updatedForms[setId].visions.splice(index + 1, 0, { ...block });
      setAdditionalCardForms(updatedForms);
    }
  };

  const handleRemoveVisionBlockForSet = (setId, index) => {
    if (setId === 'main') {

    } else {
      const updatedForms = { ...additionalCardForms };
      updatedForms[setId].visions.splice(index, 1);
      setAdditionalCardForms(updatedForms);
    }
  };

  const handleTempMissionImageChangeForSet = (setId, index, file) => {
    if (!file) return;
    if (setId === 'main') {

    } else {
      const updatedForms = { ...additionalCardForms };
      updatedForms[setId].mission[index].file = file;
      updatedForms[setId].mission[index].preview = URL.createObjectURL(file);
      setAdditionalCardForms(updatedForms);
    }
  };

  const handleTempMissionDescriptionChangeForSet = (setId, index, value) => {
    if (setId === 'main') {

    } else {
      const updatedForms = { ...additionalCardForms };
      updatedForms[setId].mission[index].description = value;
      setAdditionalCardForms(updatedForms);
    }
  };

  const handleDuplicateMissionBlockForSet = (setId, index) => {
    if (setId === 'main') {

    } else {
      const updatedForms = { ...additionalCardForms };
      const originalMission = updatedForms[setId].mission[index];
      updatedForms[setId].mission.push({ ...originalMission });
      setAdditionalCardForms(updatedForms);
    }
  };

  const handleRemoveMissionBlockForSet = (setId, index) => {
    if (setId === 'main') {

    } else {
      const updatedForms = { ...additionalCardForms };
      updatedForms[setId].mission.splice(index, 1);
      setAdditionalCardForms(updatedForms);
    }
  };

  const handleTempCoreImageChangeForSet = (setId, index, file) => {
    if (!file) return;
    if (setId === 'main') {
      handleTempCoreImageChange(index, file);
    } else {
      const updatedForms = { ...additionalCardForms };
      updatedForms[setId].core[index].file = file;
      updatedForms[setId].core[index].preview = URL.createObjectURL(file);
      setAdditionalCardForms(updatedForms);
    }
  };

  const handleTempCoreTitleChangeForSet = (setId, index, value) => {
    if (setId === 'main') {
      handleTempCoreTitleChange(index, value);
    } else {
      const updatedForms = { ...additionalCardForms };
      updatedForms[setId].core[index].title = value;
      setAdditionalCardForms(updatedForms);
    }
  };

  const handleDuplicateCoreBlockForSet = (setId, index) => {
    if (setId === 'main') {
      handleDuplicateCoreBlock(index);
    } else {
      const updatedForms = { ...additionalCardForms };
      const originalCore = updatedForms[setId].core[index];
      updatedForms[setId].core.push({ ...originalCore });
      setAdditionalCardForms(updatedForms);
    }
  };

  const handleRemoveCoreBlockForSet = (setId, index) => {
    if (setId === 'main') {
      handleRemoveCoreBlock(index);
    } else {
      const updatedForms = { ...additionalCardForms };
      updatedForms[setId].core.splice(index, 1);
      setAdditionalCardForms(updatedForms);
    }
  };


  const handleRemoveAllSections = () => {
    // Only clear core forms since vision and mission are single edit items
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
        .filter((r) =>{
          return (
            r.vision &&
            typeof r.vision === 'string' &&
            r.vision.trim() !== '' &&
            r.vision.trim() !== '[]'
          );
        })
        .map((r) => {
          let parsed = [];
          try {
            parsed = JSON.parse(r.vision);
          } catch (e) {
            console.error('Invalid vision JSON:', e);
          }
          return {
            id: r.id,
            vision: parsed.map((v) => {
              let preview = '';
              const defaultVisionUrl = 'https://cdn-icons-png.flaticon.com/256/562/562539.png';
              if (
                v.visionImageUrl &&
                v.visionImageUrl.trim() !== '' &&
                v.visionImageUrl !== defaultVisionUrl
              ) {
                preview = `http://localhost:5000/${v.visionImageUrl.replace(/\\/g, '/')}`;
              } else {
                preview = defaultVisionUrl;
              }
              return {
                description: v.description || v.visionDescription,
                preview
              };
            }),
          };
        });
      

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
        .filter((r) =>{
          return (
            r.mission &&
            typeof r.mission === 'string' &&
            r.mission.trim() !== '' &&
            r.mission.trim() !== '[]'
          );
        })
        .map((r) => {
          let parsed = [];
          try {
            parsed = JSON.parse(r.mission);
          } catch (e) {
            console.error('Invalid mission JSON:', e);
          }

          return {
            id: r.id,
            mission: parsed.map((v) => {
              let preview = '';
              const defaultMissionUrl = 'https://gnitipu.in/front_assets/images/mission%20image.png';
              if (
                v.missionImageUrl &&
                v.missionImageUrl.trim() !== '' &&
                v.missionImageUrl !== defaultMissionUrl
              ) {
                preview = `http://localhost:5000/${v.missionImageUrl.replace(/\\/g, '/')}`;
              } else {
                preview = defaultMissionUrl;
              }
              return {
                description: v.description || v.missionDescription || '',
                preview
              };
            }),
          };
        });

      

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

  // Vision editing only - no adding multiple visions

  // Vision editing only - no temp forms

  const handleDeleteVision = async (id, index) => {
    if (!window.confirm('Are you sure you want to delete this vision?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      await axios.delete(`http://localhost:5000/api/vmc/${id}/item`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: {
          type: 'vision',
          index: index
        }
      });

      // Update state to remove the deleted vision
      setSubmittedVisions((prev) => 
        prev.map(block => {
          if (block.id === id) {
            const updatedVisions = [...block.vision];
            updatedVisions.splice(index, 1);
            return { ...block, vision: updatedVisions };
          }
          return block;
        }).filter(block => block.vision.length > 0) // Remove blocks with no visions
      );

      alert('Vision deleted successfully!');
    } catch (error) {
      console.error('Error deleting vision:', error);
      alert('Failed to delete vision.');
    }
  };

  const handleEditVision = (id, index) => {
    setEditingVisionId(id);
    setEditingVisionIndex(index);

    const visionItem = submittedVisions.find(v => v.id === id)?.vision[index];
    setEditedVisionDescription(visionItem?.description || '');
    setEditedVisionImage(null);
    setExistingVisionImageUrl(visionItem?.preview || '');
  };

  const handleSaveVision = async () => {
    if (!editedVisionDescription.trim()) {
      alert('Please enter a vision description');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('visionDescription', editedVisionDescription);
      
      // Only append image if a new one was selected
      if (editedVisionImage) {
        formData.append('visionImage', editedVisionImage);
      } else {
        formData.append('preserveExistingImage', 'true');
      }

      const token = localStorage.getItem('token');

      const res = await axios.put(
        `http://localhost:5000/api/vmc/${editingVisionId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'upload-section': 'vision',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchData();

      // Clear edit mode
      setEditingVisionId(null);
      setEditingVisionIndex(null);
      setEditedVisionDescription('');
      setEditedVisionImage(null);
      alert('Vision updated successfully! ✅');
    } catch (err) {
      console.error("❌ Vision update error:", err);
      alert('Failed to update vision ❌');
    }
  };

  // Mission editing only - no adding multiple missions

  // Mission editing only - no temp forms



  const handleDeleteMission = async (id, index) => {
    if (!window.confirm('Are you sure you want to delete this mission?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      await axios.delete(`http://localhost:5000/api/vmc/${id}/item`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: {
          type: 'mission',
          index: index
        }
      });

      // Update state to remove the deleted mission
      setSubmittedMissions((prev) => 
        prev.map(block => {
          if (block.id === id) {
            const updatedMissions = [...block.mission];
            updatedMissions.splice(index, 1);
            return { ...block, mission: updatedMissions };
          }
          return block;
        }).filter(block => block.mission.length > 0) // Remove blocks with no missions
      );

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
    if (!editedDescription.trim()) {
      alert('Please enter a mission description');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('missionDescription', editedDescription);
      
      // Only append image if a new one was selected
      if (editedImage) {
        formData.append('missionImage', editedImage);
      } else {
        formData.append('preserveExistingImage', 'true');
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

      fetchMissions();

      // Clear edit mode
      setEditingMissionId(null);
      setEditingMissionIndex(null);
      setEditedDescription('');
      setEditedImage(null);
      alert('Mission updated successfully! ✅');
    } catch (err) {
      console.error("❌ Mission update error:", err);
      alert('Failed to update mission ❌');
    }
  };


  // Mission editing only - no separate mission submission


 const handleSubmitAllVMC = async () => {
  // Only submit core values since vision and mission are single edit-only items
  const hasCore = tempCoreForms.length > 0 && tempCoreForms.some(c => c.title.trim());
  const hasAdditionalContent = additionalCardSets.some(setId => {
    const forms = additionalCardForms[setId];
    return forms?.core?.some(c => c.title.trim());
  });

  if (!hasCore && !hasAdditionalContent) {
    alert('Please add at least one core value before submitting');
    return;
  }

  try {
    const formData = new FormData();

    // Only collect core data since vision and mission are single items
    const coreData = tempCoreForms
      .filter(c => c.title.trim())
      .map((c, i) => {
        const imageKey = `coreImage_${i}`;
        if (c.file) formData.append(imageKey, c.file);
        return {
          title: c.title,
          ...(c.file && { imageUrl: imageKey }),
        };
      });

    // Collect core data from additional card sets
    let additionalCoreData = [];

    additionalCardSets.forEach((setId) => {
      const cardForms = additionalCardForms[setId] || {};
      
      // Process cores from additional card sets
      if (cardForms.core) {
        cardForms.core
          .filter(c => c.title.trim())
          .forEach((c, i) => {
            const imageKey = `additionalCoreImage_${setId}_${i}`;
            if (c.file) formData.append(imageKey, c.file);
            additionalCoreData.push({
              title: c.title,
              ...(c.file && { imageUrl: imageKey }),
            });
          });
      }
    });

    // Add default vision and mission with core data
    const visionData = { description: defaultDescription, visionImageUrl: defaultImage };
    const missionData = { description: defaultMissionDescription, missionImageUrl: defaultMissionImage };
    const combinedCoreData = [...coreData, ...additionalCoreData];

    const combinedData = {
      vision: [visionData],
      mission: [missionData],
      core: combinedCoreData,
    };

    formData.append("data", JSON.stringify(combinedData));

    const token = localStorage.getItem("token");

    await axios.post("http://localhost:5000/api/vmc/vision", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    alert("✅ Core values submitted successfully!");
    // Clear only temp core forms since vision and mission are single edit items
    setTempCoreForms([]);
    setAdditionalCardSets([]);
    setAdditionalCardForms({});
    fetchData();
    fetchMissions();
    fetchCoreValues();
  } catch (err) {
    console.error("❌ Submit error:", err);
    alert(`Error submitting Core Values: ${err.response?.data?.message || err.message}`);
  }
};



  // -----------------------------------------------mission section end---------------------------------------------
  // core values section start                                                                      

  const fetchCoreValues = async () => {
    try {
      const token = localStorage.getItem('token');

      const res = await axios.get('http://localhost:5000/api/vmc', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const records = res.data.data || [];
      
      const mapped = records
        .filter(r => r.core && r.core.toString().trim() !== '' && r.core.toString().trim() !== '[]')
        .map((r, i) => {
          let parsed = [];

          if (r.core) {
            try {
              parsed = Array.isArray(r.core) ? r.core : JSON.parse(r.core);
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
                title: v.title || v.coreTitle, // Support both new and old format
                preview: v.coreImageUrl
                  ? `http://localhost:5000/${v.coreImageUrl.replace(/\\/g, '/')}`
                  : 'https://cdn-icons-png.flaticon.com/512/3062/3062634.png',
              }))
              : [],
          };

          return coreItem;
        });

      setSubmittedCoreValues(mapped);
    } catch (err) {
      console.error("Error fetching core values:", err);
    }
  };


  // Add a new Core Value block
  // Add a new Core Value block with a unique customKey
  const handleAddCoreBlock = () => {
    setTempCoreForms([
      ...tempCoreForms,
      {
        title: '',
        preview: null,
        file: null,
        customKey: Date.now() + Math.random(),
      },
    ]);
  };

  // Duplicate a Core Value block
  const handleDuplicateCoreBlock = (index) => {
    const block = tempCoreForms[index];
    setTempCoreForms([
      ...tempCoreForms.slice(0, index + 1),
      { ...block },
      ...tempCoreForms.slice(index + 1),
    ]);
  };

  // Remove a Core Value block
  const handleRemoveCoreBlock = (index) => {
    const updated = [...tempCoreForms];
    updated.splice(index, 1);
    setTempCoreForms(updated);
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

  const handleDeleteCore = async (id, index) => {
    if (!window.confirm('Are you sure you want to delete this core value?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      await axios.delete(`http://localhost:5000/api/vmc/${id}/item`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: {
          type: 'core',
          index: index
        }
      });

      // Update state to remove the deleted core value
      setSubmittedCoreValues((prev) => 
        prev.map(block => {
          if (block.id === id) {
            const updatedValues = [...block.values];
            updatedValues.splice(index, 1);
            return { ...block, values: updatedValues };
          }
          return block;
        }).filter(block => block.values.length > 0) // Remove blocks with no values
      );
      
      alert('Core value deleted successfully! ✅');
    } catch (error) {
      console.error('Error deleting core value:', error);
      alert('Failed to delete core value ❌');
    }
  };

  // Edit core value, store customKey for update
  const handleEditCore = (id, index) => {
    const block = submittedCoreValues.find(c => c.id === id);
    const item = block?.values[index];
    if (!item) return;
    setEditingCoreId(id);
    setEditingCoreIndex(index);
    setEditedCoreTitle(item.title);
    setEditedCoreImage(null);
    // Store customKey for update
    setEditedCoreCustomKey(item.customKey || (item.title + '_' + index));
  };

  // Save core value: update if editing, add if new
  const [editedCoreCustomKey, setEditedCoreCustomKey] = useState(null);
  const handleSaveCore = async () => {
    if (!editedCoreTitle.trim()) {
      alert('Please enter a core value title');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('coreTitle', editedCoreTitle);
      if (editedCoreImage) {
        formData.append('coreImage', editedCoreImage);
      } else {
        formData.append('preserveExistingImage', 'true');
      }
      // Add id and index for backend to identify
      if (editingCoreId) {
        formData.append('coreId', editingCoreId);
      }
      if (editingCoreIndex !== null && editingCoreIndex !== undefined) {
        formData.append('coreIndex', editingCoreIndex);
      }
      const token = localStorage.getItem('token');
      await axios.put(
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
      alert('Core updated successfully ✅');
      fetchCoreValues();
      setEditingCoreId(null);
      setEditingCoreIndex(null);
      setEditedCoreTitle('');
      setEditedCoreImage(null);
      setEditedCoreCustomKey(null);
      setTempCoreForms([]); // Hide and clear the core create form
      setShowTempSection(false); // If you use this flag to show/hide the form
    } catch (error) {
      console.error('❌ Error updating core value:', error);
      alert('Failed to update core value ❌');
    }
  };

  const handleSubmitAllCores = async () => {
    if (tempCoreForms.length === 0) {
      alert('Please add at least one core value before submitting');
      return;
    }

    // Validate all core values have titles
    const invalidCores = tempCoreForms.filter(c => !c.title.trim());
    if (invalidCores.length > 0) {
      alert('Please provide titles for all core values');
      return;
    }

    try {
      const formData = new FormData();

      // Build array of core values
      const coreData = tempCoreForms.map((item, index) => {
        const imageKey = `coreImage_${index}`;
        if (item.file) formData.append(imageKey, item.file);
        return {
          title: item.title,
          ...(item.file && { imageUrl: imageKey })
        };
      });

      // Add to data object
      const data = { core: coreData };
      formData.append('data', JSON.stringify(data));

      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/vmc/vision', formData, {
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
    <>
    <div className="card mb-4 shadow-sm border-0">
      <div className="card-header bg-white d-flex justify-content-between align-items-center">
        <div className="w-100 text-center">
          <h2 className="text-primary fw-bold mb-0">Visions</h2>
        </div>
        {/* <button className="btn btn-sm btn-outline-primary" onClick={() => handleAddVisionBlockToSet('main')}>
          <FontAwesomeIcon icon={faPlus} />
        </button> */}
      </div>

      <div className="card-body">
        
        {submittedVisions.length === 0 && (
          <div className="mb-4 p-3 rounded shadow-sm bg-light d-flex align-items-start" style={{ gap: '20px' }}>
            <div style={{ width: '400px' }}>
              {editingVisionId === 'default' ? (
                <>
                  <input
                    type="file"
                    className="form-control mb-2"
                    accept="image/*"
                    onChange={e => setEditedVisionImage(e.target.files[0])}
                  />
                  {editedVisionImage ? (
                    <img
                      src={URL.createObjectURL(editedVisionImage)}
                      alt="New Image"
                      className="img-fluid mb-2"
                      style={{
                        width: '100%',
                        height: '250px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '2px solid #28a745',
                      }}
                    />
                  ) : (
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
                  )}
                </>
              ) : (
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
              )}
            </div>
            <div style={{ flex: 1 }}>
              <h6 className="fw-bold text-primary" style={{ fontSize: '18px', marginBottom: '10px' }}>
                1 &gt; Vision
              </h6>
              {editingVisionId === 'default' ? (
                <>
                  <textarea
                    rows={4}
                    className="form-control"
                    value={editedVisionDescription}
                    onChange={(e) => setEditedVisionDescription(e.target.value)}
                  />
                  <div className="d-flex gap-2 mt-2">
                    <button className="btn btn-sm btn-success" onClick={async () => {
                      // Save as new record
                      const formData = new FormData();
                      let visionData;
                      if (editedVisionImage) {
                        // If a new image is selected, use imageUrl key for backend mapping
                        formData.append('visionImage', editedVisionImage);
                        visionData = { description: editedVisionDescription, imageUrl: 'visionImage' };
                      } else {
                        // If no new image, use the URL directly
                        visionData = { description: editedVisionDescription, visionImageUrl: defaultImage };
                      }
                      const missionData = { description: defaultMissionDescription, missionImageUrl: defaultMissionImage };
                      // Do NOT send default core values to API
                      formData.append('data', JSON.stringify({
                        vision: [visionData],
                        mission: [missionData]
                        // core is omitted unless user adds/edits core values
                      }));
                      const token = localStorage.getItem('token');
                      await axios.post('http://localhost:5000/api/vmc/vision', formData, {
                        headers: {
                          Authorization: `Bearer ${token}`,
                          'Content-Type': 'multipart/form-data',
                        },
                      });
                      setEditingVisionId(null);
                      setEditedVisionDescription('');
                      setEditedVisionImage(null);
                      fetchData();
                      fetchMissions();
                      fetchCoreValues();
                    }}>
                      Save
                    </button>
                    <button className="btn btn-sm btn-secondary" onClick={() => {
                      setEditingVisionId(null);
                      setEditedVisionDescription('');
                      setEditedVisionImage(null);
                    }}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <p style={{ textAlign: 'justify', fontSize: '16px', lineHeight: '1.6' }}>{defaultDescription}</p>
                  <button className="btn btn-sm btn-primary mt-2" onClick={() => {
                    setEditingVisionId('default');
                    setEditedVisionDescription(defaultDescription);
                  }}><FontAwesomeIcon icon={faEdit} /></button>
                </>
              )}
            </div>
          </div>
        )}

        {submittedVisions.map((v) =>
          v.vision.map((item, i) => {
            const isEditing = editingVisionId === v.id && editingVisionIndex === i;
            // Show preview: if editing and new image, show new; else show current; else fallback
            let previewUrl = null;
            if (isEditing && editedVisionImage) {
              previewUrl = URL.createObjectURL(editedVisionImage);
            } else if (item.preview && item.preview.trim() !== "") {
              // If preview is https, use default
              if (item.preview.startsWith('https://')) {
                previewUrl = defaultImage;
              } else {
                previewUrl = item.preview;
              }
            }
            return (
              <div
                key={`${v.id}-${i}`}
                className="mb-4 p-3 rounded shadow-sm bg-light d-flex align-items-start"
                style={{ gap: "20px" }}
              >
                {/* LEFT: Image */}
                <div style={{ width: "400px" }}>
                  {isEditing ? (
                    <>
                      <input
                        type="file"
                        className="form-control mb-2"
                        onChange={(e) => setEditedVisionImage(e.target.files[0])}
                      />
                      {editedVisionImage ? (
                        <div>
                          <small className="text-success mb-1 d-block">🆕 New image selected</small>
                          <img
                            src={URL.createObjectURL(editedVisionImage)}
                            alt="New Image"
                            className="img-fluid"
                            style={{
                              width: "100%",
                              height: "250px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              border: "2px solid #28a745",
                            }}
                          />
                        </div>
                      ) : previewUrl ? (
                        <div>
                          <small className="text-info mb-1 d-block">📸 Current image (will be preserved)</small>
                          <img
                            src={previewUrl}
                            alt="Current Image"
                            className="img-fluid"
                            style={{
                              width: "100%",
                              height: "250px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              border: "2px solid #17a2b8",
                            }}
                          />
                        </div>
                      ) : (
                        <div
                          className="d-flex justify-content-center align-items-center text-muted"
                          style={{
                            width: "100%",
                            height: "250px",
                            backgroundColor: "#f8f9fa",
                            border: "2px dashed #ccc",
                            borderRadius: "8px",
                          }}
                        >
                          No image available
                        </div>
                      )}
                    </>
                  ) : (
                    previewUrl && (
                      <img
                        src={previewUrl}
                        alt="Submitted Vision"
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
                {/* CENTER: Description */}
                <div style={{ flex: 1 }}>
                  {isEditing ? (
                    <textarea
                      rows={4}
                      className="form-control"
                      value={editedVisionDescription}
                      onChange={(e) => setEditedVisionDescription(e.target.value)}
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
                {/* RIGHT: Actions */}
                <div className="d-flex flex-column align-items-end gap-2">
                  {isEditing ? (
                    <>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={(e) => {
                          e.preventDefault();
                          handleSaveVision();
                        }}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => {
                          setEditingVisionId(null);
                          setEditingVisionIndex(null);
                          setEditedVisionDescription("");
                          setEditedVisionImage(null);
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleEditVision(v.id, i)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      {/* <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteVision(v.id, i)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button> */}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
      {/* mission start */}
      <div className="card mb-4 shadow-sm border-0">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <div className="w-100 text-center">
            <h2 className="text-primary fw-bold mb-0">Missions</h2>
          </div>
          {/* <button className="btn btn-sm btn-outline-primary" onClick={() => handleAddMissionBlockToSet('main')}>
            <FontAwesomeIcon icon={faPlus} />
          </button> */}
        </div>

        <div className="card-body">
          {/* Default Mission Block with Edit/Save */}
          {submittedMissions.length === 0 && (
            <div className="mb-4 p-3 rounded shadow-sm bg-light d-flex align-items-start" style={{ gap: '20px' }}>
              <div style={{ width: '400px' }}>
                {editingMissionId === 'default' ? (
                  <>
                    <input
                      type="file"
                      className="form-control mb-2"
                      accept="image/*"
                      onChange={e => setEditedImage(e.target.files[0])}
                    />
                    {editedImage ? (
                      <img
                        src={URL.createObjectURL(editedImage)}
                        alt="New Image"
                        className="img-fluid mb-2"
                        style={{
                          width: '100%',
                          height: '250px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '2px solid #28a745',
                        }}
                      />
                    ) : (
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
                  </>
                ) : (
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
                {editingMissionId === 'default' ? (
                  <>
                    <textarea
                      rows={4}
                      className="form-control"
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                    />
                    <div className="d-flex gap-2 mt-2">
                      <button className="btn btn-sm btn-success" onClick={async () => {
                        // Save as new record
                        const formData = new FormData();
                        const missionData = { description: editedDescription };
                        if (editedImage) {
                          formData.append('missionImage', editedImage);
                        } else {
                          missionData.missionImageUrl = defaultMissionImage;
                        }
                        const visionData = { description: defaultDescription, visionImageUrl: defaultImage };
                        // Always send default core values with both title and image, using correct keys for backend
                        let coreData = [];
                        if (Array.isArray(defaultCoreValues) && defaultCoreValues.length > 0) {
                          coreData = defaultCoreValues.map(c => ({
                            title: c.title,
                            imageUrl: c.image // use imageUrl key for backend compatibility
                          }));
                        } else {
                          coreData = [];
                        }
                        formData.append('data', JSON.stringify({
                          vision: [visionData],
                          mission: [missionData],
                          core: coreData
                        }));
                        const token = localStorage.getItem('token');
                        await axios.post('http://localhost:5000/api/vmc/vision', formData, {
                          headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                          },
                        });
                        setEditingMissionId(null);
                        setEditedDescription('');
                        setEditedImage(null);
                        fetchData();
                        fetchMissions();
                        fetchCoreValues();
                      }}>
                        Save
                      </button>
                      <button className="btn btn-sm btn-secondary" onClick={() => {
                        setEditingMissionId(null);
                        setEditedDescription('');
                        setEditedImage(null);
                      }}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <p style={{ textAlign: 'justify', fontSize: '16px', lineHeight: '1.6' }}>{defaultMissionDescription}</p>
                    <button className="btn btn-sm btn-primary mt-2" onClick={() => {
                      setEditingMissionId('default');
                      setEditedDescription(defaultMissionDescription);
                    }}><FontAwesomeIcon icon={faEdit} /></button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Submitted Missions */}
          {submittedMissions.map((m) =>
            m.mission.map((item, i) => {
              const isEditing = editingMissionId === m.id && editingMissionIndex === i;
              let previewUrl = null;
              if (isEditing && editedImage) {
                previewUrl = URL.createObjectURL(editedImage);
              } else if (item.preview && item.preview.trim() !== "") {
                // If preview is https, use default
                if (item.preview.startsWith('https://')) {
                  previewUrl = defaultMissionImage;
                } else {
                  previewUrl = item.preview;
                }
              }
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
                        {editedImage ? (
                          <div>
                            <small className="text-success mb-1 d-block">🆕 New image selected</small>
                            <img
                              src={URL.createObjectURL(editedImage)}
                              alt="New Image"
                              className="img-fluid"
                              style={{
                                width: "100%",
                                height: "250px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                border: "2px solid #28a745",
                              }}
                            />
                          </div>
                        ) : previewUrl ? (
                          <div>
                            <small className="text-info mb-1 d-block">📸 Current image (will be preserved)</small>
                            <img
                              src={previewUrl}
                              alt="Current Image"
                              className="img-fluid"
                              style={{
                                width: "100%",
                                height: "250px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                border: "2px solid #17a2b8",
                              }}
                            />
                          </div>
                        ) : (
                          <div
                            className="d-flex justify-content-center align-items-center text-muted"
                            style={{
                              width: "100%",
                              height: "250px",
                              backgroundColor: "#f8f9fa",
                              border: "2px dashed #ccc",
                              borderRadius: "8px",
                            }}
                          >
                            No image available
                          </div>
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
                        {/* <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteMission(m.id, i)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button> */}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
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
          {/* <button className="btn btn-sm btn-outline-primary" onClick={() => handleAddCoreBlockToSet('main')}>
            <FontAwesomeIcon icon={faPlus} />
          </button> */}
        </div>

        {/* Default core Block */}
        <div className="card-body">
          {/* Default Core Values (no edit logic) */}
          {/* {submittedCoreValues.length === 0 && ( */}
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
          {/* )} */}

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
                                onClick={() => handleDeleteCore(block.id, i)}
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
                {/* <button className="btn btn-sm btn-success ms-2" title="Duplicate" onClick={() => handleDuplicateCoreBlock(index)}>
                  <FontAwesomeIcon icon={faPlus} />
                </button> */}
                <button className="btn btn-sm btn-danger ms-2" title="Remove" onClick={() => handleRemoveCoreBlock(index)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <div className="d-flex gap-2 mt-2">
                    <button className="btn btn-sm btn-success" onClick={async () => {
                      // Save only core value, do not overwrite vision/mission
                      const formData = new FormData();
                      let coreData;
                      if (core.file) {
                        const imageKey = `coreImage`;
                        formData.append(imageKey, core.file);
                        coreData = { title: core.title, imageUrl: imageKey };
                      } else {
                        coreData = { title: core.title };
                      }
                      formData.append('data', JSON.stringify({ core: [coreData] }));
                      const token = localStorage.getItem('token');
                      await axios.post('http://localhost:5000/api/vmc/vision', formData, {
                        headers: {
                          Authorization: `Bearer ${token}`,
                          'Content-Type': 'multipart/form-data',
                        },
                      });
                      setEditingCoreId(null);
                      setEditedCoreTitle('');
                      setEditedCoreImage(null);
                      setTempCoreForms([]); // Clear the temp core form
                      setShowTempSection(false); // Hide the form
                      fetchCoreValues();
                    }}>
                      Save
                    </button>
                  </div>
              </div>
            </div>
          ))}
          <button className="btn btn-sm btn-outline-primary" onClick={() => handleAddCoreBlockToSet('main')}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
          
        </div>
      </div>
    </div>
    </>
  );
};

export default VisionSection;