import axiosInstance from '../api/axiosInstance';

export const getAvailableSlots = () => axiosInstance.get('/slots/available');

export const bookAppointment = (data) => axiosInstance.post('/appointments/book', data);

export const getMyAppointments = () => axiosInstance.get('/appointments/my');

export const getDoctorSlots = () => axiosInstance.get('/slots');

export const getDoctorAppointments = () => axiosInstance.get('/appointments/doctor');

export const cancelAppointment = (id) => axiosInstance.delete(`/appointments/${id}`);
