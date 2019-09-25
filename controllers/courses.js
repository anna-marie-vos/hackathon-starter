
const Course = require('../models/Course');
const User = require('../models/User');

exports.index = async (req, res) => {
  const courses = await Course.find({ author: req.user._id });
  const assignedCourses = await Course.find({ attendees: req.user._id });

  res.render('courses/index', {
    user: req.user,
    coachCourses: courses,
    learnCourses: assignedCourses
  });
};

exports.viewCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);

  res.render('courses/viewCourse', {
    course
  });
};

exports.create = async (req, res) => {
  const allUsers = await User.find({});

  const variables = {
    users: allUsers.map((u) => ({ email: u.email, assigned: false })),
    course: {
      title: '',
      description: '',
      learningOutcomes: '',
      attendees: []
    }
  };

  if (req.params.id) {
    const course = await Course.findById(req.params.id);
    const attendees = await Promise.all(course.attendees.map((id) => User.findById(id)));

    Object.assign(variables, {
      course,
      users: variables.users.map((u) => {
        const [assigned] = attendees.filter((a) => a.email === u.email);
        return { ...u, assigned: !!assigned, };
      })
    });
  }

  res.render('courses/create', {
    ...variables
  });
};

exports.createCourse = async (req, res) => {
  let attendees;

  if (typeof req.body.attendees === 'string') {
    attendees = await Promise.all([req.body.attendees].map((e) => User.findOne({ email: e })));
  } else if (!req.body.attendees) {
    attendees = [];
  } else {
    attendees = await Promise.all(req.body.attendees.map((e) => User.findOne({ email: e })));
  }

  const variables = {
    title: req.body.title,
    description: req.body.description,
    learningOutcomes: req.body.learningOutcomes,
    author: req.user,
    attendees
  };

  let course;

  if (req.body.id) {
    course = await Course.findById(req.body.id);
    Object.assign(course, { ...variables });
  }
  if (!req.body.id) {
    course = new Course({
      ...variables
    });
  }

  await course.save();

  res.redirect('/courses');
};
