const { addMessage, getMessages } = require("../controllers/messageController");

const router = require("express").Router();

router.post("/addMessage", addMessage);
router.post("/getMessage", getMessages);

module.exports = router;
