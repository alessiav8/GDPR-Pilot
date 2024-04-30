//-----------------------------QUESTIONS-----------------------------------

import {
  createDropDown,
  removeUlFromDropDown,
  createUlandSelectActivities,
  addMetaInformation,
  getActivitiesID,
  setJsonData,
  setGdprButtonCompleted,
  closeSideBarSurvey,
  questionDone,
  getSettedActivity,
} from "./support.js";
import {
  getDiagram,
  pushDiagram,
  editMetaInfo,
  subProcessGeneration,
  getElement,
  getPreviousElement,
  addActivityBetweenTwoElements,
  handleSideBar,
} from "./app.js";
import consent_to_use_the_data from "../../resources/consent_to_use_the_data.bpmn";

async function checkDropDownOrdAdd(dropDown, bool, theme, question, isDisabled) {
  if (!document.querySelector("#" + dropDown)) {
    await createDropDown(dropDown, bool, theme, question,isDisabled);
  }
}

//----------------------------START YES HANDLER------------------------------------
//handle click yes for question A
async function yesdropDownA() {
  await checkDropDownOrdAdd(
    "dropDownA",
    true,
    "Personal data",
    "Do you handle personal data in your process?",false
  );
  removeUlFromDropDown("#dropDownA");
  editMetaInfo("A", setJsonData("Yes", false));
  allowOpenNextQuestion("B");
}
//end handle click yes for question A

//handle click yes for question B
function yesdropDownB() {
  //removeUlFromDropDown("#dropDownB");
  editMetaInfo("B", setJsonData("Yes", false));
  questionDone("#dropDownB");
  allowOpenNextQuestion("C");

  
}
//

export function yesdropDownC() {
  editMetaInfo("C", setJsonData("Yes", false));
  questionDone("#dropDownC");
  allowOpenNextQuestion("D");

}
export function yesdropDownD() {
  editMetaInfo("D", setJsonData("Yes", false));
  questionDone("#dropDownD");
  allowOpenNextQuestion("E");

  
}

export function yesdropDownE() {
  editMetaInfo("E", setJsonData("Yes", false));
  questionDone("#dropDownE");
  allowOpenNextQuestion("F");

  
}

export function yesdropDownF() {
  editMetaInfo("F", setJsonData("Yes", false));
  questionDone("#dropDownF");
  allowOpenNextQuestion("G");

  
}
export function yesdropDownG() {
  editMetaInfo("G", setJsonData("Yes", false));
  questionDone("#dropDownG");
  allowOpenNextQuestion("H");


}

export function yesdropDownH() {
  editMetaInfo("H", setJsonData("Yes", false));
  questionDone("#dropDownH");
  allowOpenNextQuestion("I");

  
}

export function yesdropDownI() {
  editMetaInfo("I", setJsonData("Yes", false));
  questionDone("#dropDownI");  
  allowOpenNextQuestion("L");

}

export function yesdropDownL() {
  editMetaInfo("L", setJsonData("Yes", false));
  questionDone("#dropDownL");
  setGdprButtonCompleted();
  handleSideBar(false);
  editMetaInfo("gdpr", true);
}

//----------------------------END YES HANDLER------------------------------------

//----------------------------START NO HANDLER------------------------------------

//handle click no for question A
async function nodropDownA() {
  await checkDropDownOrdAdd(
    "dropDownA",
    true,
    "Personal data",
    "Do you handle personal data in your process?"
  );
  setGdprButtonCompleted();
  //closeSideBarSurvey();

  removeUlFromDropDown("#dropDownA");
  handleSideBar(false);
  editMetaInfo("A", setJsonData("No", false));
  editMetaInfo("gdpr", true);
}
//end handle click no for question A

//handle click no for question B
async function nodropDownB(activities_already_selected) {
  await createUlandSelectActivities(
    "#dropDownB",
    "Select the activities where you request personal data for the first time",
    activities_already_selected
  );
  if (activities_already_selected) {
    questionDone("#dropDownB");
    await checkDropDownOrdAdd(
      "dropDownC",
      false,
      "User data access",
      "Do you allow users to access their data?"
    );
  }
  const dropDown = document.querySelector("#dropDownB");
  const button = dropDown.querySelector(".btn");
  button.setAttribute("aria-expanded", "true");
  /* const sidebarColumn = document.querySelector(".sidebar-column");
  $(document).ready(function() {
    $(button).dropdown('show');
    button.classList.add("show");
    button.setAttribute("aria-expanded", "true");
});*/
}
//

export function nodropDownC() {}

export function nodropDownD() {}

export function nodropDownE() {}

export function nodropDownF() {}

export function nodropDownG() {}

export function nodropDownH() {}

export function nodropDownI() {}

export function nodropDownL() {}

//----------------------------END NO HANDLER------------------------------------

//----------------------------START OTHER UTIL FUNCTIONS------------------------------------

async function addSubProcess(name, title, diagram, element, previous) {
  const subprocess = await subProcessGeneration(name, title, diagram, element);
  if (subprocess) {
    addActivityBetweenTwoElements(previous, element, subprocess);
  }
}

//function to add the path to solve B
async function addBPath(activities, activities_already_selected) {
  editMetaInfo("B", setJsonData("No", activities));
  await checkDropDownOrdAdd(
    "dropDownC",
    false,
    "User data access",
    "Do you allow users to access their data?"
  );
  try {
    activities.forEach(async function (activity) {
      const element = getElement(activity.id);
      const previousSet = getPreviousElement(element);
      if (previousSet) {
        var i = 0;
        for (var i = 0; i < previousSet.length; i++) {
          const name = "consent_" + activity.id + "_" + i;
          await addSubProcess(
            name,
            "Right to be informed and to Consent",
            consent_to_use_the_data,
            element,
            previousSet[i]
          );
        }
      } else {
        const name = "consent_" + activity.id + "_0";
        await addSubProcess(
          name,
          "Right to be informed and to Consent",
          consent_to_use_the_data,
          element,
          null
        );
      }
    });
  } catch (e) {
    console.error("Some error in addBPath", e);
  }

  //devo cercare ogni attività nel set
  //recuperare il riferimento
  //attaccare prima di questa attività la richiesta di consenso
}
//

export function createWithOnlyQuestionXExpandable(letter){
  const letters=["B","C","D","E","F","G","H","I","L"];
  var disabled = true;
  if (letter=="A"){
    createDropDown( "dropDownA",true,"Personal data","Do you handle personal data in your process?",false);
  }
  else{
    createDropDown( "dropDownA",true,"Personal data","Do you handle personal data in your process?",false);
  }
  for (let i=0; i<letters.length; i++){
    if(letters[i]==letter){
      disabled = false;
    }
    switch(letters[i]){
      case "B":
        createDropDown(
          "dropDownB",
          false,
          "Consent",
          "Did you ask for consent before?",disabled
        );
        break;

      case "C":
        createDropDown(
          "dropDownC",
          false,
          "Access data",
          "Do you allow users to access their data?",disabled
        );
        break;


      case "D":
        createDropDown(
          "dropDownD",
          false,
          "Data portability",
          "Do you allow users to port their data?",disabled
        );
        break;


      case "E":
        createDropDown(
          "dropDownE",
          false,
          "Rectification",
          "Do you allow users to rectify their data?",disabled
        );
        break;

      
      case "F":
        createDropDown(
          "dropDownF",
          false,
          "Withdraw the consent",
          "Do you allow users to withdraw the consent?",disabled
        );
        break;


      case "G":
        createDropDown(
          "dropDownG",
          false,
          "Access to automated processing ",
          "Do you allow users to access to object to automated processing?",disabled
        );
        break;


      case "H":
        createDropDown(
          "dropDownH",
          false,
          "Data Processing Restrictions",
          "Do you allow users to restrict processing on their data?",disabled
        );
        break;


      case "I":
        createDropDown(
          "dropDownI",
          false,
          "Data deletion",
          "Do you allow users to be forgotten?",disabled
        );
        break;


      case "L":
        createDropDown(
          "dropDownL",
          false,
          "Data breaches",
          "Do you allow users to be informed of data breaches occurred to heir data?",disabled
        );
        break;

      
      default:
        break;
    }
    
  }
}

export function getLastAnswered(setOfQuestions) {
  var last = "A";
  for (let i=0;i<setOfQuestions.length;i++) {
    while(setOfQuestions[i]){
      console.log("set",setOfQuestions,setOfQuestions[i])
    }
  }
}

function allowOpenNextQuestion(nextQuestion){
  const dropDown= document.querySelector("#dropDown"+nextQuestion);
  const button = dropDown.querySelector(".btn");
  button.setAttribute("data-bs-toggle", "collapse");
  button.style.border = "0.00002vh solid";
  button.style.backgroundColor="white";
}

export { yesdropDownA, nodropDownA, yesdropDownB, nodropDownB, addBPath };
