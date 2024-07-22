//login page

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('loginForm')
  const userInput = document.getElementById('username')
  const passwordInput = document.getElementById('userPassword')
  const loginButton = document.getElementById('loginButton')

  function validateUsername(username) {
    const re = /^\S{6,12}$/; // \S matches any non-whitespace character, {1,12} ensures length is between 1 and 12
    return re.test(username);
  }
  

  function validatePassword(password) {
    const re = /^.{8,12}$/; // Ensures the password is between 8 and 12 characters long
    return re.test(password);
  }
  

  userInput && userInput.addEventListener('input', function() {
    if(validateUsername(userInput.value.trim())){
      userInput.classList.remove('is-invalid')
      userInput.classList.add('is-valid')
    } else {
      userInput.classList.remove('is-valid');
      userInput.classList.add('is-invalid');
    }
  })

  passwordInput && passwordInput.addEventListener('input', function () {
    if(validatePassword(passwordInput.value.trim())) {
      passwordInput.classList.remove('is-invalid')
      passwordInput.classList.add('is-valid')
    }
    else {
      passwordInput.classList.remove('is-valid')
      passwordInput.classList.add('is-invalid')
      }
  })

  form && form.addEventListener('submit', function(event) {
    userInput.classList.remove('is-invalid')
    passwordInput.classList.remove('is-invalid')

    let valid = true;

    if(!userInput.value.trim()){
      userInput.classList.add('is-invalid')
      valid = false;
    }

    if(!passwordInput.value.trim()){
      passwordInput.classList.add('is-invalid')
      valid = false;
    }

    if(!valid){
      event.preventDefault();
      Toastify({
        text: "Both Email and Password are required",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor : "red"
      }).showToast();
    }
  })
})
