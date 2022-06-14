const express = require('express');
const router = express.Router();
const db = require('../model');

router.get('/',(req, res) => {
  let { pid, sort, count, page } = req.query;
  db.getReviewsById(pid, sort, count, page)
  .then((result) => res.json(result.rows))
  .catch(err => res.json(err));
})
router.post('/', (req, res) => {
  const data = req.body;
  db.addReview(data)
  res.sendStatus(201)
});
router.put('/:review_id/:action', (req, res) => {
  res.json('put my shoe in your butt')
})

// PUT /reviews/:review_id/helpful or report
// router.put('/')

module.exports = router;