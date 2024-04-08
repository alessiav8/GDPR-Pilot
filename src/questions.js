//-----------------------------QUESTIONS-----------------------------------

import { createDropDown, removeUlFromDropDown,createUlandSelectActivities,addMetaInformation } from "./support.js";
import { getDiagram,pushDiagram } from "./app.js";

//handle click yes for question A
async function yesdropDownA() {
  removeUlFromDropDown("#dropDownA");
  const dropdownB = createDropDown(
    "dropDownB",
    false,
    "Consent",
    "Did you ask for consent before?"
  );
    const meta= {questionA: "completed"};
    addMetaInformation(meta)
    .then((updatedXmlString) => {
        pushDiagram(updatedXmlString);
    })
    .catch((error) => {
        console.error("Errore durante l'aggiunta delle informazioni meta:", error);
    });    
  
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
async function nodropDownB() {
    const activities = createUlandSelectActivities("#dropDownB","Select the activities where you request personal data for the first time");
    //do something to add the path 
    const meta={questionB: "completed"}
    addMetaInformation(meta)
        .then((updatedXmlString) => {
            pushDiagram(updatedXmlString);
        })
        .catch((error) => {
            console.error("Errore durante l'aggiunta delle informazioni meta:", error);
        });  
}
//

export { yesdropDownA, nodropDownA,yesdropDownB, nodropDownB };
