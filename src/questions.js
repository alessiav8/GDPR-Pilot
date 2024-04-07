//-----------------------------QUESTIONS-----------------------------------

import { createDropDown, removeUlFromDropDown,createUlandSelectActivities } from "./support.js";

//handle click yes for question A
function yesdropDownA() {
  removeUlFromDropDown("#dropDownA");
  const dropdownB = createDropDown(
    "dropDownB",
    false,
    "Consent",
    "Did you ask for consent before?"
  );
}

//end handle click yes for question A

//handle click no for question A
function nodropDownA() {
  const gdpr = document.querySelector("#gdpr_compliant_button");
  gdpr.style.backgroundColor = "#2CA912";
  gdpr.textContent = "GDPR complient";
  removeUlFromDropDown("#dropDownA");
  console.log("no clicked");
}
//end handle click no for question A

//handle click yes for question B
function yesdropDownB() {
    removeUlFromDropDown("#dropDownB");
  const dropdownC = createDropDown(
    "dropDownC",
    false,
    "Access data",
    "Do you allow users to access their data?"
  );
}
//

//handle click no for question B
function nodropDownB() {
    createUlandSelectActivities("#dropDownB","Select the activities where you request personal data for the first time");
}
//

export { yesdropDownA, nodropDownA,yesdropDownB, nodropDownB };
