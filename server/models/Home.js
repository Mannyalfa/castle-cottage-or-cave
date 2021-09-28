const { Schema } = require('mongoose');

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedHomes` array in User.js
const homeSchema = new Schema({
  homeId: [
    {
      type: ID,
    },
  ],
  address: [
    {
    type: String,
    },
  ],
  city: [
    {
    type: String,
    },
  ],
  state: [
    {
    type: String,
    },
  ],
  photo: [
    {
    type: String,
    },
  ],
  bed: [
    {
    type: Int,
    },
  ],
  bed_max: [
    {
    type: Int,
    },
  ],
  bed_min: [
    {
    type: Int,
    },
  ],
  bath: [
    {
    type: Int,
    },
  ],
  bath_max: [
    {
    type: Int,
    },
  ],
  bath_min: [
    {
    type: Int,
    },
  ],
  rent: [
    {
    type: Int,
    },
  ],
  rent_max: [
    {
    type: Int,
    },
  ],
  rent_min: [
    {
    type: Int,
    },
  ],
  href: {
    type: String,
  },
});

module.exports = homeSchema;