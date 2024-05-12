//-----------------------------SUPPORTS FUNCTIONS-----------------------------------
import {
  yesdropDownA,
  yesdropDownB,
  yesdropDownC,
  yesdropDownD,
  yesdropDownE,
  yesdropDownF,
  yesdropDownG,
  yesdropDownH,
  yesdropDownI,
  yesdropDownL,

  nodropDownA,
  nodropDownB,
  nodropDownC,
  nodropDownD,
  nodropDownE,
  nodropDownF,
  nodropDownG,
  nodropDownH,
  nodropDownI,
  nodropDownL,
  addBPath,
  openDropDown,
} from "./questions.js";
import { getDiagram,removeConsentFromActivity,getActivities,reorderDiagram } from "./app.js";

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

//function to open and close drop down 
//drop: id of the current question
//type: button clicked yes/no 
export async function openDrop(drop,type,open){
  const letters=["A", "B", "C", "D", "E","F", "G","H","I","L"];
  const letter=drop.split("dropDown")[1];
  const dropDownCurrent = "#ulCollapsedropDown"+letter; 
  const CurrentLetterButton = document.querySelector(dropDownCurrent);
  CurrentLetterButton.setAttribute("class", "collapse");
  console.log("close drop down",letter)
  const index=letters.indexOf(letter);
  if(open){
    if(letter!="L" && letter!= "B" && letter!="A" || (letter=="A" && type=="yes") || (letter=="B" && type=="yes")){
      const nextLetter=letters[index+1];
      const dropDownNext = "#ulCollapsedropDown"+nextLetter; 
      const NextLetterButton= document.querySelector(dropDownNext);
      NextLetterButton.setAttribute("class","collapse show");
      console.log("open drop down",nextLetter)

    }
  }
}
//

//function to create a drop down
//id:id to use for the dropdown
//isExpanded: whether the dropdown must be expanded
//text Content: the macro title of the drop down 
//questionText: the question itself
//isDisabled: is disabled or can me clicked?
//
function createDropDown(id, isExpanded, textContent, questionText, isDisabled, valueButton) {
  console.log("value of "+ valueButton);
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
  button.className = "btn";
  button.setAttribute("type", "button");
  button.setAttribute("data-bs-toggle", "collapse");
  if(!isDisabled){
    button.style.border = "0.00002vh solid";
    button.style.backgroundColor="white";
  }
  else{
    button.removeAttribute("data-bs-toggle");
    button.style.border = "0.00002vh solid gray";
  }
  button.setAttribute("href","#ulCollapse"+id);

  button.style.width = "100%";

  button.setAttribute("ariaExpanded", isExpanded);
  button.textContent = textContent;
  dropDown.appendChild(button);

  const ulContainer = document.createElement("div");
  ulContainer.id="ulCollapse"+id;
  ulContainer.style.width = "100%";
  ulContainer.className = "collapse";

  const ul = document.createElement("div");
  ul.style.width = "100%";
  ul.className = "card card-body";

  ulContainer.appendChild(ul);

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
  YesButton.className = "btn btn-light";
  YesButton.style.border = "0.01vh solid black";
  YesButton.textContent = "Yes";
  YesButton.id = "yes_" + id;

  const NoButton = document.createElement("button");
  NoButton.className = "btn btn-light";
  NoButton.style.border = "0.01vh solid black";
  NoButton.textContent = "No";
  NoButton.id = "no_" + id;

  if(valueButton == "Yes"){
    YesButton.style.border = "0.3 solid #10ad74";
  }
  else if(valueButton == "No"){
    NoButton.style.border ="0.3 solid #10ad74";
  }

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
        break;
    }

    if(valueButton == null){
      openDrop(id,"yes",true);
    }
    else{
      openDrop(id,"yes",false);
    }
  });

  NoButton.addEventListener("click", (event) => {
    switch (id) {
      case "dropDownA":
        nodropDownA();
        break;
      case "dropDownB":
        nodropDownB(false);
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
        break;
    }
  if(valueButton == null  && id != "dropDownB") {
      openDrop(id,"no",true);
  }
  else if( id != "dropDownB"){
    openDrop(id,"no",false);
  }
  });

  yescol.appendChild(YesButton);
  nocol.appendChild(NoButton);

  ul.appendChild(divQuestion);
  ul.appendChild(divButtons);

  dropDown.appendChild(ulContainer);

  row.appendChild(dropDown); 
  space.appendChild(row); 
  return dropDown;
}
//end function create the dropDown

//funtion to set the gdpr button as completed or remove the complete button
export function setGdprButtonCompleted(){
  const gdpr_button = document.querySelector("#gdpr_compliant_button");
  console.log("gdpr backGround ",gdpr_button.style.backgroundColor)
  if(gdpr_button.style.backgroundColor != "rgb(44, 169, 18)" ){
    gdpr_button.style.backgroundColor = "#2CA912";
    gdpr_button.textContent = "GDPR complient";
  }
  else{
    gdpr_button.style.border = "0.3vh solid #10ad74";
    gdpr_button.textContent = "Ensure GDPR complience";
    gdpr_button.style.backgroundColor ="white";


  }
}
//



//function to remove ul from drop down and sign it as passed
function removeUlFromDropDown(dropDown) {
  const dropDownA = document.querySelector(dropDown);

  if (dropDownA) {
    const child = dropDownA.querySelector(".collapse");
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
        button.style.border = '0.0002vh solid #2CA912';
        //button.style.borderRadius = "1vh";
        //button.style.marginTop = "0.3vh";
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
export function questionDone(dD){
  const dropDown = document.querySelector(dD);
  const button = dropDown.querySelector(".btn");
  button.click();
    if (button) {
      button.style.border = " 0.0002vh solid #2CA912";
    } else {
      console.error("error in finding the button");
    }
}
//

//TODO: handle delete of activity
//function to create ul and handle activity selection
async function createUlandSelectActivities(dropDownID, titleText, activities_already_selected) {
  const dropDown = document.querySelector(dropDownID);
  const space = document.querySelector("#areaDropDowns");

  const collapse = dropDown.querySelector(".collapse");
  if (collapse) {
    while (collapse.firstChild) {
      collapse.removeChild(collapse.firstChild);
    }

    const ulDropDown= document.createElement("div");
    ulDropDown.className = "card card-body";
    collapse.appendChild(ulDropDown);

    const Title = document.createTextNode(titleText);
    const divTitle = document.createElement("div");
    divTitle.className = "container-centered";
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
          label.textContent = (activity.name != null && activity.name!= undefined && activity.name!= "") ? activity.name : activity.id;

          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.name = "activity";
          checkbox.value = activity.id;
          if(activities_already_selected){
            if(activities_already_selected.some(item=> item.id === activity.id)) {
              checkbox.checked = true;
            }
            else {
              checkbox.checked = false;
            }
          }
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
          submitButton.style.border = "2px solid #2CA912"
          submitButton.style.backgroundColor="white"
          questionDone("#dropDownB")

          getSettedActivity("questionB").then(response => {
            const callSelected = response;
            if(callSelected){
              callSelected.forEach(element =>{
                if(!selectedActivities.some(item=>item.id == element.id)){
                  removeConsentFromActivity(element,"consent_");
                }
            })
            reorderDiagram();
          }
          addBPath(selectedActivities, activities_already_selected);
          });
          openDrop("dropDownB","yes",true);
        });

          
        divActivities.appendChild(form);      
      }
    } catch (e) {
      console.error("error in getting activities", e);
    }
  }
}
//end function to create ul and handle activity selection



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
        var questions = {};
        setOfQuestions.forEach(letter=>{
          const valore = questionElements.getAttribute("question"+letter);
          const res= JSON.parse(valore);
          questions["question"+letter]=res;
        })
        questions["gdpr_compliant"]=questionElements.getAttribute("gdpr_compliant");
        console.log("questions",questions)
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

//function to get the set activities of a question
export async function getSettedActivity(question){
  return new Promise(async (resolve, reject) => {
    try {
      const response = await getMetaInformationResponse();
      const questions = response;
      const requested_question = questions[question];
      var result = new Array();
      if (requested_question) {
        result = requested_question.filter(item => item.id != "response");
      }
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}
//




export {
  removeUlFromDropDown,
  createDropDown,
  createUlandSelectActivities,
  closeSideBarSurvey,
  addMetaInformation,
  getMetaInformationResponse,
  isGdprCompliant,
  
};
