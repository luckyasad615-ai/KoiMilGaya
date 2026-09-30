const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { sampleProfiles } = require('../seed/sampleData.js');

class InMemoryDatabase {
  constructor() {
    this.users = [];
    this.bookings = [];
    this.payments = [];
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    this.users = [];
    const preHashedPassword = '$2a$10$wE0v1K9J4F3g2H1j0K9L8M7N6P5Q4R3S2T1U0V1W2X3Y4Z5A6b7C8';
    for (let index = 0; index < sampleProfiles.length; index++) {
      const p = sampleProfiles[index];
      this.users.push({
        _id: p._id || `65a00000000000000000000${index + 1}`,
        ...p,
        password: preHashedPassword,
        createdAt: new Date(),
      });
    }
    this.initialized = true;
    console.log(`In-Memory Fallback DB Initialized with ${this.users.length} sample profiles!`);
  }


  // Users methods
  async findUsers({ search, city, gender, minAge, maxAge, excludeId }) {
    await this.init();
    return this.users.filter((u) => {
      if (excludeId && u._id.toString() === excludeId.toString()) return false;
      if (search) {
        const s = search.toLowerCase();
        const matchesName = u.fullName.toLowerCase().includes(s);
        const matchesBio = u.bio.toLowerCase().includes(s);
        const matchesCity = u.city.toLowerCase().includes(s);
        const matchesCountry = u.country ? u.country.toLowerCase().includes(s) : false;
        const matchesInterest = u.interests.some((i) => i.toLowerCase().includes(s));
        if (!matchesName && !matchesBio && !matchesCity && !matchesCountry && !matchesInterest) return false;
      }
      if (city && city !== 'All' && !u.city.toLowerCase().includes(city.toLowerCase())) return false;
      if (gender && gender !== 'All' && u.gender !== gender) return false;
      if (minAge && u.age < Number(minAge)) return false;
      if (maxAge && u.age > Number(maxAge)) return false;
      return true;
    });
  }

  async findUserById(id) {
    await this.init();
    return this.users.find((u) => u._id.toString() === id.toString()) || null;
  }

  async findUserByEmail(email) {
    await this.init();
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async createUser(userData) {
    await this.init();
    const newUser = {
      _id: new mongoose.Types.ObjectId().toString(),
      ...userData,
      createdAt: new Date(),
    };
    this.users.unshift(newUser);
    return newUser;
  }

  async updateUser(id, updateData) {
    await this.init();
    const userIndex = this.users.findIndex((u) => u._id.toString() === id.toString());
    if (userIndex === -1) return null;
    this.users[userIndex] = { ...this.users[userIndex], ...updateData };
    return this.users[userIndex];
  }

  // Bookings methods
  async createBooking(bookingData) {
    await this.init();
    const targetProfile = await this.findUserById(bookingData.profileId);
    const newBooking = {
      _id: new mongoose.Types.ObjectId().toString(),
      ...bookingData,
      amount: 499,
      paymentStatus: 'pending',
      bookingStatus: 'Pending',
      createdAt: new Date(),
      profileId: targetProfile ? {
        _id: targetProfile._id,
        fullName: targetProfile.fullName,
        age: targetProfile.age,
        city: targetProfile.city,
        profileImage: targetProfile.profileImage,
        email: targetProfile.email,
        gender: targetProfile.gender,
      } : bookingData.profileId,
    };
    this.bookings.unshift(newBooking);
    return newBooking;
  }

  async findBookingsByUserId(userId) {
    await this.init();
    return this.bookings.filter((b) => b.bookedBy.toString() === userId.toString());
  }

  async findBookingById(id) {
    await this.init();
    return this.bookings.find((b) => b._id.toString() === id.toString()) || null;
  }

  async updateBooking(id, updateData) {
    await this.init();
    const index = this.bookings.findIndex((b) => b._id.toString() === id.toString());
    if (index === -1) return null;
    this.bookings[index] = { ...this.bookings[index], ...updateData };
    return this.bookings[index];
  }

  // Payments methods
  async createPayment(paymentData) {
    await this.init();
    const newPayment = {
      _id: new mongoose.Types.ObjectId().toString(),
      ...paymentData,
      createdAt: new Date(),
    };
    this.payments.unshift(newPayment);
    return newPayment;
  }
}

const memDb = new InMemoryDatabase();
module.exports = { memDb };


