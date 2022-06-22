const { Router } = require("express");

const {
  createTestimony,
  modifyTestimony,
  allTestimonies,
  deletedTestimony,
  detailTestimonies,
} = require("../controllers/testimonies");
const { validateJWT } = require("../middlewares/validate-JWT");
const { adminValidate } = require("../middlewares/adminValidate");
const { upload } = require("../middlewares/multer");

const router = Router();

router.post("/testimonials", validateJWT, adminValidate, createTestimony);

router.put("/testimonials/:id", validateJWT, adminValidate, modifyTestimony);

router.get("/", allTestimonies);

router.delete("/:id", validateJWT, adminValidate, deletedTestimony);

router.get("/:id", detailTestimonies);

module.exports = router;
