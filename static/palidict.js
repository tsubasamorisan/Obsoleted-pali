$(document).ready(function() {
  <!-- make keypad draggable -->
  $("#keyboard").draggable();

  <!-- bind the click function of input element inside keypad -->
  $("#keyboard input").bind("click", function(e) {
    document.getElementById("PaliInput").value += this.value;
    document.getElementById("PaliInput").focus();
  });
});


<!-- make keypad show if hidden, hide if shown -->
function toggle() {
  var kb = document.getElementById("keyboard");
  var dt = document.getElementById("displayText");
  if(kb.style.display == "inline") {
    kb.style.display = "none";
    dt.innerHTML = "Show Pāli Keypad";
  }
  else {
    kb.style.display = "inline";
    dt.innerHTML = "Hide Pāli Keypad";
  }
} 
