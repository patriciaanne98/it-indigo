function calcDiameter(radius) {
  return 2 * radius;
}

function calcCircumference(radius) {
  return 2 * Math.PI * radius;
}

function calcArea(radius) {
  return Math.PI * radius * radius;
}

document.getElementById("calculateBtn").onclick = function () {
  let radiusString = document.getElementById("radius").value;
  let radius = parseFloat(radiusString);

  let diameter = calcDiameter(radius);
  let circumference = calcCircumference(radius);
  let area = calcArea(radius);

  document.getElementById("diameterOut").textContent = diameter;
  document.getElementById("circumferenceOut").textContent = circumference;
  document.getElementById("areaOut").textContent = area;
};

document.getElementById("clearBtn").onclick = function () {
  document.getElementById("radius").value = "";
  document.getElementById("diameterOut").textContent = "";
  document.getElementById("circumferenceOut").textContent = "";
  document.getElementById("areaOut").textContent = "";
};
