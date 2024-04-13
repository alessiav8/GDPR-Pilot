//-----------------------------QUESTIONS-----------------------------------

import { createDropDown, removeUlFromDropDown,createUlandSelectActivities,addMetaInformation,getActivitiesID,setJsonData,setGdprButtonCompleted,closeSideBarSurvey } from "./support.js";
import { getDiagram,pushDiagram,editMetaInfo,subProcessGeneration,getElement,getPreviousElement,addActivityBetweenTwoElements,handleSideBar } from "./app.js";
import consent_to_use_the_data from '../resources/consent_to_use_the_data.bpmn';

//handle click yes for question A
async function yesdropDownA() {
  if(!document.querySelector('#dropDownA')){
    await createDropDown("dropDownA",true,"Personal data","Do you handle personal data in your process?");
  }
  removeUlFromDropDown("#dropDownA");
  editMetaInfo("A",setJsonData("Yes",false));
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
  setGdprButtonCompleted();
  removeUlFromDropDown("#dropDownA");

  handleSideBar(false);
  closeSideBarSurvey();

  editMetaInfo("A",setJsonData("No",false));
  editMetaInfo("gdpr",true);
  
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
    await createUlandSelectActivities("#dropDownB","Select the activities where you request personal data for the first time");
    //do something to add the path 
    const dropDown = document.querySelector("#dropDownB");
    const button = dropDown.querySelector(".btn");
    button.click();
    editMetaInfo("B",setJsonData("No",false));
    

}
//

//function to add the path to solve B
async function addBPath(activities){

  editMetaInfo("B",setJsonData("Yes",activities));

  if(!document.querySelector("#dropDownC")){
    createDropDown("dropDownC",false,"User data access","Do you allow users to access their data?");
  }

    try{
        activities.forEach(async function(activity){
            const element = getElement(activity.id);
            const previous = getPreviousElement(element);
            const subprocess = await subProcessGeneration("consent"+activity.id, "Right to be Informed and to Consent",consent_to_use_the_data);
            console.log("subprocess",subprocess)
            if (subprocess) addActivityBetweenTwoElements(previous, element, subprocess)
      });

    }catch(e)
    {
      console.error("Some errorin addBPath",e)
    }

  //devo cercare ogni attività nel set
  //recuperare il riferimento 
  //attaccare prima di questa attività la richiesta di consenso
}
//



export { yesdropDownA, nodropDownA,yesdropDownB, nodropDownB,addBPath };
