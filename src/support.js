//-----------------------------SUPPORTS FUNCTIONS-----------------------------------
import {
  yesdropDownA,
  nodropDownA,
  yesdropDownB,
  nodropDownB,
  addBPath,
} from "./questions.js";
import { getDiagram } from "./app.js";

//close sideBarSurvey
function closeSideBarSurvey() {
  const mainColumn = document.querySelector(".main-column");
  const sidebarColumn = document.querySelector(".sidebar-column");
  const canvasRaw = document.querySelector("#canvas-raw");
  const spaceBetween = document.querySelector(".space-between");
  const survey_col = document.getElementById("survey_col");

  survey_col.removeChild(document.getElementById("survey_area"));
  mainColumn.style.width = "100%";
  sidebarColumn.style.width = "0%";
  sidebarColumn.style.height = "0%";
  sidebarColumn.style.marginTop = "0vh";
}

//

//function to create a drop down
function createDropDown(id, isExpanded, textContent, questionText) {
  //the row that will contain the drop down
  const space = document.querySelector("#areaDropDowns");
  const row = document.createElement("div");
  row.className = "row";
  //

  const dropDown = document.createElement("div");
  dropDown.className = "dropdown";
  dropDown.style.width = "100%";
  dropDown.id = id;

  const button = document.createElement("button");
  button.className = "btn btn-secodary dropdown-toggle";
  button.setAttribute("type", "button");
  button.setAttribute("data-bs-toggle", "dropdown");
  button.style.width = "100%";

  button.setAttribute("ariaExpanded", isExpanded);
  button.textContent = textContent;
  dropDown.appendChild(button);

  const ul = document.createElement("ul");
  ul.style.width = "94%";
  ul.className = "dropdown-menu";

  const divQuestion = document.createElement("div");
  divQuestion.className = "container-centered";
  const question = questionText;
  const questionNode = document.createTextNode(question);

  divQuestion.appendChild(questionNode);

  const divButtons = document.createElement("div");
  divButtons.className = "row";
  divButtons.style.marginTop = "2vh";

  const yescol = document.createElement("div");
  yescol.className = "col  text-center";

  const nocol = document.createElement("div");
  nocol.className = "col  text-center";

  divButtons.appendChild(yescol);
  divButtons.appendChild(nocol);

  const YesButton = document.createElement("button");
  YesButton.className = "btn btn-primary";
  YesButton.textContent = "Yes";
  YesButton.id = "yes_" + id;

  const NoButton = document.createElement("button");
  NoButton.className = "btn btn-primary";
  NoButton.textContent = "No";
  NoButton.id = "no_" + id;

  YesButton.addEventListener("click", (event) => {
    switch (id) {
      case "dropDownA":
        yesdropDownA();
        break;
      case "dropDownB":
        yesdropDownB();
        break;
      case "dropDownC":
        yesdropDownC();
        break;
      case "dropDownD":
        yesdropDownD();
        break;
      case "dropDownE":
        yesdropDownE();
        break;
      case "dropDownF":
        yesdropDownF();
        break;
      case "dropDownG":
        yesdropDownG();
        break;
      case "dropDownH":
        yesdropDownH();
        break;
      case "dropDownI":
        yesdropDownI();
        break;
      case "dropDownL":
        yesdropDownL();
        break;
      default:
        event.stopPropagation();
        break;
    }
  });

  NoButton.addEventListener("click", (event) => {
    switch (id) {
      case "dropDownA":
        nodropDownA();
        break;
      case "dropDownB":
        nodropDownB();
        break;
      case "dropDownC":
        nodropDownC();
        break;
      case "dropDownD":
        nodropDownD();
        break;
      case "dropDownE":
        nodropDownE();
        break;
      case "dropDownF":
        nodropDownF();
        break;
      case "dropDownG":
        nodropDownG();
        break;
      case "dropDownH":
        nodropDownH();
        break;
      case "dropDownI":
        nodropDownI();
        break;
      case "dropDownL":
        nodropDownL();
        break;
      default:
        event.stopPropagation();
        break;
    }
  });

  yescol.appendChild(YesButton);
  nocol.appendChild(NoButton);

  ul.appendChild(divQuestion);
  ul.appendChild(divButtons);

  dropDown.appendChild(ul);

  row.appendChild(dropDown); //add the dropDown in the raw
  space.appendChild(row); //add the raw in the container
  return dropDown;
}
//end function create the dropDown

//funtion to set the gdpr button as completed
export function setGdprButtonCompleted(){
  const gdpr = document.querySelector("#gdpr_compliant_button");
  gdpr.style.backgroundColor = "#2CA912";
  gdpr.textContent = "GDPR complient";
}
//

//function to remove ul from drop down and sign it as passed
function removeUlFromDropDown(dropDown) {
  const dropDownA = document.querySelector(dropDown);

  if (dropDownA) {
    const child = dropDownA.querySelector(".dropdown-menu");
    console.log("child",child,"of",dropDown);
    if (child) {
      while(child.firstChild){
        child.removeChild(child.firstChild);
      }
      //dropDownA.removeChild(child);
      dropDownA.click();
      const button = dropDownA.querySelector(".btn");
      if (button) {
        button.setAttribute("data-bs-toggle", "");

        if(dropDown=="#dropDownA") button.className = "btn";
        button.style.boxShadow = "0 0 0 2px #2CA912";
        button.style.borderRadius = "1vh";
        button.style.marginTop = "0.3vh";
      } else {
        console.error("error in finding the button");
      }
    } else {
      console.log("Not possible to remove the child ul from the dropdownA");
    }
    dropDownA.removeAttribute("data-bs-toggle");
  } else {
    console.error("Elemento #dropDownA non trovato.");
  }
}
//end function to remove ul

//function to sign the question as done
function questionDone(dD){
  const dropDown = document.querySelector(dD);
  const button = dropDown.querySelector(".btn");
  button.click();
    if (button) {
      button.className = "btn";
      button.style.boxShadow = "0 0 0 2px #2CA912";
      button.style.borderRadius = "1vh";
      button.style.marginTop = "0.3vh";
    } else {
      console.error("error in finding the button");
    }
}
//

//function to create ul and handle activity selection
async function createUlandSelectActivities(dropDownID, titleText) {
  const dropDown = document.querySelector(dropDownID);
  const space = document.querySelector("#areaDropDowns");

  const ulDropDown = dropDown.querySelector(".dropdown-menu");
  if (ulDropDown) {
    while (ulDropDown.firstChild) {
      ulDropDown.removeChild(ulDropDown.firstChild);
    }

    const Title = document.createTextNode(titleText);
    const divTitle = document.createElement("div");
    divTitle.className = "container-centered";
    divTitle.style.marginLeft = "1vh";
    divTitle.appendChild(Title);

    const divActivities = document.createElement("div");
    divActivities.style.height = "15vh";
    divActivities.style.overflowY = "auto";
    divActivities.style.overflowX = "hidden";
    divActivities.style.marginLeft = "1vh";
    divActivities.style.marginTop = "1.5vh";

    ulDropDown.appendChild(divTitle);
    ulDropDown.appendChild(divActivities);

    try {
      const activities = await getActivities();
      if (activities.length === 0) {
        divActivities.style.display = "flex";
        divActivities.style.justifyContent = "center";
        divActivities.style.fontWeight = "bold";
        divActivities.textContent = "No activities available";
      } else {
        const form = document.createElement("form");

        activities.forEach((activity) => {
          const row = document.createElement("div");
          row.className = "row";

          const c1 = document.createElement("div");
          c1.className = "col-1";

          const c2 = document.createElement("div");
          c2.className = "col-8";

          const label = document.createElement("label");
          label.textContent = activity.name;

          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.name = "activity";
          checkbox.value = activity.id;

          c1.appendChild(checkbox);
          c2.appendChild(label);

          row.appendChild(c1);
          row.appendChild(c2);

          form.appendChild(row);
        });

        const subDiv = document.createElement("div");
        subDiv.className = "row";
        subDiv.style.justifyContent = "center";

        const submitButton = document.createElement("button");
        submitButton.className = "btn btn-light btn-sm";
        submitButton.textContent = "Submit";
        submitButton.style.width = "30%";
        submitButton.type = "submit";

        subDiv.appendChild(submitButton);
        ulDropDown.appendChild(form);
        ulDropDown.appendChild(subDiv);

        submitButton.addEventListener("click", (event) => {
          event.preventDefault();
          const selectedActivities = Array.from(
            form.querySelectorAll("input[name='activity']:checked")
        
          ).map((checkbox) =>
            activities.find((activity) => activity.id === checkbox.value)
          );
          submitButton.className = "btn-completed";
          questionDone("#dropDownB")
          addBPath(selectedActivities);
        });

        divActivities.appendChild(form);
      }
    } catch (e) {
      console.error("error in getting activities", e);
    }
  }
}
//end function to create ul and handle activity selection

//function to extract the set of activities
async function getActivities() {
  try {
    const xml = await getDiagram();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "application/xml");
    const taskElements = xmlDoc.querySelectorAll(`bpmn\\:task, task`);
    const tasks = Array.from(taskElements).map((task) => {
      const id = task.getAttribute("id");
      const name = task.getAttribute("name");
      return { id, name };
    });

    return tasks;
  } catch (error) {
    console.error("An error occurred in getActivities:", error);
    throw error;
  }
}
//

//function to mark as completed some question 
//metainfo structure 
//{"MetaInfo1": "Value"}
//xml passed not parsed
async function addMetaInformation(metaInfo) {
    const xmlString = await getDiagram();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    // Verifica se il namespace `meta:` è già presente nel documento
    const existingMetaNamespace = xmlDoc.lookupNamespaceURI("meta");
    if (!existingMetaNamespace) {
        xmlDoc.documentElement.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:meta", "http://example.com/metaInfo");
    }

    const bpmnDocumentation = xmlDoc.createElementNS("http://www.omg.org/spec/BPMN/20100524/MODEL", "bpmn:documentation");
    bpmnDocumentation.setAttribute("id", "MetaInformation_gdpr");

    const bpmnMetaInfo = xmlDoc.createElementNS("http://www.omg.org/spec/BPMN/20100524/MODEL", "bpmn:metaInfo");

    Object.keys(metaInfo).forEach((key) => {
        const metaQuestionA = xmlDoc.createElementNS(existingMetaNamespace || "http://example.com/metaInfo", "meta:"+key);
        metaQuestionA.textContent = metaInfo[key];
        bpmnMetaInfo.appendChild(metaQuestionA);
    });

    bpmnDocumentation.appendChild(bpmnMetaInfo);

    const existingDocumentation = xmlDoc.querySelector("bpmn\\:documentation[id='MetaInformation_gdpr']");
    if (!existingDocumentation) {
        xmlDoc.documentElement.appendChild(bpmnDocumentation);
    }
    else{
        existingDocumentation.appendChild(bpmnMetaInfo);
    }

    const serializer = new XMLSerializer();
    const updatedXmlString = serializer.serializeToString(xmlDoc);
    return updatedXmlString;
}


//


//function to get metadata information
async function getMetaInformationResponse() {
    try {
        const xml = await getDiagram();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, "application/xml");
        const questionElements = xmlDoc.querySelectorAll("modelMetaData")[0];
        const setOfQuestions=["A", "B", "C", "D", "E", "F","G","H", "I", "L"];
        var questions = new Array();
        setOfQuestions.forEach(letter=>{
          const valore = questionElements.getAttribute("question"+letter);
          const res= JSON.parse(valore);
          questions["question"+letter]=res;
        })
        questions["gdpr_compliant"]=questionElements.getAttribute("gdpr_compliant");
        return questions;
    } catch (error) {
        console.error("An error occurred in getMetaInformationResponse:", error);
        throw error;
    }
}
//

//function to check if is already gdpr compliant
async function isGdprCompliant(){
  try {
    const xml = await getDiagram();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "application/xml");
    const questionElements = xmlDoc.querySelectorAll("modelMetaData");

    if(questionElements.length> 0){
      questionElements.forEach((element) => {
        const compliance = element.getAttribute("gdpr_compliant");
        if(compliance != null){
          return (compliance === true) ? true : false;
        }
        else {
          return false;
        }
    });
    }
    else{
      return false;
    }

    } catch (error) {
        console.error("An error occurred in isGdprCompliant:", error);
        throw error;
    }
}
//

//function to get the set of activities ids from the set returned by the form submission 
export function getActivitiesID(activities){
  var setIds= new Set;
  activities.forEach((activity) =>{
    setIds.add(activity.id);
  });
  return setIds;
}
//

//export checkAlreadyExistent(question){

//}

//TODO: here miss the part were i add the already added activity maybe 
//function to set the questions answers in json format
export function setJsonData(response,activities){
  var setJson = new Set();
  setJson.add({id: "response", value: response});
  if(activities){
    activities.forEach((activity) => {
      setJson.add({id: activity.id, value: activity.name});
    });
  }
  let arrayOggetti = Array.from(setJson);
  return JSON.stringify(arrayOggetti);
}
//end function








export {
  removeUlFromDropDown,
  createDropDown,
  createUlandSelectActivities,
  closeSideBarSurvey,
  addMetaInformation,
  getMetaInformationResponse,
  isGdprCompliant,
  
};
