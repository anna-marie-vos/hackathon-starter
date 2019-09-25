const mongoose = require('mongoose');

const { Schema } = mongoose;


const courseSchema = new Schema({
  title: { type: String, },
  description: { type: String },
  learningOutcomes: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
