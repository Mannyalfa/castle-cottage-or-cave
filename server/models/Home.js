const { Schema } = require("mongoose");

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedHomes` array in User.js
const homeSchema = new Schema({
  homeId: {
    type: String,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  photo: {
    type: String,
  },
  bed: {
    type: Number,
  },
  bed_max: {
    type: Number,
  },
  bed_min: {
    type: Number,
  },
  bath: {
    type: Number,
  },
  bath_max: {
    type: Number,
  },
  bath_min: {
    type: Number,
  },
  rent: {
    type: Number,
  },
  rent_max: {
    type: Number,
  },
  rent_min: {
    type: Number,
  },
  pet_policy: {
    type: String,
  },
  href: {
    type: String,
  },
});

module.exports = homeSchema;
