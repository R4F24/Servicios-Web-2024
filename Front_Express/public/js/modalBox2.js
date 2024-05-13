// Get the modal1
var modal1 = document.getElementById("modal-pw-timer");

// Get the button that opens the modal1
var btn = document.getElementById("btn-edit-modal");

// Get the <span> element that closes the modal1
var span1 = document.getElementById("close-pw-timer");

// When the user clicks the button, open the modal1 
btn.onclick = function() {
  modal1.style.display = "block";
}

// When the user clicks on <span> (x), close the modal1
span1.onclick = function() {
  modal1.style.display = "none";
}

// When the user clicks anywhere outside of the modal1, close it
window.onclick = function(event) {
  if (event.target == modal1) {
    modal1.style.display = "none";
  }
}
