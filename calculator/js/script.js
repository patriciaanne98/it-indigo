function clearForm() {
  document.getElementById("op1").value = "";
  document.getElementById("op2").value = "";
  document.getElementById("result").textContent = "";

  // Clear radio selection
  const radios = document.getElementsByName("operator");
  for (let i = 0; i < radios.length; i++) {
    radios[i].checked = false;
  }

  // Clear validation messages
  if (window.jQuery && $("#CalcForm").data("validator")) {
    $("#CalcForm").validate().resetForm();
  }

  // Clear custom error labels if you used them
  const op1err = document.getElementById("op1error");
  const op2err = document.getElementById("op2error");
  const operr = document.getElementById("operatorerror");
  if (op1err) op1err.textContent = "";
  if (op2err) op2err.textContent = "";
  if (operr) operr.textContent = "";
}

function calculate(op1, op2, operator) {
  if (operator === "+") return op1 + op2;
  if (operator === "-") return op1 - op2;
  if (operator === "*") return op1 * op2;
  if (operator === "/") return op1 / op2;
  return NaN;
}

document.getElementById("btnCalc").onclick = function () {
  // Must be valid before calculating
  if (window.jQuery && !$("#CalcForm").valid()) return;

  // parseFloat required (operands are floating point)
  const op1 = parseFloat(document.getElementById("op1").value);
  const op2 = parseFloat(document.getElementById("op2").value);

  // Get selected operator
  const operator = document.querySelector('input[name="operator"]:checked').value;

  // Handle divide by zero (nice to include)
  if (operator === "/" && op2 === 0) {
    document.getElementById("result").textContent = "Cannot divide by zero";
    return;
  }

  const result = calculate(op1, op2, operator);

  // Display result (format as needed)
  document.getElementById("result").textContent = result.toFixed(4);
};

document.getElementById("btnClear").onclick = function () {
  clearForm();
};
