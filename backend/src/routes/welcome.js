const router = require('express').Router();

router.get("/", async(req, res) => {
  return res.status(200).json({"Message" : "Welcome to backend API!"});
})

module.exports = router;