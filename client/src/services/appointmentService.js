import axiosInstance from '../api/axiosInstance';

export const getAvailableSlots = () => axiosInstance.get('/slots');

export const bookAppointment = (data) => axiosInstance.post('/appointments/book', data);

export const cancelAppointment = (id) => axiosInstance.delete(`/appointments/${id}`);

export const getDoctorSlots = () => axiosInstance.get('/slots/my');

export const createSlot = (data) => axiosInstance.post('/slots', data);

export const getMyAppointments = () => axiosInstance.get('/appointments/my');
