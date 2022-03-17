const router = require('express').Router();
const passport = require('passport')

// Student models
const Student = require("../../models/Student")

const StudentValidation = require('../../validation/student')

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { email, id } = req.body

  const { errors, isValid } = StudentValidation(req.body)

  if (!isValid) return res.status(400).json(errors)

  Student.findOne({
    $or: [
      { email },
      { id }
    ]
  }).then(currentUser => {
    if (currentUser) {
      res.status(400).json({ error: 'Student with this id or email already exists.' })
    } else {
      const newStudent = new Student(req.body)

      newStudent.save()
        .then(student => res.json(student))
        .catch(err => res.status(500).json({ error: 'Failed to save new student in the DB', err }))
    }
  })

})

// Get a list of students with a given batch
router.get('/batch/:batch', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { batch } = req.params;

  Student.find({ batch })
    .then(students => res.json(students))
    .catch(err => console.log({ error: 'Failed to fetch students', err }))
})

router.get('/all', (req, res) => {
  Student.find()
    .then(students => res.json(students))
    .catch(err => res.status(400).json({ ...err, message: 'Failed to fetch all students' }))
})

// Update student availability
router.put('/availability', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { id, isAvailable } = req.body

  Student.findOneAndUpdate({ id }, { $set: { isAvailable } })
    .then(data => res.status(200).json({ message: 'Student availability has been updated.', success: true }))
    .catch(err => res.json({ ...err, message: 'Failed to update student status.' }))
})

module.exports = router;
