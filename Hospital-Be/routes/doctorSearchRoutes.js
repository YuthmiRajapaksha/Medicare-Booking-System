

const express = require("express");
const router = express.Router();
const { searchDoctors } = require("../controllers/doctorSearchController");

router.get("/search", searchDoctors);


module.exports = router;
