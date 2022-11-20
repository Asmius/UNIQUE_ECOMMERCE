// for the passwordchecker

let parameters = {
  count: false,
  letters: false,
  numbers: false,
  special: false
}

let strengthBar = document.getElementById("strength-bar");
let msg = document.getElementById("message");

function strengthchecker() {
  let password = document.getElementById("signup-password").value;

  parameters.letters = (/[A-Za-z]+/.test(password)) ? true : false;
  parameters.numbers = (/[0-9]+/.test(password)) ? true : false;
  parameters.special = (/[!\"$%&/()=?@~`\\.\';:+=^*_-]+/.test(password)) ? true : false;
  parameters.count = (password.length > 7) ? true : false;


  let barLength = Object.values(parameters).filter(value => value);
  console.log(Object.values(parameters), barLength);

  strengthBar.innerHTML = "";
  for (let i in barLength) {
    let span = document.createElement("span");
    span.classList.add("strength");
    strengthBar.appendChild(span);
  }

  let spanRef = document.getElementsByClassName("strength");
  console.log(spanRef);
  for (let i = 0; i < spanRef.length; i++)
   {
    switch (spanRef.length - 1)
    {
      case 0:
        spanRef[i].style.background = "#ff3e36";
        msg.textContent = "Your password is very weak";
        break;
      case 1:
        spanRef[i].style.background = "#ff691f";
        msg.textContent = "Your password is weak";
        break;
      case 2:
        spanRef[i].style.background = "#ffda36";
        msg.textContent = "Your password is good";
        break;
      case 3:
        spanRef[i].style.background = "#0be881";
        msg.textContent = "Your password is strong";
        break;

    }
  }
}




// for the password-toggle
const togglePassword = document.querySelector('#togglePassword');

const password = document.querySelector('#signup-password');

togglePassword.addEventListener('click', () => {

  // Toggle the type attribute using
  // getAttribure() method
  const type = password
    .getAttribute('type') === 'password' ?
    'text' : 'password';

  password.setAttribute('type', type);



});
// Toggle the eye and fa-eye icon
$(".toggle-password").click(function() {

  $(this).toggleClass("fa-eye fa-eye-slash");

});
