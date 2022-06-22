const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { generateToken } = require("./token");

// REGISTER USER ********************

router.post("/register", async (req, res) => {
  // Collect users details
  //generate new password and hash it
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const newUser = new User({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    birthday: req.body.birthday,
    phone: req.body.phone,
    email: req.body.email,
    profileImage: req.body.profileImage,
    coverImage: req.body.coverImage,
    // Hash/encrypt the password using CryptoJS and cypher algorithm
    password: hashedPassword,
  });

  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(500).json({
      error: `User with email: (${req.body.email}) already exists, try again`,
    });
  } else {
    try {
      //  Save user in the database and send response
      const user = await newUser.save();

      // If the request is succcessful, return succes message and user details
      // This is done for development as it helps the frontend guy easily recognise the key
      return res
        .status(201)
        .json({ message: "User has been created successfully", user });
    } catch (err) {
      //  This is a general status code when there is an internal server error and does
      // not specify what happed exactly in the server
      return res.status(500).json(err);

      /* ************  Handle other server errors below this line   ************ */
      // Here...
    }
  }
});

// LOGIN USER *********************
router.post("/login", async (req, res) => {
  try {
    // Find user by email
    const user = await User.findOne({ email: req.body.email });

    // Check whether the user exists in the database
    if (!user) {
      return res
        .status(404)
        .json(
          "User with the provided email doesnot exist, please create an account!"
        );
    }

    // Compare passwords and if password is incorrect, tell the user to try again
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword &&
      res.status(400).json("Incorrect pasword, please try again!");

    // Token payload
    const tokenPayload = {
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    // hide password from the database
    const { password, ...others } = user._doc;

    // If the request is succcessful, return succes message and user details
    // This is done for development as it helps the frontend guy easily recognise the key
    return res.status(200).json({
      message: "User login successful",
      ...others,
      token: generateToken(tokenPayload),
    });
  } catch (err) {
    //  This is a general status code when there is an internal server error and does
    // not specify what happed exactly in the server
    return res.status(500).json(err);

    /* ************  Handle other server errors below this line   ************ */
    // Here...
  }
});

module.exports = router;
