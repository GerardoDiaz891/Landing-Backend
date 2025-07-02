const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contact.controller");
const { verifyToken, requireAdmin } = require("../middlewares/auth.middleware");

//POST
router.post("/", contactController.createContact);

//GET
router.get("/", verifyToken, requireAdmin, contactController.getContacts);

//PUT
router.put("/:id", verifyToken, requireAdmin, contactController.updateContact);

//DELETE
router.delete(
  "/:id",
  verifyToken,
  requireAdmin,
  contactController.deleteContact
);

module.exports = router;
