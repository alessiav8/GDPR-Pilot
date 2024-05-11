import BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

import BpmnModdle from 'bpmn-moddle';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import {getNewShapePosition} from 'bpmn-js/lib/features/auto-place/BpmnAutoPlaceUtil.js';
import camundaModdle from "camunda-bpmn-moddle/resources/camunda.json";


import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { query, classes } from "min-dom";

import disableModeling from "../customizations/DisableModeling.js";

import diagram from '../../resources/diagram.bpmn';
import diagram_two_activities from '../../resources/diagram_two_activities.bpmn';
import consent_to_use_the_data from '../../resources/consent_to_use_the_data.bpmn';
import confirmForGDPRPath from '../customizations/confirm';

import { yesdropDownA, nodropDownA,yesdropDownB,nodropDownB,yesdropDownC,nodropDownC,yesdropDownD,nodropDownD,yesdropDownE,nodropDownE,yesdropDownF,nodropDownF,yesdropDownG,nodropDownG,yesdropDownH,nodropDownH,yesdropDownI,nodropDownI,yesdropDownL,nodropDownL,createWithOnlyQuestionXExpandable,getLastAnswered } from './questions.js';
import { createDropDown, removeUlFromDropDown, closeSideBarSurvey, getMetaInformationResponse,isGdprCompliant,setGdprButtonCompleted,setJsonData } from './support.js';
import axios from 'axios';
import zeebeModdleDescriptor from 'zeebe-bpmn-moddle/resources/zeebe';


var MetaPackage = require('../customizations/metaInfo.json');
var current_diagram = diagram_two_activities;

var moddle = new BpmnModdle({ camunda: camundaModdle });

const zeebeModdle = require('zeebe-bpmn-moddle/resources/zeebe.json');

const moddle_2 = new BpmnModdle({ zeebe: zeebeModdle });

const second_viewer = new BpmnModeler({
  
});

var viewer = new BpmnJS({
    container: '#canvas',
    moddleExtensions: {
        meta: MetaPackage,
        zeebe: zeebeModdleDescriptor
        
    },
    additionalModules: [
      disableModeling, 
      confirmForGDPRPath,
    ]

});

//statements
const export_button=document.getElementById('export_button');
const import_button=document.getElementById('import_button');
const gdpr_button=document.getElementById('gdpr_compliant_button');
const canvas_raw=document.getElementById('canvas_raw');
const canvas= document.getElementById('canvas');
const canvas_col=document.getElementById('canvas_col');
const survey_col=document.getElementById('survey_col');
const over_canvas=document.getElementById('over_canvas');
const edit= document.getElementById("mode");
const endpoint="http://localhost:3000"

var elementFactory;
var modeling;
var elementRegistry;
var canvas_ref;
var eventBus;
var contextPad;
var modeler;
var search = new URLSearchParams(window.location.search);
var browserNavigationInProgress;
var questions_answers;

var search = new URLSearchParams(window.location.search);
var browserNavigationInProgress;

//gdpr questions
const YA=document.getElementById('yes_dropDownA');
const NA=document.getElementById('no_dropDownA');
//end gdpr questions

const bpmnActivityTypes = [
  'bpmn:task',
  'bpmn:Task',
  'bpmn:serviceTask',
  'bpmn:ServiceTask',
  'bpmn:userTask',
  'bpmn:UserTask',
  'bpmn:scriptTask',
  'bpmn:ScriptTask',
  'bpmn:businessRuleTask',
  'bpmn:BusinessRuleTask',
  'bpmn:sendTask',
  'bpmn:SendTask',
  'bpmn:receiveTask',
  'bpmn:ReceiveTask',
  'bpmn:manualTask',
  'bpmn:ManualTask',
];

const allBpmnElements = 
 
bpmnActivityTypes.concat(
  [
    "bpmn:Gateway",
    "bpmn:ExclusiveGateway",
    "bpmn:SubProcess",
    "bpmn:ParallelGateway",
    "bpmn:BoundaryEvent",
    "bpmn:MessageFlow",
    "bpmn:gateway",
    "bpmn:sequenceFlow",
    "bpmn:exclusiveGateway",
    "bpmn:subProcess",
    "bpmn:parallelGateway",
    "bpmn:boundaryEvent",
    "bpmn:messageFlow",
    "bpmn:endEvent",
    "bpmn:EndEvent",
    "bpmn:startEvent",
    "bpmn:StartEvent",
    "bpmn:callActivity",
    "bpmn:CallActivity",
]);

const gdprActivityQuestionsPrefix=[
  "consent",
]
//

//this function returns true to me if there is an extended element that has a meta tag in it
function getExtension(element, type) {
  if (!element.extensionElements) {
    return null;
  }
  if (Array.isArray(element.extensionElements)) {
    return element.extensionElements.some(function(e) {
      return e.values.some(function(meta) {
        return meta.$instanceOf(type);
      });
    });
  } else {
    return element.extensionElements.values.some(function(meta) {
      return meta.$instanceOf(type);
    });
  }
}
//

//function that loads the first diagram displayed at every load
document.addEventListener('DOMContentLoaded', async function () {
    await loadDiagram(diagram_two_activities);
    localStorage.setItem("popUpVisualized", false);
});
// end function to load the first diagram 

//function to call the AP of chatGPT
function callChatGpt(){
  axios.get(endpoint + '/api/sensitive-data')
  .then(response => {
    const messageReceived = response.data.message.content;
    console.log('Response from chatGPT:', messageReceived);
  })
  .catch(error => {
    console.error('Errore durante il recupero delle informazioni sensibili:', error);
  });
}
//

//function to load the diagram through importXML
async function loadDiagram(diagram){
    try {
      const res = viewer.importXML(diagram)
          .then(async () => {

              viewer.get('canvas').zoom('fit-viewport');
              elementFactory = viewer.get('elementFactory');
              modeling = viewer.get('modeling');
              elementRegistry=viewer.get('elementRegistry');
              changeID();
              checkMetaInfo();
              canvas_ref = viewer.get('canvas');
              eventBus = viewer.get('eventBus');
              contextPad = viewer.get('contextPad');

              console.log(contextPad);
              var bpmnReplace = viewer.get('bpmnReplace');
              var translate = viewer.get('translate');
              //

              //this prevent the modification of the id when someone change the type of something 
              eventBus.on('element.updateId' ,function(event) {
                event.preventDefault();              
                return;
              });
              //

              //handle the remotion of a gdpr path
              viewer.on('shape.removed', function(event) {

                var element = event.element;
                if(element.type==="bpmn:CallActivity"){
                  const name=element.businessObject.id;
                 
                  getMetaInformationResponse().then((response)=>{

                  if (name.startsWith("consent")){
                    const questionB = response["questionB"];
                    var activity_id = name.split("_")[1]+"_"+name.split("_")[2];
                    const new_meta = questionB.filter(element => element.id!="response" && element.id != activity_id);
                    console.log("new_meta",new_meta);
                    editMetaInfo("B",setJsonData("No",new_meta));
                  }
                  else if(name.startsWith("")){
                  }
                  reorderDiagram();
                })
              }
             /* to FINISH else {
                const activity_connected = element.id;
                console.log(element)
                //const hover = element.
                gdprActivityQuestionsPrefix.forEach(prefix =>{
                  const activity_prefix_name = prefix+"_"+activity_connected+"_0";
                  console.log("activity_connected",activity_prefix_name,elementRegistry.getAll())
                  const element_connected = elementRegistry.get(activity_prefix_name);
                  if(element_connected){
                    modeling.removeShape(element_connected);
                  }

                });
              }*/
              });
              //
           
              eventBus.on('connect.end', function(event) {
                var context = event.context,
                    source = context.source,
                    hover = context.hover;

                    if (context && context.connection) {
                      var connection = context.connection;
                      if( (source.type=="bpmn:callActivity" || source.type=="bpmn:CallActivity" && gdprActivityQuestionsPrefix.some(item=> item== source.id.split('_')[0]) )
                        || (hover.type=="bpmn:callActivity" || hover.type=="bpmn:CallActivity" && gdprActivityQuestionsPrefix.some(item=> item== hover.id.split('_')[0])) ){
                          const compromise= confirm("In this way you are compromising the gdpr compliance. \n Are you sure you want to proceed? ");
                          if(!compromise){
                            modeling.removeConnection(connection);
                          }
                      }
                    } else {
                      console.log('Connessione non disponibile');
                    }
              });
              console.log("event",eventBus)

              
            /*if(elementRegistry.getAll().length > 0) {
              getMetaInformationResponse().then((response)=>{
                questions_answers = response;
                if(questions_answers["gdpr_compliant"] == true){
                  setGdprButtonCompleted();
                }
              })
          }*/


          })
          .catch(error => {
              console.error('Errore nell\'importazione dell\'XML:', error);
          });

  } catch (err) {
      console.error('Si è verificato un errore:', err);
  }
}
//end function to load the diagram 

//function create backArrow subProcess
function backArrowSubProcess(){
  gdpr_button.disabled=true;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("width", "50");
  svg.setAttribute("height", "50");
  svg.setAttribute("fill", "#2CA912");
  svg.setAttribute("class", "bi bi-arrow-left");
  svg.setAttribute("viewBox", "0 0 16 16");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("fill-rule", "evenodd");
  path.setAttribute("d", "M4.354 8.354a.5.5 0 0 1 0-.708l3.293-3.293a.5.5 0 0 1 .708.708L5.707 8l2.648 2.647a.5.5 0 0 1-.708.708l-3.293-3.293a.5.5 0 0 1 0-.708z");

  svg.appendChild(path);

  var closeBtn = document.createElement('span');
  closeBtn.classList.add('close-btn');
  closeBtn.style.marginBottom="4vh";
  closeBtn.style.marginLeft="4vh";
  

  closeBtn.prepend(svg);

  over_canvas.appendChild(closeBtn);

  closeBtn.addEventListener("click", ()=>{
    loadDiagram(current_diagram);
    over_canvas.removeChild(closeBtn);
    gdpr_button.disabled = false;
  });


}
//

//function to change the ID for the mainProcess
function changeID(){
  const processElement = elementRegistry.filter(element => {
    return element.type === 'bpmn:Process' && element.parent==null ; 
  }).pop();
  console.log(processElement)
  if (processElement) {
    const newProcessId = 'Main_Process';
    modeling.updateProperties(processElement, {
      id: newProcessId
    });
  } else {
    console.error('Il processo con l\'ID specificato non è stato trovato.');
  }
}
//

//Function to check if already have the gdpr marks or add it
function checkMetaInfo(){
  const Mod = viewer._moddle;
  const processElements = getProcessElement();

  if (processElements.length > 0) { 
      var firstProcessElement = processElements[0];
      var processBusinessObject = firstProcessElement.businessObject;
      var processExtension = getExtension(processBusinessObject, 'meta:ModelMetaData');
      //the function returns the business object
      if (processExtension) {
          console.log("already have an extention",processExtension);
          return processBusinessObject.extensionElements;
      } else {
          const meta = Mod.create('meta:ModelMetaData');
          processBusinessObject.extensionElements = Mod.create('bpmn:ExtensionElements');
          processBusinessObject.extensionElements.get('values').push(meta);
          meta.gdpr_compliant = false;
          console.log("not have an extention",processBusinessObject.extensionElements);
          return processBusinessObject.extensionElements;
      }
    } else {
          console.log("Nessun processo trovato nel diagramma.");
    }
}
//end checkMetaInfo 


//TODO: Può esserci più di un processo? 

//Function to get the element process without knowing the ID
function getProcessElement(){
  var allElements = viewer.get('elementRegistry').getAll();
  var processElements = allElements.filter(function(element) {
      if( element.type === "bpmn:Process" || element.type === 'bpmn:Collaboration' ||element.type === 'bpmn:process' || element.type === 'bpmn:collaboration'){
        return element;
      };
  })
  return processElements;
}
//end function to get the element process

//function to edit MetaInfo
function editMetaInfo(question,value_to_assign){

  const businessObject = checkMetaInfo();
  if (businessObject && businessObject.values.length > 0) {
    businessObject.values.forEach(value => {
      if (value.$type === 'meta:ModelMetaData') {
        switch (question) {
          case 'A':
            value.questionA=value_to_assign;
            break;

          case 'B':
            value.questionB=value_to_assign;
            break;

          case 'C':
            value.questionC=value_to_assign;
            break;

          case 'D':
            value.questionD=value_to_assign;
            break;
          
          case 'E':
            value.questionE=value_to_assign;
            break;

          case 'F':
            value.questionF=value_to_assign;
            break;

          case 'G':
            value.questionG=value_to_assign;
            break;

          case 'H':
            value.questionH=value_to_assign;
            break;

          case 'I':
            value.questionI=value_to_assign;
            break;

          case 'L':
            value.questionL=value_to_assign;
            break;

          case "gdpr":
            value.gdpr_compliant=value_to_assign;
          default:
            break;
        }
      }
    });
  }

  return;

}
//

//export handler 
export_button.addEventListener('click', function () {
  try{
    closeSideBarSurvey();
    handleSideBar(false);
  }
  catch(e){
    console.log("Error",e);
  }

  var container = document.getElementById('canvas');

  var background_container = document.createElement('div');
  background_container.classList="background-container";

  var popup = document.createElement('div');
  popup.classList.add('popup');

  var what_is=document.createElement('div');
  what_is.innerHTML="<strong>Insert a title for the diagram</strong>";
  what_is.style.marginLeft="20%"


  popup.appendChild(what_is);

  var inputText = document.createElement('input');
  inputText.setAttribute('type', 'text');
  inputText.setAttribute('placeholder', 'Insert the title');
  inputText.setAttribute('value', 'Diagram');
  inputText.style.marginTop="1.8vh";


  popup.appendChild(inputText);

  var confirmBtn = document.createElement('button');
  confirmBtn.classList.add('btn-popup');
  confirmBtn.style.backgroundColor = '#10ad74';
  confirmBtn.style.textSize='1vh';
  confirmBtn.textContent = 'Confirm and export';

  popup.appendChild(confirmBtn);

  var closeBtn = document.createElement('span');
    closeBtn.classList.add('close-btn');
    closeBtn.textContent = 'X';
    closeBtn.style.marginBottom="0.4vh";
  popup.appendChild(closeBtn);

    
  background_container.appendChild(popup);  
  container.appendChild(background_container);


  background_container.addEventListener('click', function(event) {
    const target_=event.target
    if(target_.className=="background-container"){
      container.removeChild(background_container);
    }
  });
  closeBtn.addEventListener('click', function() {
    event.stopPropagation();
    container.removeChild(background_container); 
  });
  confirmBtn.addEventListener('click', function() {
    event.stopPropagation();
    var title = inputText.value;
    exportDiagram(title);    
    container.removeChild(background_container); 
  });

});
//part where i actually generate the xml file
function exportDiagram(title){

  viewer.saveXML({ format: true })
  .then(({ xml, error }) => {
      if (error) {
          console.log(error);
      } else {
          console.log("exportDiagram",xml);
          download(xml, title + '.bpmn', 'text/xml');
      }
  })
  .catch(error => {
      console.log(error);
  });
}

function download(content, filename, contentType) {
  var a = document.createElement('a');
  var file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = filename;
  a.click();
}
//

//in order to make visible and invisible the label over the export button
export_button.addEventListener('mouseover', () =>{
  document.getElementById("label_export_button").innerHtml = "Export";
});

export_button.addEventListener('mouseout', () =>{
  document.getElementById("label_export_button").innerHtml = "";
});
//
//end export handler


//import handler
import_button.addEventListener('mouseover', () =>{
  document.getElementById("label_import_button").innerHtml = "Import";
});

import_button.addEventListener('mouseout', () =>{
  document.getElementById("label_import_button").innerHtml = "";
});

import_button.addEventListener('click', () =>{
  var input = document.createElement('input');
  input.type = 'file';

  input.addEventListener('change', function(event) {
  var diagram_imported = event.target.files[0];
  if (diagram_imported) {
      const reader = new FileReader();
      reader.onload = function(event) {
          const fileXML = event.target.result;
          loadDiagram(fileXML);
          eventBus.fire("TOGGLE_MODE_EVENT", {
            exportMode: false 
          });       
          edit.textContent = "Edit Mode";
            };
      reader.readAsText(diagram_imported);
      }
    })

    input.click();
    try{
      closeSideBarSurvey();
      handleSideBar(false);
    }
    catch(e){
      console.log("Error",e);
    }
});
//end import handler 

//function to handle the click of the gdpr button ---> open side bar 
function handleClickOnGdprButton(){
  viewer.get('canvas').zoom('fit-viewport');
  handleSideBar(true);
  const mainColumn = document.querySelector('.main-column');
  const sidebarColumn = document.querySelector('.sidebar-column');
  const canvasRaw = document.querySelector('#canvas-raw');
  const spaceBetween=document.querySelector('.space-between');
  if(!document.getElementById("survey_area")){
    // Aggiorna le larghezze delle colonne
    mainColumn.style.width = '74.8%';
    sidebarColumn.style.width = '23.8%';
    sidebarColumn.style.marginLeft="0.5%";

    sidebarColumn.style.height = canvas.clientHeight + 'px';
    sidebarColumn.style.marginTop = '1vh';
    sidebarColumn.style.borderRadius="4px"

    //start survey area handler
    const survey_area = document.createElement('div');
    survey_area.id="survey_area";
    survey_col.appendChild(survey_area);

    const close_survey = document.createElement('span');
    close_survey.classList.add('close-btn');
    close_survey.textContent = 'X';
    close_survey.style.marginTop="2.5vh";
    close_survey.style.marginRight="3.5vh"

    close_survey.addEventListener('click', () => {
     closeSideBarSurvey();
     handleSideBar(false);
    });

    survey_area.appendChild(close_survey);

    const title = "GDPR compliance";
    const textNode = document.createTextNode(title);

    const divTitle = document.createElement("div");
    divTitle.className = "container-centered";
    divTitle.style.marginTop="4vh";
    divTitle.style.marginBottom="2vh";
    divTitle.style.fontWeight = 'bold';
    divTitle.style.fontSize = '2vh';

    divTitle.appendChild(textNode);
    survey_area.appendChild(divTitle);

    const areaDropDowns= document.createElement("div");
    areaDropDowns.className = "container";
    areaDropDowns.id="areaDropDowns";
    areaDropDowns.style.overflow = "auto";
    areaDropDowns.style.maxHeight = "65vh";
    survey_area.appendChild(areaDropDowns);

    const undo = document.createElement("div");
    undo.className = "row";
    undo.style.position = "absolute";
    undo.style.bottom = "0";
    undo.style.marginBottom = "10vh";
    undo.style.display = "flex";
    undo.style.alignItems = "center";

    const undo_button = document.createElement("button");
    undo_button.className = "btn btn-outline-danger";
    undo_button.textContent = "Undo everything";

       
    undo.appendChild(undo_button);
    survey_area.appendChild(undo);

    const areaWidth = survey_area.offsetWidth;
    const leftValue = (areaWidth / 2 - (undo_button.offsetWidth/2)) ;
    undo.style.marginLeft = `${leftValue}px`;
    undo_button.addEventListener("click", handleUndoGdpr);
    checkQuestion();
  }
}
//

//function to handle the undo of everything we made for the gdpr compliance
//i have to edit the meta info 
//to remove every path added
function handleUndoGdpr(){
  elementRegistry=viewer.get("elementRegistry");
  var conferma = confirm("Are you sure?");
  if(conferma){
    getMetaInformationResponse().then((response=>{
      for (let question in response){
        if (response[question] != null) {
          switch (question) {
            case "gdpr_compliant":
              editMetaInfo("gdpr", false);
              break;
            case "questionA":
              if(response[question][0].value=="No"){
                setGdprButtonCompleted();
              }
              editMetaInfo("A",null);
            case "questionB":
              response[question].forEach(element=>{
                console.log("element: ",element)
                if(element.id!="response"){
                  const activity = elementRegistry.get(element.id);
                  removeConsentFromActivity(activity, "consent_");
                }
              })
              break;
            
            case "questionC" || "questionD" || "questionE" || "questionF" || "questionG" || "questionH" || "questionI" || "questionL":
              const id=questionToId(question);
              deleteGdprPath(id);
            
            default:
              break;
          }
        }
      }
      const group= elementRegistry.get("GdprGroup");
      if(group){
        modeling.removeShape(group);
      }
      closeSideBarSurvey();
      handleSideBar(false);
      viewer.get('canvas').zoom('fit-viewport');

    }))
  }

}
//

//function to get the id from the question
function questionToId(question){
  var result= "";
  switch(question){
    case "questionA":
      result=""
      break;
    case "questionB":
      result="";
      break;
    case "questionC":
      result="right_to_access"
      break;
    case "questionD":
      result="right_to_portability";
      break;
    case "questionE":
      result="right_to_rectify"
      break;
    case "questionF":
      result="right_to_object"
      break;
    case "questionG":
      result="right_to_object_to_automated_processing";
      break;
    case "questionH":
      result="right_to_restrict_processing"
      break;
    case "questionI":
      result="right_to_be_forgotten";
      break;
    case "questionL":
      result="right_to_be_informed_od_data_breaches"
      break;
    default:
      break;
  }
  return result;
}
//

// gdpr compliance button
gdpr_button.addEventListener('click', handleClickOnGdprButton);
//end gdpr handler




//function to generete the right questions dropdown
async function checkQuestion() {
  try {
    const response = await getMetaInformationResponse();
    questions_answers = response;
    console.log("answer",questions_answers)
    if (questions_answers["questionA"] === null) {
      createWithOnlyQuestionXExpandable("A",questions_answers)
    } else {
      
      const lastLetter = getLastAnswered(questions_answers);
      createWithOnlyQuestionXExpandable(lastLetter,questions_answers);

      for (let key in questions_answers) {
        if (key === "questionA") {
          const risp = questions_answers["questionA"][0].value;
          if (risp === "Yes") {
            await yesdropDownA();
          } else {
            await nodropDownA();
          }
        } 
        
        else if (key === "questionB" && questions_answers[key] !== null) {
          const risp = questions_answers["questionB"][0].value;
          if (risp === "Yes") {
            yesdropDownB();
          } else {
            var B = questions_answers.questionB;
            B = B.filter(item => item.value !== 'No');
            const isLast = (lastLetter === "B") ? true : false;
            nodropDownB(B,isLast);
          }
        } else if (key === "questionI" && questions_answers[key] !== null) {
          const risp = questions_answers["questionI"][0].value;
          if (risp === "Yes") {
            yesdropDownI();
          } else {
            nodropDownI();
          }

        } else if (key === "questionH" && questions_answers[key] !== null) {
          const risp = questions_answers["questionH"][0].value;
          if (risp === "Yes") {
            yesdropDownH();
          } else {
            nodropDownH();
          }
        } else if (key === "questionG" && questions_answers[key] !== null) {
          const risp = questions_answers["questionG"][0].value;
          if (risp === "Yes") {
            yesdropDownG();
          } else {
            nodropDownG();
          }
        } else if (key === "questionF" && questions_answers[key] !== null) {
          const risp = questions_answers["questionF"][0].value;
          if (risp === "Yes") {
            yesdropDownF();
          } else {
            nodropDownF();
          }
        } else if (key === "questionE" && questions_answers[key] !== null) {
          const risp = questions_answers["questionE"][0].value;
          if (risp === "Yes") {
            yesdropDownE();
          } else {
            nodropDownE();
          }
        } else if (key === "questionD" && questions_answers[key] !== null) {
          const risp = questions_answers["questionD"][0].value;
          if (risp === "Yes") {
            yesdropDownD();
          } else {
            nodropDownD();
          }
        } else if (key === "questionC" && questions_answers[key] !== null) {
          const risp = questions_answers["questionC"][0].value;
          if (risp === "Yes") {
            yesdropDownC();
          } else {
            nodropDownC();
          }
        } else if (key === "questionL" && questions_answers[key] !== null) {
          const risp = questions_answers["questionL"][0].value;
          if (risp === "Yes") {
            yesdropDownL();
          } else {
            nodropDownL();
          }
        }
      }
    }
  } catch (error) {
    console.error('Error fetching meta information:', error);
  }
}

//

//function to get the diagram
function getDiagram() {
  return new Promise((resolve, reject) => {
      viewer.saveXML({ format: true, preamble: false })
          .then(({ xml, error }) => {
              if (error) {
                  console.log(error);
                  reject(error); 
              } else {
                  resolve(xml); 
              }
          })
          .catch(error => {
              console.log(error);
              reject(error); 
          });
  });
}
//

//TODO: maybe to remove
//function to push the diagram
function pushDiagram(diagram) {
  try{
    console.log("pushDiagram",diagram);
    console.log("def",viewer.getDefinitions());
    console.log("def",viewer.setDefinitions("meta","metaInfo"))
    console.log(viewer.getDefinitions());
    viewer.importXML(diagram);
    viewer.get('canvas').zoom('fit-viewport');

  }
  catch(error){
    console.error("Error in importing xml",error);
  }
}
//

//TODO: remodel it because if there are collaborations we have a problem :(
//function to get the main process
function getMainProcess(){
  const mainProcess = elementRegistry.filter(element => {
    return element.type === 'bpmn:Process' && element.id == 'Main_Process'; 
  });
  return mainProcess.pop();
}
//

//function to check if the id is unique
function checkUniqueID(id){
  console.log("checkUniqueID",id);
  try{
    elementRegistry = viewer.get('elementRegistry');
    const uniqueID = elementRegistry.get(id);
    console.log(" searching for id: ",id,"is unique?", uniqueID)
    if(uniqueID){
      const parse = id.split('_');
      const name=parse[0];

      const elementNumber = parseInt(parse[1]);
      const nextElementNumber = elementNumber + 1;
      const nextID = `${parse[0]}_${nextElementNumber}`;
      return nextID;
      }
    else{
      return id;
    }

  }
  catch(error){
    console.log("Error in checking unique id");
  }
}
//

//funtion to create the subprocess for the questions
//id: id of the subprocess, content_label: the label is visualized in the subprocess,
//diagram_to_import: the diagram that will be inserted into the subprocess
//element: the element that will be the successor of this so i can get the parent ref
async function subProcessGeneration(id_passed, content_label, diagram_to_import, element) {
  try {
    const id = id_passed;
    const elementRegistry = viewer.get('elementRegistry');
    const not_exists = elementRegistry.get(id_passed) == undefined ;

    if(not_exists){
      const subprocess = elementFactory.createShape({
        type: 'bpmn:CallActivity',
        id: id,
        name: content_label,
        isExpanded: true,
      });

      subprocess.businessObject.id=id_passed;
      const mainProcess = element.parent;

      subprocess.businessObject.name = content_label;
      modeling.updateProperties(subprocess, { name: content_label });

      //test
      second_viewer.importXML(diagram_to_import).then(() => {
        var externalProcess;
        const elementRegistry2 = second_viewer.get('elementRegistry');

        elementRegistry2.getAll().forEach(element => {

          if(element.type==="bpmn:Participant" && element.businessObject.name=="Data Controller"){
            const ProcessID = element.businessObject.processRef.id;
            externalProcess = element;
           }
        });

        const zeebeExtension = moddle_2.create('zeebe:CalledElement', {
            type: 'bpmn:Process',
            processRef: externalProcess.businessObject.processRef.id,
        });
    
        const extensionElements = subprocess.businessObject.extensionElements || moddle_2.create('bpmn:ExtensionElements');
        extensionElements.get('values').push(zeebeExtension);
        subprocess.businessObject.extensionElements = extensionElements;
        });

    modeling.createShape(subprocess, { x: 700, y: 100 }, mainProcess);
    return subprocess;
  }
  else{
    return false;
  }

  } catch (error) {
    console.error('Si è verificato un errore durante la creazione del sottoprocesso con processo interno:', error);
    return null;
  }
}
//

//function to get the reference of an element
function getElement(id){
    const elementRegistry = viewer.get("elementRegistry");
    const element = elementRegistry.get(id);
    if (element) {
      return element;
    } else {
      console.log("Element not found with ID:", id);
      return null;
    }
}
//


//function to get the reference of the previous element of a certain element 
function getPreviousElement(referenceElement) {
  elementRegistry = viewer.get("elementRegistry");
  const incoming=referenceElement.incoming;
  var res = new Array();
  if(incoming[0]){
    incoming.forEach(element =>{
      const previousE = element.businessObject.sourceRef.id;
      const prev= elementRegistry.get(previousE);
      res.push(prev);
    });
    return res;
  }
  else return false;
}
//

//function to get the reference of the successor element of a certain element 
function getSuccessorElement(referenceElement) {
  elementRegistry = viewer.get("elementRegistry");
  const outgoing=referenceElement.outgoing;
  if(outgoing[0]){
  const previousE = outgoing[0].businessObject.targetRef.id;
  const res = elementRegistry.get(previousE);
  return res;
  }
  else return false;
}
//

//function to add an element between two 
//first element: the first element of the sequence 
//second element: the last element of the sequence
//new element: the element that will be added between the first and the second
function addActivityBetweenTwoElements(firstElement, secondElement, newElement) {
  const modeling = viewer.get("modeling");
  const getBoundsNew = newElement.di.bounds;

  if(firstElement==null){
    const newBoundsNew={
      x: secondElement.x - 1.5 * newElement.width,
      y:secondElement.y,
      width: getBoundsNew.width,
      height: getBoundsNew.height
    }
    modeling.resizeShape(newElement, newBoundsNew);

    const newSequenceFlowAttrsOutgoing = {
      type: "bpmn:SequenceFlow"
    };
    modeling.createConnection(newElement, secondElement, newSequenceFlowAttrsOutgoing, secondElement.parent); 
  }
  else{
    const newX = (firstElement.x + newElement.width) ;
    const newY = (firstElement.type=="bpmn:StartEvent" || firstElement.type=="bpmn:EndEvent") ? firstElement.y - 22  : firstElement.y;

    const outgoingFlow = firstElement.outgoing[0];
    if(outgoingFlow) modeling.removeConnection(outgoingFlow);

    const to_shift= newElement.di.bounds.width;
    const newBoundsNew={
      x: newX,
      y:newY,
      width: getBoundsNew.width,
      height: getBoundsNew.height
    }
    modeling.resizeShape(newElement, newBoundsNew);

    const newSequenceFlowAttrsIncoming = {
      type: "bpmn:SequenceFlow"
    };
    modeling.createConnection(firstElement, newElement, newSequenceFlowAttrsIncoming, firstElement.parent);
    

    const newSequenceFlowAttrsOutgoing = {
      type: "bpmn:SequenceFlow"
    };
    modeling.createConnection(newElement, secondElement, newSequenceFlowAttrsOutgoing, secondElement.parent);  
  }
  reorderDiagram();
}
//


//function to get the set of ordered elements, ordered by their sequence flow 
//all the elements but not the sequence flow or parrtecipant or collaboration
function getOrderedSub(){
  elementRegistry = viewer.get("elementRegistry");
  const allElements = elementRegistry.getAll();

  const new_set=new Array();
  var starts = allElements.filter(element => allBpmnElements.some(item=> item === element.type));
  while(starts[0]){
      const exist = starts.filter(element=> element.type=="bpmn:startEvent" || element.type=="bpmn:StartEvent")[0];
      if(exist) starts = starts - exist;
      const start = exist ? exist : starts.splice(-1, 1)[0];
      if(!new_set.some(item=> item == start)) {
        new_set.push(start);
      }
      var first = start;
      while(hasOutgoing(first)){
        const next = hasOutgoing(first)
        if(!new_set.some(item=> item == next)) {
          new_set.push(next);
        }
        first = next;
      }
    
  }
  //to add the non connected ones
  var last = allElements.filter(element => allBpmnElements.some(item=> item == element.type));
  last.forEach(element => {
    if (!new_set.some(item => item == element)){
      new_set.push(element);
    }
  })
  //

  return new_set;
}
//

//function to say if an element has a successor and in the case, return it
function hasOutgoing(element){
  elementRegistry=viewer.get("elementRegistry");
  const outgoing=element.outgoing[0];
  if(outgoing){
    const target=outgoing.businessObject.targetRef.id;
    return elementRegistry.get(target)
  }
  else return false;
}
//

//function to reorder the diagram
export function reorderDiagram() {
  const sub=getOrderedSub();
  console.log("sub to reorder diagram",sub)
  sub.forEach(element => {
    const previousElementSet = getPreviousElement(element);
    //console.log("previous element set ",previousElementSet);
    if(previousElementSet){
      previousElementSet.forEach(previousElement => {
        const compare = (previousElement.width < 100 ) ? 70 : 150; 
        const diff = element.x - previousElement.x;
        const add = compare - diff;

        //console.log("element",element.businessObject.name,"\nprevious",previousElement.businessObject.name,"id: ",previousElement.id,"\ncompare: ",compare,"\ndiff: ",diff,"\nadd: ",add)

        if(diff < compare){
          const incomingElementSet = element.incoming;
          //console.log("incoming set",incomingElementSet)
          if(incomingElementSet.length > 0){
            for(var i=0; i< incomingElementSet.length; i++){
              var incomingElement=incomingElementSet[i];
              //console.log("incoming inside ",incomingElement.businessObject)
              if(incomingElement.businessObject.sourceRef.id == previousElement.id){

                modeling.removeConnection(incomingElement);
                modeling.resizeShape(element, {x: element.x + add , y: element.y, width: element.width, height:element.di.bounds.height});
                const newSequenceFlowAttrsIncoming = {
                  type: "bpmn:SequenceFlow"
                };
                modeling.createConnection(previousElement, element, newSequenceFlowAttrsIncoming, element.parent);
             }

            };
        }
        }

        else if(diff > compare){
          const remove = diff - compare;
          const incomingElementSet = element.incoming;
          //console.log("incoming set 2",incomingElementSet)

          if(incomingElementSet.length > 0){
            incomingElementSet.forEach(incomingElement => {
              //console.log("incoming 2 inside ",incomingElement,incomingElement.businessObject.sourceRef,previousElement,incomingElement.businessObject.sourceRef.id == previousElement.id)

              if(incomingElement.businessObject.sourceRef.id == previousElement.id){
                modeling.removeConnection(incomingElement);
                modeling.resizeShape(element, {x: element.x - remove , y: element.y, width: element.width, height:element.di.bounds.height});
                  const newSequenceFlowAttrsIncoming = {
                    type: "bpmn:SequenceFlow"
                  };
                modeling.createConnection(previousElement, element, newSequenceFlowAttrsIncoming, element.parent);
              }
          });
        }
        }    
    });
    }
  });
  viewer.get("canvas").zoom('fit-viewport');
}
//

//function to get incoming sequence flow element
function getIncoming(element){
  elementRegistry=viewer.get("elementRegistry");
  const incoming = element.incoming[0];
    return incoming;
}
//

//function to handle the side bar close/open function
//open: you want to open the side bar? 
export function handleSideBar(open){
  if(open){
    eventBus.fire("TOGGLE_MODE_EVENT", {
      exportMode: true 
    });  
    mode.textContent = "GDPR Mode"
    const visualized = localStorage.getItem("popUpVisualized") == "true" ? true : false;
    if(!visualized){
      window.alert("You are now in GDPR mode, and the editor is disabled. \n If you want to edit again, you must close the GDPR panel.");
      localStorage.setItem("popUpVisualized", "true");
    }
  }else{
    eventBus.fire("TOGGLE_MODE_EVENT", {
      exportMode: false 
    });       
    edit.textContent = "Edit Mode";
  }

}
//

//function to extract the set of activities available in the diagram
export async function getActivities() {

    elementRegistry=viewer.get('elementRegistry');
    const allElements=elementRegistry.getAll();

    var activities = new Array();

    if(allElements){
      allElements.forEach(element=>{
        if(bpmnActivityTypes.some(item => item == element.type )){
          const id= element.id;
          const name= element.businessObject.name;
          activities.push({id ,name });
        }
      })
      return activities;
    }
}
//

//if i want to remove the path added for the gdpr compliance
//activity: the activity after the path so the activity for which i imserted the path
//type: the type of path i want to remove ex. consent for data
export function removeConsentFromActivity(activity,type){
  elementRegistry=viewer.get('elementRegistry');
  try{
    var i=0;
    var name=type+activity.id+"_"+i;
    var toRemove = elementRegistry.get(name);
    while(toRemove){
      modeling.removeShape(toRemove);
      i++;
      var name=type+activity.id+"_"+i;
      toRemove = elementRegistry.get(name);
    }
    reorderDiagram();
  }catch(e){
    console.error("Some problem in removing path gdpr added to activity")
  }
}
//

//
function getStartFirst(){
  elementRegistry=viewer.get('elementRegistry');
  const allElements= elementRegistry.getAll();
  allElements.forEach(element => {
    if(element.type=="bpmn:StartEvent" || element.type=="bpmn:startEvent" && element.id== "StartEvent_1"){
      return element;
    }
  });
  return null; 
}
//


//function to add the group where i'm going to insert the path for gdpr compliance
export function createAGroup(){

  modeling = viewer.get('modeling'); 
  canvas_ref = viewer.get('canvas');
  const parentRoot = canvas_ref.getRootElement();

  const start = getStartFirst();
  var x = 0;
  var y = 0;
  
  if(start!=null){
    x = (start.x - 15000);
    y = (start.y); 
  }
  const groupShape = elementFactory.createShape({
    type: "bpmn:Group",
    width: 200, 
    height: 50, 
    id: "GdprGroup"
  });

  groupShape.id = "GdprGroup"; 

  modeling.createShape(groupShape, { x: 0, y: 0 }, parentRoot);
  modeling.resizeShape(groupShape, {x: x - 300 , y: y - 25, width: 420, height: 50});

  viewer.get("canvas").zoom('fit-viewport');
}
//

//function to check if the group containing the path already exists
export function existGdprGroup(){
  elementRegistry=viewer.get("elementRegistry");
  const allElements = elementRegistry.getAll();
  var result = false;
  allElements.forEach(element => {
    if(element.id=="GdprGroup"){
      result = true;
    }
  });
  return result;
}
//

//function to find a free space in the group
async function findFreeY(y_ex,max_height) {
  const questions= checkMetaInfo().values[0];
  elementRegistry=viewer.get("elementRegistry");
  var elem;
  var y = y_ex + 60;
  const lastObject = getLastAnswered(questions);
  switch(lastObject){
    case "B":
      break;
    case "C":
      elem = elementRegistry.get("right_to_access");
      break;
    case "D":
      elem=elementRegistry.get("right_to_portability");
      break;
    case "E":
      elem =elementRegistry.get("right_to_rectify");
      break;
    case "F":
      elem= elementRegistry.get("right_to_object");
      break;
    case "G":
      elem= elementRegistry.get("right_to_object_to_automated_processing");
      break;
    case "H":
      elem= elementRegistry.get("right_to_restrict_processing");
      break;  
    case "I":
      elem= elementRegistry.get("right_to_be_forgotten");
      break;
    case "L":
      elem= elementRegistry.get("right_to_be_notified_of_data_breaches");
      break;
    }
  
    if(elem){
      y = elem.y + 80;
    }
    if(max_height < y + 100){
      const group = elementRegistry.get("GdprGroup");
      modeling.resizeShape(group, {x: group.x , y: group.y , width: group.width, height: group.height+300});

      modeling.updateProperties(group, {height: max_height + 300});
    }
    return y; 
}
//

//function to add a path in the group 
//diagram: the diagram that will be inserted into the call activity 
//start event title: the label under the start event 
//end event title: the label under the end event 
//path name: the macro title of the question ex: right to access
//start type: the type of the start event signal/message
export async function addSubEvent(diagram, start_event_title, end_event_title, path_name,start_type){
  elementRegistry=viewer.get("elementRegistry");
  const gdpr = elementRegistry.get("GdprGroup");
  const parent = gdpr.parent;
  const y= await findFreeY(gdpr.y,gdpr.height);

  const start_event = elementFactory.createShape({
    type: "bpmn:StartEvent",
    id: path_name+"_start",
    width: 36, 
    height:36, 
    eventDefinitionType: start_type,
  });

  start_event.businessObject.name = start_event_title;
  start_event.businessObject.id=path_name+"_start";

  modeling.createShape(start_event, {x:0 , y:0}, parent);
  modeling.resizeShape(start_event, {x: gdpr.x + 70 , y: y, width: start_event.width, height: start_event.height});

  const end_event = elementFactory.createShape({
    type: "bpmn:EndEvent",
    id: path_name+"_end" ,  
    width: 36,  
    height: 36,
  });

  end_event.businessObject.id=path_name+"_end";
  end_event.businessObject.name= end_event_title;

  modeling.createShape(end_event, {x:0 , y:0}, parent);
  modeling.resizeShape(end_event, {x: gdpr.x + 350 , y: y, width: end_event.width, height: end_event.height});

  const title_splitted = path_name.split("_");
  var title="";
  title_splitted.forEach(part=>{
    var new_part ="";
    if (title == "") {
      new_part = part.charAt(0).toUpperCase() + part.slice(1)
    }
    title = (new_part=="") ? title + part + " ": title + new_part + " ";
  });

  const subprocess = await subProcessGeneration(path_name, title, diagram, end_event);

  await addActivityBetweenTwoElements(start_event, end_event, subprocess);
}
//

function deleteGdprPath(id){
  elementRegistry=viewer.get("elementRegistry");
  const allElements = elementRegistry.getAll();
  try{
    allElements.forEach(item => {
      const element= item.id;
      let lastIndex = element.lastIndexOf('_'); 
      let result = element.substring(0, lastIndex);
      console.log("result",result);

      if(result == id || element == id){
        console.log("To delete",item);
        modeling.removeShape(item);
      }
    })
  }catch(e) {
      console.error("Error in delete Gdpr path: " + e.message);
  }
}

//function to check if a gdpr group exists
export function existsGdprPath(id){
  elementRegistry=viewer.get("elementRegistry");
  const exists = elementRegistry.get(id) ? true : false;
  return exists;
}
//


export {getDiagram,pushDiagram,editMetaInfo,subProcessGeneration,getElement,getPreviousElement,addActivityBetweenTwoElements}
