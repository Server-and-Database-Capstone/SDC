const express = require('express');
const router = express.Router();
const { getMeta } = require('../model');

router.get('/:id', (req, res) => {
  getMeta(req.params.id)
  .then((result) => res.json(result.rows[0].meta))
  .catch(err => err)
})

module.exports = router;