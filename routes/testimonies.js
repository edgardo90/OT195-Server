const {Router} = require("express");

const {createTestimony, modifyTestimony} = require("../controllers/tetimonies");
const { validateJWT } = require('../middlewares/validate-JWT');
const { adminValidate } = require('../middlewares/adminValidate');
const { upload } = require("../middlewares/multer");

const router = Router();

router.post("/testimonials", upload.single("image") , validateJWT , adminValidate  ,createTestimony );

router.put("/testimonials/:id" , upload.single("image"), validateJWT, adminValidate, modifyTestimony);


module.exports = router;


