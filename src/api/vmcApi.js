import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/vmc';

// Get authorization token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

// VMC API functions
export const vmcApi = {
  // Get all VMC sets
  getAll: async () => {
    const response = await axios.get(API_BASE_URL, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  // Get single VMC record by ID
  getById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  // Create new VMC sets
  create: async (vmcSetsData, files = []) => {
    const formData = new FormData();
    
    // Add files to form data
    files.forEach((file, index) => {
      formData.append(file.fieldName, file.file);
    });
    
    // Add VMC sets data
    formData.append('data', JSON.stringify({ vmcSets: vmcSetsData }));
    
    const response = await axios.post(`${API_BASE_URL}/vision`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update specific item in a VMC set
  updateItem: async (id, setIndex, itemIndex, type, data, imageFile = null) => {
    const formData = new FormData();
    
    // Add text data based on type
    if (type === 'vision' && data.description) {
      formData.append('visionDescription', data.description);
    } else if (type === 'mission' && data.description) {
      formData.append('missionDescription', data.description);
    } else if (type === 'core' && data.title) {
      formData.append('coreTitle', data.title);
    }
    
    // Add indices and type
    formData.append('setIndex', setIndex);
    formData.append('itemIndex', itemIndex);
    formData.append('type', type);
    
    // Add image if provided
    if (imageFile) {
      const imageFieldName = `${type}Image`;
      formData.append(imageFieldName, imageFile);
    }
    
    const response = await axios.put(`${API_BASE_URL}/${id}`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
        'upload-section': type,
      },
    });
    return response.data;
  },

  // Delete specific item from a VMC set
  deleteItem: async (id, setIndex, itemIndex, type) => {
    const response = await axios.delete(`${API_BASE_URL}/${id}/item`, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      data: {
        setIndex,
        itemIndex,
        type,
      },
    });
    return response.data;
  },

  // Delete entire VMC set
  deleteSet: async (id, setIndex) => {
    const response = await axios.delete(`${API_BASE_URL}/${id}/set`, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      data: {
        setIndex,
      },
    });
    return response.data;
  },

  // Delete entire VMC record
  delete: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },
};

export default vmcApi;
