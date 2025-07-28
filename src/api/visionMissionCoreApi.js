import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/vmc'; 

export const getAllVMC = () => axios.get(`${BASE_URL}`);
export const addVision = (data) => axios.post(`${BASE_URL}/vision`, data);
export const addMission = (data) => axios.post(`${BASE_URL}/mission`, data);
export const addCore = (data) => axios.post(`${BASE_URL}/core`, data);
export const updateVMC = (id, data) => axios.put(`${BASE_URL}/${id}`, data);
export const deleteVMC = (id) => axios.delete(`${BASE_URL}/${id}`);
