import axiosInstance from '../api/axiosInstance';

export const getAvailableSlots = () => axiosInstance.get('/slots');

export const bookAppointment = (data) => axiosInstance.post('/appointments/book', data);

export const cancelAppointment = (id) => axiosInstance.delete(`/appointments/${id}`);

export const getDoctorSlots = () => axiosInstance.get('/slots/my');
