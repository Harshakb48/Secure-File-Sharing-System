const express = require("express");

const path = require("path");

const mongoose = require("mongoose");

const cors = require("cors");

const app = express();

const PORT = 3000;

// Middleware
app.use(cors());

app.use(express.json());

app.use(express.static("public"));

// MongoDB Connection
mongoose.connect(
    "mongodb://127.0.0.1:27017/fileuploadsystem"
)
.then(() => {

    console.log("MongoDB Connected");

})
.catch((err) => {

    console.log(err);

});

// User Schema
const userSchema = new mongoose.Schema({

    email: String,

    password: String

});

// File Schema
const fileSchema = new mongoose.Schema({

    filename: String,

    uploadDate: {

        type: Date,

        default: Date.now

    }

});

// Models
const User = mongoose.model(
    "User",
    userSchema
);

const File = mongoose.model(
    "File",
    fileSchema
);

// Home Route
app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "public", "index.html")
    );

});

// Register API
app.post("/register", async (req, res) => {

    const { email, password } =
    req.body;

    const existingUser =
    await User.findOne({ email });

    if(existingUser){

        return res.json({

            success:false,
            message:"Email already exists"

        });

    }

    const newUser = new User({

        email,
        password

    });

    await newUser.save();

    res.json({

        success:true

    });

});

// Login API
app.post("/login", async (req, res) => {

    const { email, password } =
    req.body;

    const user = await User.findOne({

        email,
        password

    });

    if(user){

        res.json({

            success:true

        });

    }
    else{

        res.json({

            success:false

        });

    }

});

// Save File API
app.post("/save-file", async (req, res) => {

    const { filename } =
    req.body;

    const newFile = new File({

        filename

    });

    await newFile.save();

    res.json({

        success:true

    });

});

// Get Files API
app.get("/files", async (req, res) => {

    const files =
    await File.find();

    res.json(files);

});

// Start Server
app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});