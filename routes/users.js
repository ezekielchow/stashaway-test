const express = require('express');

const userController = require('../controllers/user-controller');

const router = express.Router();

router.get('/', userController.list);
router.post('/', userController.validate('create'), userController.create);

module.exports = router;
