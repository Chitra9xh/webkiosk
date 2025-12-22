/* --- SLIDESHOW LOGIC --- */
let step = 1;
function slideit() {
    const imgElement = document.getElementById("slideShowImg");
    // Ensure images are named images1.jpg, images2.jpg... inside assets/images/
    if (imgElement) {
        imgElement.src = `assets/images/images${step}.jpg`;
    }
    
    if (step < 11) { 
        step++;
    } else {
        step = 1;
    }
    setTimeout(slideit, 2500);
}

// Start slideshow on load
window.onload = function() {
    slideit();
    generateCaptcha(); // Start Captcha
};


/* --- CAPTCHA LOGIC --- */
let currentCaptcha = "";

function generateCaptcha() {
    // A mix of chars to look like the original
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const length = 5;
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    currentCaptcha = result;
    
    const captchaElement = document.getElementById("captchaText");
    if (captchaElement) {
        captchaElement.innerText = result;
    }
}


/* --- LOGIN LOGIC --- */
function validateLogin() {
    const userType = document.getElementById("UserType").value;
    const enrollInput = document.getElementById("MemberCode").value.trim(); // Remove extra spaces
    const passwordInput = document.getElementById("Password").value;
    const userCaptcha = document.getElementById("txtcap").value;
    const dobInput = document.getElementById("DATE1").value.trim();

    // 1. Basic Empty Check
    if(enrollInput === "") { alert("Enrollment No cannot be blank"); return; }
    if(passwordInput === "") { alert("Password cannot be blank"); return; }
    
    // 2. Validate Captcha
    if(userCaptcha !== currentCaptcha) {
        alert("Invalid Captcha! Please try again.");
        document.getElementById("txtcap").value = "";
        generateCaptcha(); // Regenerate
        return;
    }

    // 3. SAMPLE CREDENTIAL CHECK
    // Enrollment: 241B629 or 241b29 (Case insensitive)
    const validEnrollments = ["241B629", "241B29"];
    
    // DOB: 19-2-2006 or 19-02-2006
    const validDOBs = ["19-2-2006", "19-02-2006"];
    
    // Password: Chair=Me66
    const validPass = "Chair=Me66";

    // Normalize input for comparison (uppercase for enrollment)
    const upperEnroll = enrollInput.toUpperCase();

    // Check Logic
    const isEnrollValid = validEnrollments.includes(upperEnroll);
    const isPassValid = (passwordInput === validPass);
    let isDobValid = true; 

    // Only check DOB if UserType is Student (S) or Parent (P), as per original logic
    if (userType === 'S' || userType === 'P') {
        isDobValid = validDOBs.includes(dobInput);
    }

    if (isEnrollValid && isPassValid && isDobValid) {
        // SUCCESS: Redirect to the backlog page
        window.location.href = "pages/backlog.html";
    } else {
        // FAILURE: Show error
        alert("Invalid Login Credentials");
    }
}

/* --- UI HELPERS --- */
function toggleDateInput() {
    const userType = document.getElementById("UserType").value;
    const dobRow = document.getElementById("dobRow");
    const dobFormatRow = document.getElementById("dobFormatRow");
    
    if (userType === 'S' || userType === 'P') {
        if(dobRow) dobRow.style.display = "table-row";
        if(dobFormatRow) dobFormatRow.style.display = "table-row";
    } else {
        if(dobRow) dobRow.style.display = "none";
        if(dobFormatRow) dobFormatRow.style.display = "none";
    }
}