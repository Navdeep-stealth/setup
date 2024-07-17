//login page

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('loginForm')
  const emailInput = document.getElementById('userEmail')
  const passwordInput = document.getElementById('userPassword')
  const loginButton = document.getElementById('loginButton')

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  function validatePassword(password) {
    return password.length >=1
  }

  emailInput && emailInput.addEventListener('input', function() {
    if(validateEmail(emailInput.value.trim())){
      emailInput.classList.remove('is-invalid')
      emailInput.classList.add('is-valid')
    } else {
      emailInput.classList.remove('is-valid');
      emailInput.classList.add('is-invalid');
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
    emailInput.classList.remove('is-invalid')
    passwordInput.classList.remove('is-invalid')

    let valid = true;

    if(!emailInput.value.trim()){
      emailInput.classList.add('is-invalid')
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
