(() => {
  const URL = "https://brucebauer.info/assets/ITEC3650/unitsconversion.php";

  const form = document.getElementById("converterForm");
  const fromValue = document.getElementById("fromValue");
  const toValue = document.getElementById("toValue");

  const fromValueError = document.getElementById("fromValueError");
  const fromUnitError = document.getElementById("fromUnitError");
  const toUnitError = document.getElementById("toUnitError");
  const resultError = document.getElementById("resultError");

  const btnCalc = document.getElementById("btnCalc");
  const btnClear = document.getElementById("btnClear");

  function clearMessages() {
    fromValueError.textContent = "";
    fromUnitError.textContent = "";
    toUnitError.textContent = "";
    resultError.textContent = "";
  }

  function getCheckedValue(name) {
    const el = form.querySelector(`input[name="${name}"]:checked`);
    return el ? el.value : "";
  }

  // Accepts: 10, 10.5, .5, 10., -2, -2.3
  function isNumericString(s) {
    const trimmed = s.trim();
    if (trimmed === "") return false;
    return /^-?(\d+(\.\d*)?|\.\d+)$/.test(trimmed);
  }

  function validate() {
    clearMessages();
    toValue.value = "";

    let ok = true;

    const fv = fromValue.value.trim();
    if (!isNumericString(fv)) {
      fromValueError.textContent = "Value is Required";
      ok = false;
    }

    const fu = getCheckedValue("FromUnit");
    if (!fu) {
      fromUnitError.textContent = "From Unit is Required";
      ok = false;
    }

    const tu = getCheckedValue("ToUnit");
    if (!tu) {
      toUnitError.textContent = "To Unit is Required";
      ok = false;
    }

    return ok;
  }

 async function calculate() {
  if (!validate()) return;

  const fv = fromValue.value.trim();
  const fu = getCheckedValue("FromUnit");
  const tu = getCheckedValue("ToUnit");

  try {
    const params = new URLSearchParams({
      FromValue: fv,
      FromUnit: fu,
      ToUnit: tu
    });

    const response = await fetch(`${URL}?${params.toString()}`);

    if (!response.ok) {
      resultError.textContent = "Server error. Try again.";
      return;
    }

    // Professor server returns plain TEXT
    const result = await response.text();

    toValue.value = result.trim();

  } catch (err) {
    resultError.textContent = "Unable to contact conversion server.";
  }
}

  function clearAll() {
    form.reset();
    clearMessages();
    toValue.value = "";
    fromValue.focus();
  }

  btnCalc.addEventListener("click", calculate);
  btnClear.addEventListener("click", clearAll);

  // Nice-to-have: Enter key triggers calculate when typing in the value box
  fromValue.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      calculate();
    }
  });
})();
