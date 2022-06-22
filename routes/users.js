const router = require("express").Router();
const User = require("../models/User");
const { verifyTokenAndAuthorization } = require("./token");

// UPDATE USER*****************************
router.put("/update/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json({ message: "User has been updted", updatedUser });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
