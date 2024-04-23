//-----------------------------QUESTIONS-----------------------------------

import { createDropDown, removeUlFromDropDown,createUlandSelectActivities,addMetaInformation,getActivitiesID,setJsonData,setGdprButtonCompleted,closeSideBarSurvey,questionDone,getSettedActivity } from "./support.js";
import { getDiagram,pushDiagram,editMetaInfo,subProcessGeneration,getElement,getPreviousElement,addActivityBetweenTwoElements,handleSideBar } from "./app.js";
import consent_to_use_the_data from '../../resources/consent_to_use_the_data.bpmn';

async function checkDropDownOrdAdd(dropDown,bool,theme,question) {
  if(!document.querySelector('#'+dropDown)){
    await createDropDown(dropDown,bool,theme,question);
  }
}

//handle click yes for question A
async function yesdropDownA() {
  await checkDropDownOrdAdd("dropDownA",true,"Personal data","Do you handle personal data in your process?");
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
async function nodropDownA() {
  await checkDropDownOrdAdd("dropDownA",true,"Personal data","Do you handle personal data in your process?");
  setGdprButtonCompleted();
  //closeSideBarSurvey();

  removeUlFromDropDown("#dropDownA");
  handleSideBar(false);
  editMetaInfo("A",setJsonData("No",false));
  editMetaInfo("gdpr",true);
  
}
//end handle click no for question A

//handle click yes for question B
function yesdropDownB() {
  //removeUlFromDropDown("#dropDownB");
  editMetaInfo("B",setJsonData("Yes",false));
  questionDone("#dropDownB");
  const dropdownC = createDropDown(
    "dropDownC",
    false,
    "Access data",
    "Do you allow users to access their data?"
  );
}
//

//handle click no for question B
async function nodropDownB(activities_already_selected) {
    await createUlandSelectActivities("#dropDownB","Select the activities where you request personal data for the first time",activities_already_selected);
    if(activities_already_selected){
      questionDone("#dropDownB");
      await checkDropDownOrdAdd("dropDownC",false,"User data access","Do you allow users to access their data?");
       
    }
    const dropDown = document.querySelector("#dropDownB");
    const button = dropDown.querySelector(".btn");
    const sidebarColumn = document.querySelector(".sidebar-column");
    console.log("width sidebar",sidebarColumn.style.width)
    $(document).ready(function() {
      $(button).dropdown('show');
      button.classList.add("show");
      button.setAttribute("aria-expanded", "true");
  });



    
}
//

//function to add the path to solve B
async function addBPath(activities, activities_already_selected){
  
  editMetaInfo("B",setJsonData("No",activities));
  await checkDropDownOrdAdd("dropDownC",false,"User data access","Do you allow users to access their data?");
  try{
        activities.forEach(async function(activity){
            const element = getElement(activity.id);
            const previousSet = getPreviousElement(element);
            if(previousSet){
              var i = 0;
              for (var i=0; i < previousSet.length; i++){
                const name= "consent_" + activity.id + "_" + i;
                await addSubProcess(name, "Right to be informed and to Consent", consent_to_use_the_data,element,previousSet[i]);
              }
            }
            else{
              const name= "consent_" + activity.id + "_0";
               await addSubProcess(name, "Right to be informed and to Consent", consent_to_use_the_data,element,null);
            }
    });
    
    }catch(e)
    {
      console.error("Some error in addBPath",e)
    }


  //devo cercare ogni attività nel set
  //recuperare il riferimento 
  //attaccare prima di questa attività la richiesta di consenso
}
//

async function addSubProcess(name,title,diagram,element,previous){
  const subprocess = await subProcessGeneration(name,title,diagram,element);
   if (subprocess) {
      addActivityBetweenTwoElements(previous, element, subprocess);
  }
}

export { yesdropDownA, nodropDownA,yesdropDownB, nodropDownB,addBPath };
