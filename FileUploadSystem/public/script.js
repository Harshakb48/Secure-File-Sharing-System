const registerPage =
document.getElementById("registerPage");

const loginPage =
document.getElementById("loginPage");

const uploadPage =
document.getElementById("uploadPage");

const fileInput =
document.getElementById("fileInput");

const preview =
document.getElementById("preview");

const uploadForm =
document.getElementById("uploadForm");

const loader =
document.getElementById("loader");

const successPage =
document.getElementById("successPage");

const fileName =
document.getElementById("fileName");

// Uploaded Files
let uploadedFiles = [];

// Show Login Page
function showLoginPage(){

    registerPage.style.display = "none";

    loginPage.style.display = "block";

}

// Show Register Page
function showRegisterPage(){

    loginPage.style.display = "none";

    registerPage.style.display = "block";

}

// Register User
async function registerUser(){

    const email =
    document.getElementById("registerEmail").value;

    const password =
    document.getElementById("registerPassword").value;

    // Email Validation
    const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailPattern.test(email)){

        alert(
            "Enter Valid Email Address"
        );

        return;

    }

    // Password Validation
    if(password.length < 6){

        alert(
            "Password must contain minimum 6 characters"
        );

        return;

    }

    const response = await fetch("/register", {

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body: JSON.stringify({

            email,
            password

        })

    });

    const data =
    await response.json();

    if(data.success){

        alert(
            "✅ Account Created Successfully"
        );

        registerPage.style.display = "none";

        loginPage.style.display = "block";

    }
    else{

        alert(data.message);

    }

}

// Login User
async function loginUser(){

    const email =
    document.getElementById("email").value;

    const password =
    document.getElementById("password").value;

    const response = await fetch("/login", {

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body: JSON.stringify({

            email,
            password

        })

    });

    const data =
    await response.json();

    if(data.success){

        loginPage.style.display = "none";

        uploadPage.style.display = "block";

    }
    else{

        alert(
            "❌ Invalid Email or Password"
        );

    }

}

// Logout
function logoutUser(){

    uploadPage.style.display = "none";

    loginPage.style.display = "block";

}

// Show/Hide Register Password
function toggleRegisterPassword(){

    const passwordInput =
    document.getElementById("registerPassword");

    if(passwordInput.type === "password"){

        passwordInput.type = "text";

    }
    else{

        passwordInput.type = "password";

    }

}

// Show/Hide Login Password
function toggleLoginPassword(){

    const passwordInput =
    document.getElementById("password");

    if(passwordInput.type === "password"){

        passwordInput.type = "text";

    }
    else{

        passwordInput.type = "password";

    }

}

// Image Preview
fileInput.addEventListener("change", function(){

    const file = this.files[0];

    if(file){

        const reader = new FileReader();

        reader.onload = function(e){

            preview.src = e.target.result;

            preview.style.display = "block";

        };

        reader.readAsDataURL(file);

    }

});

// Upload File
uploadForm.addEventListener("submit", async function(e){

    e.preventDefault();

    const file = fileInput.files[0];

    if(!file){

        alert("Please select a file");

        return;

    }

    loader.style.display = "flex";

    setTimeout(async () => {

        loader.style.display = "none";

        successPage.style.display = "flex";

        uploadedFiles.push(file);

        await fetch("/save-file", {

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body: JSON.stringify({

                filename:file.name

            })

        });

        let filesHTML = "";

        uploadedFiles.forEach((uploadedFile) => {

            filesHTML += `

            <div class="uploaded-file">

                📁 ${uploadedFile.name}

                <br><br>

                <a
                href="${URL.createObjectURL(uploadedFile)}"
                download="${uploadedFile.name}"
                class="download-link"
                >
                ⬇ Download
                </a>

            </div>

            <br>

            `;

        });

        fileName.innerHTML = filesHTML;

    }, 2500);

});

// Back To Upload Page
function backToUpload(){

    successPage.style.display = "none";

    uploadPage.style.display = "block";

}