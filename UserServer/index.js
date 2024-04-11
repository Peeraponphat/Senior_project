const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserModel = require('./models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const app = express();
const moment = require('moment');
app.use(express.json());
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

app.use(cors({
  origin: ["http://" + process.env.IP + ":80", "http://" + process.env.IP + ":4173", "http://" + process.env.IP + ":5173"],
  methods: ["GET", "POST", "PUT"],
  credentials: true
}));

app.use(cookieParser());
mongoose.connect("mongodb://localhost:27017/resource", { useNewUrlParser: true, useUnifiedTopology: true });


const verifyUser = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({ message: "Unauthorized: Token not provided" });
  }

  const [bearer, token] = authorizationHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return res.status(401).json({ message: "Unauthorized: Invalid token format" });
  }

  // Verify the JWT token
  jwt.verify(token, 'jwt-secret-key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    // Attach decoded token to the request object for further use if needed
    req.decodedToken = decoded;

    // If the token is valid, proceed to the next middleware
    next();
  });
};



app.get('/find/plan/:clientId', async (req, res) => {
  try {
    const clientId = req.params.clientId;
    const collectionName = clientId; // Use the clientId as the collection name
    // Access the collection directly using the collection name
    const collection = mongoose.connection.db.collection(collectionName);

    // Find all documents in the collection
    const plans = await collection.find({}).toArray();

    if (!plans || plans.length === 0) {
      return res.status(200).json({ message: "No plans found" });
    }

    res.status(200).json(plans);
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server Error");
  }
});

const { ObjectId } = require('mongodb'); // Import the ObjectId class

app.get('/delete/plan/:clientId/:planId', async (req, res) => {
  try {
    const clientId = req.params.clientId;
    const planId = req.params.planId;
    console.log(clientId);
    console.log(planId);
    const collectionName = clientId; // Use the clientId as the collection name

    // Access the collection directly using the collection name
    const collection = mongoose.connection.db.collection(collectionName);

    // Create an ObjectId instance from the planId
    const objectIdPlanId = new ObjectId(planId);

    // Delete the document with the specified planId
    const deleteResult = await collection.deleteOne({ _id: objectIdPlanId });

    // Check if any document was deleted
    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ message: "Plan not found to delete" });
    }

    res.status(200).json({ message: "Plan deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server Error");
  }
});

const compiledModels = {};

app.post('/save/plan', async (req, res) => {
  try {
    const { planData, clientId } = req.body;

    // Define the schema
    const planingSchema = new mongoose.Schema({
      Plan: { type: mongoose.Schema.Types.Mixed }
    });

    let PlaningModel;

    // Check if the model has already been compiled
    if (compiledModels[clientId]) {
      // If the model has already been compiled, reuse it
      PlaningModel = compiledModels[clientId];
    } else {
      // If the model has not been compiled, define it
      PlaningModel = mongoose.model(clientId, planingSchema);
      // Store the compiled model for future reuse
      compiledModels[clientId] = PlaningModel;
    }

    // Create a new instance of the PlaningModel
    const newPlan = new PlaningModel({ Plan: planData });

    // Save the new plan to the database
    await newPlan.save();

    // Send a success response
    res.status(200).json({ message: "Plan saved successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to handle user logout
app.post('/logout', (req, res) => {
  try {
    res.clearCookie('token');

    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// Route to update user profile
app.post('/updateUser', verifyUser, async (req, res) => {
  const { userId, formData } = req.body;

  // Find the user by ID and update the profile
  UserModel.findByIdAndUpdate(userId, formData, { new: true })
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json(user);
    })
    .catch(err => {
      console.error("Error updating user:", err);
      res.status(500).json({ message: "Internal Server Error", error: err });
    });
});

// Route to get user data
app.get('/getUsers', verifyUser, async (req, res) => {
  const decodedToken = req.decodedToken;

  UserModel.findOne({ email: decodedToken.email })
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    });
});



//api login Autentication
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.json("No record existed");
    }
    bcrypt.compare(password, user.password, (err, response) => {
      if (response) {
        const token = jwt.sign({ email: user.email }, "jwt-secret-key", { expiresIn: '24h' });
        // Store the Token in the Cookie named "token"
        res.cookie("token", token);
        return res.json({ Status: "Success", token: token });
      } else {
        return res.json("The password is incorrect");
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server Error");
  }
});



app.post('/register', async (req, res) => {
  try {
    console.log(req.body);
    const randomKey = uuidv4();
    const currentTimePlus30Minutes = moment().add(5, 'minutes').toDate();
    const { name, username, email, password, repeatpassword } = req.body;

    // Generate verification token
    const verificationToken = jwt.sign({ email }, 'verification-secret-key', { expiresIn: '1h' });

    // Hash the password
    const hash = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const user = await UserModel.create({ name, username, email: randomKey, password: hash, repeatpassword, verificationToken, expiry: currentTimePlus30Minutes });

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    // Send response
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user", error: error });
  }
});


function sendVerificationEmail(email, token) {
  // Create nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'kkmoshi01@gmail.com',
      pass: 'baqa gjtd xzvn gcuu'
    }
  });

  // Construct email options
  const mailOptions = {
    from: 'kkmoshi01@gmail.com',
    to: email,
    subject: 'Verify your email address',
    html: `
      <p>Hello,</p>
      <p>Please click the following link to verify your email address:</p>
      <p><a href="http://${process.env.IP}:4173/verify/${token}">Verify Email</a></p>
      <p>If you did not request this, please ignore this email.</p>
    `
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending verification email:', error);
    } else {
      console.log('Verification email sent:', info.response);
    }
  });
}

app.get('/verify/:token', async (req, res) => {
  const token = req.params.token;

  // Verify the token
  jwt.verify(token, 'verification-secret-key', (err, decoded) => {
    if (err) {
      // If the token is invalid or expired, handle the error
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Extract email address from decoded token
    const email = decoded.email;

    // Find the user by verification token in the database
    UserModel.findOneAndUpdate({ verificationToken: token }, { email: email, verified: true, verificationToken: null, expiry: null }, { new: true })

      .then(user => {
        res.status(200).json({ message: 'sucess' });
      })
      .catch(err => {
        console.error('Error verifying email:', err);
        res.status(500).json({ message: 'Internal Server Error' });
      });
  });
});



app.post('/forgotpassword', async (req, res) => {
  const { email } = req.body;
  UserModel.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.send({ Status: "User not existed" });
      } else {
        const token = jwt.sign({ _id: user.id }, "jwt_secret_key", { expiresIn: "1h" });
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'kkmoshi01@gmail.com',
            pass: 'baqa gjtd xzvn gcuu'
          }
        });

        var mailOptions = {
          from: 'kkmoshi01@gmail.com',
          to: email,
          subject: 'Reset Password Link',
          text: `http://${process.env.IP}:4173/ResetPassword/${user.id}/${token}`
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            return res.send({ Status: "Success" });
          }
        });
      }
    });
});


app.post('/resetpassword/:id/:token', async (req, res) => {
  const { id, token } = req.params
  const { password } = req.body
  jwt.verify(token, "jwt_secret_key", (err, decoded) => {
    if (err) {
      return res.json({ Status: "Error with token" })
    } else {
      bcrypt.hash(password, 10)
        .then(hash => {
          UserModel.findByIdAndUpdate({ _id: id }, { password: hash })
            .then(u => res.send({ Status: "Success" }))
            .catch(err => res.send({ Status: err }))
        })
        .catch(err => res.send({ Status: err }))
    }
  })
})


const deleteUnverifiedUsers = async () => {
  try {
    // Get the current time formatted
    const currentTime = moment().toDate();
    const deletionCriteria = { expiry: { $lt: currentTime } };

    // Delete unverified users
    const result = await UserModel.deleteMany(deletionCriteria);

    console.log(`Deleted ${result.deletedCount} unverified users.`);
  } catch (error) {
    console.error("Error deleting unverified users:", error);
  }
};

// Run deleteUnverifiedUsers every 5 minutes (300,000 milliseconds)
setInterval(deleteUnverifiedUsers, 2 * 60 * 1000);

app.listen(3001, () => {
  console.log("server is running 3001")
})
