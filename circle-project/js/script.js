function calcDiameter(radius) {
  return 2 * radius;
}

function calcCircumference(radius) {
  return 2 * Math.PI * radius;
}

function calcArea(radius) {
  return Math.PI * radius * radius;
}

function clearForm() {
  document.getElementById("radius").value = "";
  document.getElementById("diameter").textContent = "";
  document.getElementById("circumference").textContent = "";
  document.getElementById("area").textContent = "";

  // Clear validation messages (if validate() is running)
  if (window.jQuery && $("#CircleForm").data("validator")) {
    $("#CircleForm").validate().resetForm();
  }
}

document.getElementById("btnSubmitCalculate").onclick = function () {
  // Only calculate if the form is valid (jQuery Validation)
  if (window.jQuery && $("#CircleForm").length && !$("#CircleForm").valid()) {
    return;
  }

  let radiusString = document.getElementById("radius").value;
  let radius = parseFloat(radiusString);

  let diameter = calcDiameter(radius);
  let circumference = calcCircumference(radius);
  let area = calcArea(radius);

  // Optional: format to 4 decimals
  document.getElementById("diameter").textContent = diameter.toFixed(4);
  document.getElementById("circumference").textContent = circumference.toFixed(4);
  document.getElementById("area").textContent = area.toFixed(4);
};

document.getElementById("btnSubmitClear").onclick = function () {
  clearForm();
};
