const router = require('express').Router()
const { getUsers, updateUser } = require('../controllers/users')

router.get('/users/me', getUsers)
router.patch('/users/me', updateUser)

module.exports = router