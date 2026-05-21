const prisma = require('../config/prismaClient');

const getAvailableAppointments = async (req, res) => {
  try {
    const slots = await prisma.appointmentSlot.findMany({
      where: {
        isBooked: false,
        date: { gt: new Date() },
      },
      include: {
        doctor: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { date: 'asc' },
    });
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const bookAppointment = async (req, res) => {
  const { slotId, reason } = req.body;

  if (!slotId) {
    return res.status(400).json({ message: 'Slot ID is required' });
  }

  try {
    const slot = await prisma.appointmentSlot.findUnique({
      where: { id: parseInt(slotId) },
    });

    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }
    if (slot.isBooked) {
      return res.status(409).json({ message: 'Slot is already booked' });
    }
    if (slot.date <= new Date()) {
      return res.status(400).json({ message: 'Cannot book a past slot' });
    }

    const patient = await prisma.user.findUnique({ where: { id: req.user.id } });

    const appointment = await prisma.appointment.create({
      data: {
        slotId: parseInt(slotId),
        patientId: req.user.id,
        patientName: `${patient.firstName} ${patient.lastName}`,
        patientEmail: patient.email,
        reason: reason || null,
      },
    });

    await prisma.appointmentSlot.update({
      where: { id: parseInt(slotId) },
      data: { isBooked: true },
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const cancelAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(id) },
      include: { slot: true },
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const isPatient = appointment.patientId === req.user.id;
    const isDoctor = appointment.slot.doctorId === req.user.id;

    if (!isPatient && !isDoctor) {
      return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
    }

    await prisma.appointment.delete({ where: { id: parseInt(id) } });

    await prisma.appointmentSlot.update({
      where: { id: appointment.slotId },
      data: { isBooked: false },
    });

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { patientId: req.user.id },
      include: {
        slot: {
          include: {
            doctor: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAvailableAppointments, bookAppointment, cancelAppointment, getMyAppointments };
