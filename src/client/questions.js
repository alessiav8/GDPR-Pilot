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
  openDrop
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
  createAGroup,
  existGdprGroup,
  addSubEvent,
  existsGdprPath,
  getAnswerQuestionX,
} from "./app.js";

import consent_to_use_the_data from "../../resources/consent_to_use_the_data.bpmn";

import right_to_access from "../../resources/right_to_be_consent.bpmn";
import right_to_portability from "../../resources/right_of_portability.bpmn";
import right_to_rectify from "../../resources/right_to_rectify.bpmn";
import right_to_object from "../../resources/right_to_object.bpmn";
import right_to_object_to_automated_processing from "../../resources/right_to_object_to_automated_processing.bpmn";
import right_to_restrict_processing from "../../resources/right_to_restrict_processing.bpmn";
import right_to_be_forgotten from "../../resources/right_to_be_forgotten.bpmn";
import right_to_be_informed_of_data_breaches from "../../resources/data_breach.bpmn";



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
  editYesNoButton("#yes_dropDownB");
}
//

//function to handle yes of question C
export function yesdropDownC() {
  editMetaInfo("C", setJsonData("Yes", false));
  questionDone("#dropDownC");
  allowOpenNextQuestion("D");
  editYesNoButton("#yes_dropDownC");

}
//

//function to handle yes of question D
export function yesdropDownD() {
  editMetaInfo("D", setJsonData("Yes", false));
  questionDone("#dropDownD");
  allowOpenNextQuestion("E");
  editYesNoButton("#yes_dropDownD");

  
}
//

//function to handle yes of question E
export function yesdropDownE() {
  editMetaInfo("E", setJsonData("Yes", false));
  questionDone("#dropDownE");
  allowOpenNextQuestion("F");
  editYesNoButton("#yes_dropDownE"); 
}
//

//function to handle yes of question F
export function yesdropDownF() {
  editMetaInfo("F", setJsonData("Yes", false));
  questionDone("#dropDownF");
  allowOpenNextQuestion("G");
  editYesNoButton("#yes_dropDownF");

  
}
//

//function to handle yes of question G
export function yesdropDownG() {
  editMetaInfo("G", setJsonData("Yes", false));
  questionDone("#dropDownG");
  allowOpenNextQuestion("H");
  editYesNoButton("#yes_dropDownG");
}
//

//function to handle yes of question H
export function yesdropDownH() {
  editMetaInfo("H", setJsonData("Yes", false));
  questionDone("#dropDownH");
  allowOpenNextQuestion("I");
  editYesNoButton("#yes_dropDownH");

}
//

//function to handle yes of question I
export function yesdropDownI() {
  editMetaInfo("I", setJsonData("Yes", false));
  questionDone("#dropDownI");  
  allowOpenNextQuestion("L");
  editYesNoButton("#yes_dropDownI");
}
//

//function to handle yes of question L
export function yesdropDownL() {
  editMetaInfo("L", setJsonData("Yes", false));
  questionDone("#dropDownL");
  setGdprButtonCompleted(true);
  handleSideBar(false);
  editMetaInfo("gdpr", true);
  editYesNoButton("#yes_dropDownL");

}
//

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
  setGdprButtonCompleted(true);
  //closeSideBarSurvey();

  removeUlFromDropDown("#dropDownA");
  handleSideBar(false);
  editMetaInfo("A", setJsonData("No", false));
  editMetaInfo("gdpr", true);
}
//end handle click no for question A

//handle click no for question B
async function nodropDownB(activities_already_selected,isLast) {
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
  allowOpenNextQuestion("C");
}
//

export function nodropDownC() {
  handleNoClick(right_to_access,"Access Request Received","Access Request fulfilled","right_to_access",'bpmn:MessageEventDefinition',"C","D");  
}

export async function nodropDownD() {
  handleNoClick(right_to_portability,"Portability Request Received","Portability Request fulfilled","right_to_portability",'bpmn:MessageEventDefinition',"D","E");  
}

export function nodropDownE() {
  handleNoClick(right_to_rectify,"Rectification Request Received","Rectification Request fulfilled","right_to_rectify",'bpmn:MessageEventDefinition',"E","F");  
}

export function nodropDownF() {
  handleNoClick(right_to_object,"Objection Request Received","Objection Request fulfilled","right_to_object",'bpmn:MessageEventDefinition',"F","G");  
}

export function nodropDownG() {
  handleNoClick(right_to_object_to_automated_processing,"Objection to Automated Processing Request Received","Objection to Automated Processing Request fulfilled","right_to_object_to_automated_processing",'bpmn:MessageEventDefinition',"G","H");  
}

export function nodropDownH() {
  handleNoClick(right_to_restrict_processing,"Processing Restriction Request Received","Processing Restrict Request fulfilled","right_to_restrict_processing",'bpmn:MessageEventDefinition',"H","I");  
}

export function nodropDownI() {
  handleNoClick(right_to_be_forgotten,"Request to be Forgotten Received","Request to be Forgotten fulfilled","right_to_be_forgotten",'bpmn:MessageEventDefinition',"I","L");  
}

export function nodropDownL() {
  handleNoClick(right_to_be_informed_of_data_breaches,"Data Breach occurred","Data Breach Managed","right_to_be_informed_of_data_breaches",'bpmn:ErrorEventDefinition',"L","L");  
  setGdprButtonCompleted(true);
}

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
  const answers_done = await getAnswerQuestionX("questionB");
  editMetaInfo("B", setJsonData("No", activities));
  await checkDropDownOrdAdd("dropDownC",false, "User data access", "Do you allow users to access their data?");
  
  try {
    activities.forEach(async function (activity) {
        const element = getElement(activity.id);
        if( answers_done == null || !answers_done.some(item => item.id === activity.id) ){
          const previousSet = getPreviousElement(element);
          if (previousSet.length > 0) {
            var i = 0;
            for (var i = 0; i < previousSet.length; i++) {
              const name = "consent_" + activity.id + "_" + i;
              await addSubProcess(name,"Right to be informed and to Consent",consent_to_use_the_data,element,previousSet[i]);
            }
          }
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

//function to handle the creation of all the dropdown elements
//letter: the last question replied
export function createWithOnlyQuestionXExpandable(letter,questions){
  const letters=["B","C","D","E","F","G","H","I","L"];
  var disabled = true;
  var value = (questions["questionA"]==null)?  null : questions["questionA"][0].value;
  if (letter=="A"){
    createDropDown( "dropDownA",true,"Personal data","Do you handle personal data in your process?",false,value);
  }
  else{
    createDropDown( "dropDownA",true,"Personal data","Do you handle personal data in your process?",false,value);
  }
  for (let i=0; i<letters.length; i++){
    if(letters[i]==letter){
      disabled = false;
    }
    else{
      disabled = true;
    }
    switch(letters[i]){
      case "B":
        createDropDown(
          "dropDownB",
          false,
          "Consent",
          "Did you ask for consent before?",disabled,
          null
          );
        break;

      case "C":
        var value = (questions["questionC"]==null)?  null : questions["questionC"][0].value;
        createDropDown(
          "dropDownC",
          false,
          "Access data",
          "Do you allow users to access their data?",disabled,
          value
        );
        break;


      case "D":
        var value = (questions["questionD"]==null)?  null : questions["questionD"][0].value;
        createDropDown(
          "dropDownD",
          false,
          "Data portability",
          "Do you allow users to port their data?",disabled,
          value
        );
        break;


      case "E":
        var value = (questions["questionE"]==null)?  null : questions["questionE"][0].value;
        createDropDown(
          "dropDownE",
          false,
          "Rectification",
          "Do you allow users to rectify their data?",disabled,
          value
        );
        break;

      
      case "F":
        var value = (questions["questionF"]==null)?  null : questions["questionF"][0].value;
        createDropDown(
          "dropDownF",
          false,
          "Withdraw the consent",
          "Do you allow users to withdraw the consent?",disabled,
          value
        );
        break;


      case "G":
        var value = (questions["questionG"]==null)?  null : questions["questionG"][0].value;
        createDropDown(
          "dropDownG",
          false,
          "Access to automated processing ",
          "Do you allow users to access to object to automated processing?",disabled,
          value,
        );
        break;


      case "H":
        var value = (questions["questionH"]==null)?  null : questions["questionH"][0].value;
        createDropDown(
          "dropDownH",
          false,
          "Data Processing Restrictions",
          "Do you allow users to restrict processing on their data?",disabled,
          value
        );
        break;


      case "I":
        var value = (questions["questionI"]==null)?  null : questions["questionI"][0].value;
        createDropDown(
          "dropDownI",
          false,
          "Data deletion",
          "Do you allow users to be forgotten?",disabled,
          value
          );
        break;


      case "L":
        var value = (questions["questionL"]==null)?  null : questions["questionL"][0].value;
        createDropDown(
          "dropDownL",
          false,
          "Data breaches",
          "Do you allow users to be informed of data breaches occurred to heir data?",disabled,
          value,
          );
        break;

      
      default:
        break;
    }
    
  }
}
//

//function to get the last answer that the user has done
export function getLastAnswered(setOfQuestions) {
  var last = "A";
  const set= ["A", "B", "C", "D", "E", "F", "G","H","I","L"]
  for (let i=0; i < set.length; i++) {
   if(setOfQuestions["question"+set[i]]!=null){
      last = set[i];
    }
  }
  return last;
}
//

//function to enable again a dropdown 
function allowOpenNextQuestion(nextQuestion){
  const dropDown= document.querySelector("#dropDown"+nextQuestion);
  const button = dropDown.querySelector(".btn");
  button.setAttribute("data-bs-toggle", "collapse");
  button.style.border = "0.00002vh solid";
  button.style.backgroundColor="white";
}
//

//function to open a specific @dropdown
//dropdown: id of the dropdown to open
export function openDropDown(dropdown){
  const dropDown = document.querySelector("#"+dropdown);
  const button = dropDown.querySelector(".btn");
  button.setAttribute("aria-expanded", "true");
}
//

//function to check if a group exists or to create it
async function checkGroupOrCreate(){
  const exist_gdpr = existGdprGroup();
  if(exist_gdpr == false ){
    createAGroup();
  }
  else{
    return;
  }
}
//

//function to check if exists the drop of a question, in the negative case it create a new one
async function checkDropDownOrdAdd(dropDown, bool, theme, question, isDisabled) {
  if (!document.querySelector("#" + dropDown)) {
    await createDropDown(dropDown, bool, theme, question,isDisabled);
  }
}
//

//function to edit the color of the button
//idButton the id of the yes/no button i have to edit
//if id: yes then yes will have the green border and no the black one
function editYesNoButton(idButton){
  const button = document.querySelector(idButton);
  button.style.border = "0.3vh solid #10ad74";
  const other_button_name = idButton.split("_");
  if(other_button_name[0]=="#yes"){
    const other = document.querySelector("#no_"+other_button_name[1]);
    other.style.border = "0.01vh solid black";
  }
  else{
    const other = document.querySelector("#yes_"+other_button_name[1]);
    other.style.border = "0.01vh solid black";
  }
}
//

//function to handle the click on the No button
function handleNoClick(diagram, start_label, end_label, id, start_type,current_letter,next_letter) {
  checkGroupOrCreate();
  if(!existsGdprPath(id)) {
    addSubEvent(diagram,start_label,end_label,id,start_type);  
  }
  editYesNoButton("#no_dropDown"+current_letter);
  editMetaInfo(current_letter, setJsonData("No", false));
  allowOpenNextQuestion(next_letter);
  questionDone("#dropDown"+current_letter);
}
//

export { yesdropDownA, nodropDownA, yesdropDownB, nodropDownB, addBPath };
