document.addEventListener('DOMContentLoaded', function () {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const submitButton = document.getElementById('updateButton');
    const passwordError = document.getElementById('passwordError');

    // Regex to check for password length between 8 and 12 characters
    const passwordRegex = /^.{8,12}$/;

    function validatePasswords() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const isPasswordValid = passwordRegex.test(password);

        // Enable the submit button if both passwords match, are non-empty, and password length is valid
        if (password !== '' && confirmPassword !== '' && password === confirmPassword && isPasswordValid) {
            submitButton.disabled = false;
            passwordError.style.display = 'none';
        } else {
            submitButton.disabled = true;
            if (!isPasswordValid) {
                passwordError.style.display = 'block';
            } else {
                passwordError.style.display = 'none';
            }
        }
    }

    passwordInput.addEventListener('input', validatePasswords);
    confirmPasswordInput.addEventListener('input', validatePasswords);
});