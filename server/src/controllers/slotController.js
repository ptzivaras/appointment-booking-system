const prisma = require('../config/prismaClient');

const createSlot = async (req, res) => {
  const { date } = req.body;

  if (!date) {
    return res.status(400).json({ message: 'Date is required' });
  }

  const slotDate = new Date(date);
  if (isNaN(slotDate.getTime())) {
    return res.status(400).json({ message: 'Invalid date format' });
  }
  if (slotDate <= new Date()) {
    return res.status(400).json({ message: 'Slot date must be in the future' });
  }

  try {
    const slot = await prisma.appointmentSlot.create({
      data: {
        date: slotDate,
        doctorId: req.user.id,
      },
    });
    res.status(201).json(slot);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAvailableSlots = async (req, res) => {
  try {
    const slots = await prisma.appointmentSlot.findMany({
      where: {
        isBooked: false,
        date: { gt: new Date() },
      },
      include: {
        doctor: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
      orderBy: { date: 'asc' },
    });
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMySlots = async (req, res) => {
  try {
    const slots = await prisma.appointmentSlot.findMany({
      where: { doctorId: req.user.id },
      include: { appointment: true },
      orderBy: { date: 'asc' },
    });
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteSlot = async (req, res) => {
  const { id } = req.params;

  try {
    const slot = await prisma.appointmentSlot.findUnique({
      where: { id: parseInt(id) },
    });

    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }
    if (slot.doctorId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this slot' });
    }
    if (slot.isBooked) {
      return res.status(400).json({ message: 'Cannot delete a booked slot' });
    }

    await prisma.appointmentSlot.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Slot deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createSlot, getAvailableSlots, getMySlots, deleteSlot };
