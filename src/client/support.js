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
  openDropDown, removeChatGPTTip
} from "./questions.js";
import { getDiagram,removeConsentFromActivity,getActivities,reorderDiagram,cleanSelection,decolorEverySelected,colorActivity,decolorActivity,getAnswerQuestionX,callChatGpt,getXMLOfTheCurrentBpmn } from "./app.js";

//close sideBarSurvey
function closeSideBarSurvey() {
  const mainColumn = document.querySelector(".main-column");
  const sidebarColumn = document.querySelector(".sidebar-column");
  const canvasRaw = document.querySelector("#canvas-raw");
  const spaceBetween = document.querySelector(".space-between");
  const survey_col = document.getElementById("survey_col");
  const survey_area= document.getElementById("survey_area")

  if(survey_col && survey_area ){
    survey_col.removeChild(document.getElementById("survey_area"));
    mainColumn.style.width = "100%";
    sidebarColumn.style.width = "0%";
    sidebarColumn.style.height = "0%";
    sidebarColumn.style.marginTop = "0vh";
  }
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
  const index=letters.indexOf(letter);
  if(open){
    if(letter!="L" && letter!= "B" && letter!="A" || (letter=="A" && type=="yes") || (letter=="B" && type=="yes")){
      const nextLetter=letters[index+1];
      const dropDownNext = "#ulCollapsedropDown"+nextLetter; 
      const NextLetterButton= document.querySelector(dropDownNext);
      NextLetterButton.setAttribute("class","collapse show");

    }
  }
}
//

function addTextBelowButton(Id, answer) {
  var buttonId;
  if(answer.includes("yes") || answer.includes("Yes")){
    buttonId = "yes_" + Id;
  }else if(answer.includes("No") || answer.includes("no")){
    buttonId = "no_" + Id;
  }
  else{
    let array = (JSON.parse(answer)) ? JSON.parse(answer) : null ;
    if(array){
      buttonId = "no_" + Id;
      console.log("Array of activities",array);
      localStorage.setItem("activities_suggested",JSON.stringify(array));
    }
  }
  const button = document.getElementById(buttonId);
  if(button){
    button.style.backgroundColor = "rgba(16, 173, 116, 0.3)";  
    const textElement = document.createElement("p");
    textElement.innerHTML = "Suggested by <br>OpenAI";
    textElement.style.marginTop="5px"
    textElement.style.fontSize = "10px";
    textElement.style.color = "rgba(16, 173, 116)";
    textElement.id= "p_"+buttonId;
    button.parentNode.insertBefore(textElement, button.nextSibling);
  }
}

async function predictionChatGPT(id){
  try{
    const currentXML = await getXMLOfTheCurrentBpmn();
    const descriptionReq =  await callChatGpt("I give you the xml of a bpmn process, can you give me back the description of the objective of this process? No list or other stuff. Just a brief description of at most 30 lines." + currentXML);
    const description = descriptionReq.content;
    const activitiesSet = await getActivities();
    switch(id){
      case "dropDownA":
        const hasPersonalDataReq = await callChatGpt("Given the description of a bpmn process that i provide to you, are you able to say to me if the process handle some personal data? Definition of personal data: Personal data refers to any information that relates to an identified or identifiable individual. This encompasses a wide range of details that can be used to distinguish or trace an individual’s identity, either directly or indirectly. According to the General Data Protection Regulation (GDPR) in the European Union, personal data includes, but is not limited to:Name: This could be a full name or even initials, depending on the context and the ability to identify someone with those initials. Identification numbers: These include social security numbers, passport numbers, driver’s license numbers, or any other unique identifier. Location data: Any data that indicates the geographic location of an individual, such as GPS data, addresses, or even metadata from electronic devices.Online identifiers: These include IP addresses, cookie identifiers, and other digital footprints that can be linked to an individual.Physical, physiological, genetic, mental, economic, cultural, or social identity: This broad category includes biometric data, health records, economic status, cultural background, social status, and any other characteristic that can be used to identify an individual.The GDPR emphasizes that personal data includes any information that can potentially identify a person when combined with other data, which means that even seemingly innocuous information can be considered personal data if it contributes to identifying an individual. You have to answer just Yes or No, nothing more and if you are not sure answer no. The description you have to analyze"+description+" and the xml",+currentXML," an example of activities that involves personal data are: Request personal data, request name and surname, request phone number ecc...");
        const hasPersonalData = hasPersonalDataReq.content;
        console.log("Prediction", hasPersonalData)
        addTextBelowButton(id, hasPersonalData);
        
        break;
      case "dropDownB":
        const hasConsentReq = await callChatGpt("Given a bpmn process of which this is the description:"+description+"Given the definition of Consent to Use the Data: when retrieving personal data, the Data Controller needs to ask the Data Subject for consent. If you ask the consent for a certain set of data you can use them without asking the consent again. Considering that,the consent must be asked just for handle personal data of the user not anything else!and personal data are the information that identifies or makes identifiable, directly. Particularly important are:- data that allow direct identification-such as biographical data (for example: first and last names), pictures, etc. - and data that allow indirect identification-such as an identification number (e.g., social security number, IP address, license plate number);- data falling into special categories: these are the so-called sensitive data, i.e., data revealing racial or ethnic origin, religious or philosophical beliefs, political opinions, trade union membership, relating to health or sex life. Regulation  also included genetic data, biometric data, and data relating to sexual orientation in the notion;- data relating to criminal convictions and offenses: these are so-called judicial data, i.e., those that may reveal the existence of certain judicial measures subject to entry in the criminal record (e.g., final criminal convictions, conditional release, prohibition or obligation to stay, alternative measures to detention) or the quality of defendant or suspect.The activity must directly involve some personal data to be considered in the answer  and for those data must miss the request of consent if some activity in a previous moment has requested for consent i don't need to request the consent again. Which activities require the request for consent before being executed among the one that are in this list:"+activitiesSet+".For the analysis please consider just the name of the activity.  Print just an array with the id (each activity has a name and an id in the list i provide to you) of the activities that requires the consent before and for which this consent is not already present in the process, among the activities in the set. if the consent is not necessary for no activity just print an empty array. If you print an array with more than one activity they had to regard different sets of personal data, otherwise print the first that appears in the process");
        const hasConsent = hasConsentReq.content;
        console.log("Has Consent?",hasConsent)
        addTextBelowButton(id, hasConsent);
        break;
      case "dropDownC":
        const hasRightToAccessReq = await callChatGpt("Given a bpmn process of which this is the description:"+description+ "and for which this is the process model"+currentXML+"Given the definition of Right to Access: at any moment, the Data Subject can access the personal data associated to her. As a result, the Data Controller has the obligation to satisfy these requests. And the definition of Data subject that is the person the data is about instead, the data controller collects and stores data from the data subject and that determines the purposes of processing such data (In this sense, is obvious that the data controller will ask the personal data to the subject). Consider carefully who is the data subject and who is the data controller. Is present in the bpmn model an activity in which the data subject request back (the request must be started from the data subject and should arrive to the data controller that should allow this action) its personal data (already requested by the Data controller in a previous moment) or not? Or in the negative case, is present an activity that handle the right to access the data like an event subprocess ? If not reply 'No' and nothing else, otherwise replay 'Yes' and nothing else. if you are not sure just print No. To give a correct answer, analyze also the list of activities present in the process. The presence of the activity in which the data controller ask for the personal data to the data subject, should not be taken into account because you must find some activity that works in the other verse, from the data subject to the data controller and not from the data controller to the data subject. Check the SequenceFlow connected to the activities you think that grant the right to access. Check the source ref and the target ref. The source ref should be the data subject. and check that the activity is not just the response to the request of data initiated by the data controller. give me a motivation for your answer");
        const hasRightToAccess = hasRightToAccessReq.content;
        console.log("Has Right To access?",hasRightToAccess)
        addTextBelowButton(id, hasRightToAccess);
        break;
      case "dropDownD":
        break;
      case "dropDownE":
        break;
      case "dropDownF":
        break;
      case "dropDownG":
        break;
      case "dropDownH":
        break;
      case "dropDownI":
        break;
      case "dropDownL":
        break;
    }
  }catch(e) {
    console.error("Error in prediction chatGPT", e);
  }
}

//function to create a drop down
//id:id to use for the dropdown ex "dropDownA"
//isExpanded: whether the dropdown must be expanded
//text Content: the macro title of the drop down 
//questionText: the question itself
//isDisabled: is disabled or can me clicked?
//valueButton: if the question was answered with was the answer Yes or No 
async function createDropDown(id, isExpanded, textContent, questionText, isDisabled, valueButton) {
  //the row that will contain the drop down
  const space = document.querySelector("#areaDropDowns");
  const row = document.createElement("div");
  row.className = "row";
  //
  const dropDown = document.createElement("div");
  dropDown.className = "dropdown";
  dropDown.style.width = "100%";
  dropDown.id = id;

  if(valueButton == null) {
    predictionChatGPT(id);
  }
  else{
    removeChatGPTTip(id)
  }

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

 // const prediction = await predictionChatGPT(id);
  //console.log("predictionChatGPT: " + prediction)


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
export function setGdprButtonCompleted(isCompleted){
  const gdpr_button = document.querySelector("#gdpr_compliant_button");
  if(gdpr_button.style.backgroundColor != "rgb(44, 169, 18)" && isCompleted ){
    gdpr_button.style.backgroundColor = "#2CA912";
    gdpr_button.textContent = "GDPR compliance";
  }
  else{
    gdpr_button.style.border = "0.3vh solid #10ad74";
    gdpr_button.textContent = "Ensure GDPR compliance";
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

//function to create ul and handle activity selection
async function createUlandSelectActivities(dropDownID, titleText, activities_already_selected) {
  cleanSelection();
  const dropDown = document.querySelector(dropDownID);
  const space = document.querySelector("#areaDropDowns");

  const collapse = dropDown.querySelector(".collapse");
  if (collapse) {
    while (collapse.firstChild) {
      collapse.removeChild(collapse.firstChild);
    }
    
    const button = dropDown.querySelector(".btn");
    button.addEventListener("click",function(event) {

      const isOpen = button.className != "btn collapsed" || button.ariaExpanded == true;
      
        if(!isOpen){
          decolorEverySelected();
        }
        else{ //se il drop di C è aperto 
          getAnswerQuestionX("questionB").then((result)=>{
            if(result && result.length > 0){
              result.forEach(act =>{
                colorActivity(act.id);
              });
            }
          });
          getActivities().then((result)=>{
            if(result&& result.length >0 ){
              result.forEach(act=>{
                const c = document.getElementById("checkbox_"+ act.id);
                if(c && c.checked){
                  colorActivity(act.id);
                }
              })
            }
          })
        }
      
    })

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
      console.log("activities: ",activities)
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
          checkbox.id="checkbox_"+activity.id;
          if(activities_already_selected){
            if(activities_already_selected.some(item=> item.id === activity.id)) {
              checkbox.checked = true;
            }
            else {
              checkbox.checked = false;
            }
          }

          checkbox.addEventListener("click", function(event){
            if(event.target.checked == true){
              colorActivity(event.target.value);
            }
            else{
              decolorActivity(event.target.value);
            }

          });

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
        submitButton.id="submit_"+dropDownID;

        subDiv.appendChild(submitButton);
        ulDropDown.appendChild(form);
        ulDropDown.appendChild(subDiv);


        submitButton.addEventListener("click", async function(event) {
          // Prevent the default form submission behavior
          event.preventDefault();
        
          // Get the selected activities
          const selectedActivities = Array.from(
            form.querySelectorAll("input[name='activity']:checked")
          ).map((checkbox) => 
            activities.find((activity) => activity.id === checkbox.value)
          );
        
          // Update the button styles
          submitButton.style.border = "2px solid #2CA912";
          submitButton.style.backgroundColor = "white";
        
          // Call the questionDone function
          questionDone("#dropDownB");
        
          try {
            // Get the setted activity
            const callSelected = await getSettedActivity("questionB");
            console.log("callSelected: ", callSelected);
        
            if (callSelected.length > 0) {
              // Remove consent from activities not selected
              callSelected.forEach(element => {
                if (!selectedActivities.some(item => item.id == element.id)) {
                  removeConsentFromActivity(element, "consent_");
                }
              });
        
              // Reorder the diagram
              reorderDiagram();
            }
            // Add the selected activities to the path
            addBPath(selectedActivities, activities_already_selected);
            // Open the dropdown
            openDrop("dropDownB", "yes", true);
            // Decolor every selected element
            decolorEverySelected();
          } catch (error) {
            console.error("Error during the process:", error);
          }
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
            const valore = (questionElements!= undefined) ? questionElements.getAttribute("question"+letter): null;
            const res= (valore!=null)? JSON.parse(valore) : null;
            questions["question"+letter]=res;
          })
          questions["gdpr_compliant"]=(questionElements!= undefined) ?questionElements.getAttribute("gdpr_compliant") : "false";    
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

export function displayDynamicAlert(message,type,time) {
  const alertContainer = document.getElementById('alertContainer');
    const alertDiv = document.createElement('div');
    alertDiv.className =`alert alert-${type} alert-dismissible fade show`;
    alertDiv.setAttribute('role', 'alert');

    alertDiv.innerHTML = `
        <strong>Important!</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    const closeButton = alertDiv.querySelector('.btn-close');
    closeButton.addEventListener('click', () => {
        alertDiv.remove();
    });
    alertContainer.appendChild(alertDiv);
    setTimeout(() => {
        alertDiv.remove();
    }, time); 
}


export function displayDynamicPopUp(message) {
  return new Promise((resolve) => {
    const alertContainer = document.getElementById('alertContainer');

    if (!alertContainer) {
      console.error('alertContainer element not found');
      resolve(false); 
      return;
    }

    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-warning alert-dismissible fade show';
    alertDiv.setAttribute('role', 'alert');
    alertDiv.style.position = 'fixed';
    alertDiv.style.right = '50vh';
    alertDiv.style.left = '50vh';
    alertDiv.style.width = '50%';
    alertDiv.style.bottom = '82%';
    alertDiv.style.zIndex = '1050'; 
    alertDiv.style.backgroundColor = 'white';
    alertDiv.style.border="white"

    alertDiv.innerHTML = `<center>
      <strong>${message}</strong>
      <hr>
      <button type="button" class="btn btn-success yes-btn">Yes</button>
      <button type="button" class="btn btn-danger no-btn">No</button>
    </center>`;

    alertContainer.appendChild(alertDiv);

    alertDiv.querySelector('.yes-btn').addEventListener('click', () => {
      alertDiv.remove(); 
      resolve(true); 
    });

    alertDiv.querySelector('.no-btn').addEventListener('click', () => {
      alertDiv.remove(); 
      resolve(false); 
    });
  });
}









export {
  removeUlFromDropDown,
  createDropDown,
  createUlandSelectActivities,
  closeSideBarSurvey,
  addMetaInformation,
  getMetaInformationResponse,
  isGdprCompliant,
  
};
