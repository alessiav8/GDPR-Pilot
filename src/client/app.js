import BpmnJS from "bpmn-js/dist/bpmn-modeler.production.min.js";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import NavigatedViewer from "bpmn-js/dist/bpmn-navigated-viewer.production.min.js";
import BpmnAlignElements from "bpmn-js/lib/features/align-elements/BpmnAlignElements.js";
import BpmnModdle from "bpmn-moddle";
import BpmnModeler from "bpmn-js/lib/Modeler";
import AlignElements from "diagram-js/lib/features/align-elements/AlignElements.js";
import DistributeElements from "diagram-js/lib/features/distribute-elements/DistributeElements.js";

import { getNewShapePosition } from "bpmn-js/lib/features/auto-place/BpmnAutoPlaceUtil.js";
import camundaModdle from "camunda-bpmn-moddle/resources/camunda.json";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { query, classes } from "min-dom";

import disableModeling from "../customizations/DisableModeling.js";
import DisabledTypeChangeContextPadProvider from "../customizations/contextPadExtension.js";

import diagram from "../../resources/diagram.bpmn";
import diagram_two_activities from "../../resources/diagram_two_activities.bpmn";
import confirmForGDPRPath from "../customizations/confirm";
import diagram_to_test_part from "../../resources/diagram_to_test_part.bpmn";

import consent_to_use_the_data from "../../resources/consent_to_use_the_data.bpmn";
import right_to_access from "../../resources/right_to_be_consent.bpmn";
import right_to_portability from "../../resources/right_of_portability.bpmn";
import right_to_rectify from "../../resources/right_to_rectify.bpmn";
import right_to_object from "../../resources/right_to_object.bpmn";
import right_to_object_to_automated_processing from "../../resources/right_to_object_to_automated_processing.bpmn";
import right_to_restrict_processing from "../../resources/right_to_restrict_processing.bpmn";
import right_to_be_forgotten from "../../resources/right_to_be_forgotten.bpmn";
import right_to_be_informed_of_data_breaches from "../../resources/data_breach.bpmn";
import diagram_to_test_text_generation from "../../resources/diagram_to_test_text_generation.bpmn";
import diagram_goal_to_achieve from "../../resources/diagram_goal_to_achieve.bpmn";
import {
  yesdropDownA,
  nodropDownA,
  nodropDownB,
  yesHandler,
  noHandler,
  createWithOnlyQuestionXExpandable,
  getLastAnswered,
  removeChatGPTTipFromAll,
} from "./questions.js";
import {
  removeUlFromDropDown,
  closeSideBarSurvey,
  getMetaInformationResponse,
  isGdprCompliant,
  setGdprButtonCompleted,
  setJsonData,
  displayDynamicAlert,
  displayDynamicPopUp,
} from "./support.js";
import axios from "axios";
import zeebeModdleDescriptor from "zeebe-bpmn-moddle/resources/zeebe";
const zeebeModdle = require("zeebe-bpmn-moddle/resources/zeebe.json");
var MetaPackage = require("../customizations/metaInfo.json");

var moddle = new BpmnModdle({ camunda: camundaModdle });
const moddle_2 = new BpmnModdle({ zeebe: zeebeModdle });
const second_viewer = new BpmnModeler({});
var secondViewerOnly = new NavigatedViewer({});

var viewer = new BpmnJS({
  container: "#canvas",
  moddleExtensions: {
    meta: MetaPackage,
    zeebe: zeebeModdleDescriptor,
  },
  additionalModules: [disableModeling, confirmForGDPRPath, BpmnAlignElements],
});

//statements
const export_button = document.getElementById("export_button");
const import_button = document.getElementById("import_button");
const gdpr_button = document.getElementById("gdpr_compliant_button");
const canvas_raw = document.getElementById("canvas_raw");
const canvas = document.getElementById("canvas");
const canvas_col = document.getElementById("canvas_col");
const survey_col = document.getElementById("survey_col");
const over_canvas = document.getElementById("over_canvas");
const edit = document.getElementById("mode");
const endpoint = "http://localhost:3000";

var elementFactory;
var modeling;
var elementRegistry;
var commandStack;
var canvas_ref;
var eventBus;
var contextPad;
var modeler;
var search = new URLSearchParams(window.location.search);
var browserNavigationInProgress;
var questions_answers;
var originalRootElement;
var search = new URLSearchParams(window.location.search);
var browserNavigationInProgress;
var current_diagram = diagram_two_activities;
var alienator;
var distributor;

//gdpr questions
const YA = document.getElementById("yes_dropDownA");
const NA = document.getElementById("no_dropDownA");
//end gdpr questions
const questionLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "L"];
const bpmnActivityTypes = [
  "bpmn:task",
  "bpmn:Task",
  "bpmn:serviceTask",
  "bpmn:ServiceTask",
  "bpmn:userTask",
  "bpmn:UserTask",
  "bpmn:scriptTask",
  "bpmn:ScriptTask",
  "bpmn:businessRuleTask",
  "bpmn:BusinessRuleTask",
  "bpmn:sendTask",
  "bpmn:SendTask",
  "bpmn:receiveTask",
  "bpmn:ReceiveTask",
  "bpmn:manualTask",
  "bpmn:ManualTask",
  "bpmn:SubProcess",
  "bpmn:subProcess",
  "bpmn:IntermediateThrowEvent",
];
const rights = [
  "right_to_access",
  "right_to_portability",
  "right_to_rectify",
  "right_to_object",
  "right_to_object_to_automated_processing",
  "right_to_restrict_processing",
  "right_to_be_forgotten",
  "right_to_be_informed_of_data_breaches",
];
const allBpmnElements = bpmnActivityTypes.concat([
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
  "bpmn:ErrorEventDefinition",
  "bpmn:IntermediateCatchEvent",
  "bpmn:BoundaryEvent",
  "bpmn:DataStoreReference",
  "bpmn:DataObjectReference",
  "bpmn:DataObjectAssociation",
  "bpmn:DataInputAssociation",
  "bpmn:Group",
  "label",
]);
const gdprActivityQuestionsPrefix = ["consent"];

const GatewayTypes = [
  "bpmn:ExclusiveGateway",
  "bpmn:InclusiveGateway",
  "bpmn:ParallelGateway",
  "bpmn:ComplexGateway",
  "bpmn:EventBasedGateway",
];
//

//this function returns true to me if there is an extended element that has a meta tag in it
function getExtension(element, type) {
  if (!element.extensionElements) {
    return null;
  }
  if (Array.isArray(element.extensionElements)) {
    return element.extensionElements.some(function (e) {
      return e.values.some(function (meta) {
        return meta.$instanceOf(type);
      });
    });
  } else {
    return element.extensionElements.values.some(function (meta) {
      return meta.$instanceOf(type);
    });
  }
}
//

//function that loads the first diagram displayed at every load
document.addEventListener("DOMContentLoaded", async function () {
  await loadDiagram(diagram_goal_to_achieve);
  localStorage.setItem("popUpVisualized", false);
});
// end function to load the first diagram

//function to call the API of chatGPT
//message:the message i want to send to chatGPT
export async function callChatGpt(message) {
  const url = "http://localhost:3000/api/call_chat_gpt";

  try {
    const response = await axios.get(url, {
      params: {
        message:
          "Consider to be a GDPR(General Data Protection Regulation) expert that have to analyze how much a process is GDPR compliant. When I talk about different participant, you have to find in the text different {Participant} inside of each of theme there are different processes and they can communicate. The activities named 'Right to be Informed and to consent' must be taken into account just for the right to consent analysis, if i provide some other definition, like 'Right to access' or 'Right to Object' ecc.. please ignore those activities. " +
          message,
        withCredentials: true,
      },

      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("There was a problem with the request:", error);
    throw error;
  }
}
//export API_KEY=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©

//function to load the diagram through importXML
//diagram: the xml of the diagram i want to import in the canvas
async function loadDiagram(diagram) {
  try {
    const res = viewer
      .importXML(diagram)
      .then(async () => {
        viewer.get("canvas").zoom("fit-viewport");

        elementFactory = viewer.get("elementFactory");
        modeling = viewer.get("modeling");
        elementRegistry = viewer.get("elementRegistry");
        canvas_ref = viewer.get("canvas");
        eventBus = viewer.get("eventBus");
        contextPad = viewer.get("contextPad");
        commandStack = viewer.get("commandStack");
        var rules = viewer.get("rules");
        var bpmnReplace = viewer.get("bpmnReplace");
        var translate = viewer.get("translate");
        var disabledTypeChangeContextPadProvider =
          new DisabledTypeChangeContextPadProvider(
            contextPad,
            bpmnReplace,
            elementRegistry,
            translate,
            viewer,
            secondViewerOnly
          );
        alienator = new AlignElements(modeling, rules);
        distributor = new DistributeElements(modeling, rules);

        // changeID();
        checkMetaInfo();
        console.log("elementRegistry: ", elementRegistry);

        //this prevent the modification of the id when someone change the type of something
        eventBus.on("element.updateId", function (event) {
          event.preventDefault();
          return;
        });
        //

        //handle the remotion of a gdpr path
        viewer.on("shape.removed", function (event) {
          try {
            var element = event.element;
            const name = element.businessObject.id;
            if (name) {
              getMetaInformationResponse().then((response) => {
                if (name.startsWith("consent")) {
                  const questionB = response["questionB"];
                  if (questionB != null) {
                    var activity_id =
                      name.split("_")[1] + "_" + name.split("_")[2];
                    const new_meta = questionB.filter(
                      (element) =>
                        element.id != "response" && element.id != activity_id
                    );
                    editMetaInfo("B", setJsonData("No", new_meta));
                  }
                }

                if (name.startsWith("right")) {
                  displayDynamicAlert(
                    "This action impact the gdpr compliance level"
                  );
                  const splittedNameRight = name.split("_");
                  const suffixLength =
                    splittedNameRight[splittedNameRight.length - 1].length + 1;
                  const newName =
                    splittedNameRight[splittedNameRight.length - 1] ==
                      "start" ||
                    splittedNameRight[splittedNameRight.length - 1] == "end"
                      ? name.substring(0, name.length - suffixLength)
                      : name;
                  switch (newName) {
                    case "right_to_access":
                      const questionC = response["questionC"];
                      if (questionC != null) {
                        editMetaInfo("C", null);
                        removeStartEnd(name);
                      }
                      break;

                    case "right_to_portability":
                      const questionD = response["questionD"];
                      if (questionD != null) {
                        editMetaInfo("D", null);
                        removeStartEnd(name);
                      }
                      break;

                    case "right_to_rectify":
                      const questionE = response["questionE"];
                      if (questionE != null) {
                        editMetaInfo("E", null);
                        removeStartEnd(name);
                      }
                      break;

                    case "right_to_object":
                      const questionF = response["questionF"];
                      if (questionF != null) {
                        editMetaInfo("F", null);
                        removeStartEnd(name);
                      }
                      break;

                    case "right_to_object_to_automated_processing":
                      const questionG = response["questionG"];
                      if (questionG != null) {
                        editMetaInfo("G", null);
                        removeStartEnd(name);
                      }
                      break;

                    case "right_to_restrict_processing":
                      const questionH = response["questionH"];
                      if (questionH != null) {
                        editMetaInfo("H", null);
                        removeStartEnd(name);
                      }
                      break;

                    case "right_to_be_forgotten":
                      const questionI = response["questionI"];
                      if (questionI != null) {
                        editMetaInfo("I", null);
                        removeStartEnd(name);
                      }
                      break;

                    case "right_to_be_informed_of_data_breaches":
                      const questionL = response["questionL"];
                      if (questionL != null) {
                        editMetaInfo("L", null);
                        removeStartEnd(name);
                      }
                      break;
                    default:
                      break;
                  }
                }
              });
            }
          } catch (e) {
            console.error("error in shape.removed");
          }
        });
        //

        /* eventBus.on('connect.end', function(event) {
                var context = event.context,
                    source = context.source,
                    hover = context.hover;
                console.log("element",element,event)

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
              });*/
        console.log("eventBus", eventBus);

        eventBus.on("element.click", handleClick);

        eventBus.on("element.changed", function (event) {
          const element = event.element; //sequence flow element
          if (element && element.type === "bpmn:SequenceFlow") {
            const source = element.source; //la sorgente della freccia
            if (source != null) {
              const newEnd = element.target; //dove punta la freccia nuova
              const idSplitted = source.id.split("_");
              const activityIdInConsent = idSplitted[1] + "_" + idSplitted[2];
              const target = elementRegistry.get(activityIdInConsent); //activity that generated the Call Activity
              var hasStillConsent = false;
              var isTheSameActivity = false;
              if (target && target.incoming) {
                const set = target.incoming; //le frecce entranti nell'attività generatrici del consent
                for (var i = 0; i < set.length; i++) {
                  const sourceTarget = set[i].source
                    ? set[i].source.id.split("_")[0]
                    : false;
                  if (sourceTarget == "consent") {
                    hasStillConsent = true; //l'attività vecchia ha ancora un collegamento ad un consent
                    if (set[i].source == source) isTheSameActivity = true;
                    break;
                  }
                }
              }

              if (idSplitted[0] == "consent") {
                //se la source è una consent activity

                if (target.id != newEnd.id) {
                  //se la nuova attività è diversa da quella che ha generato il gdpr path
                  //const newEnd = elementRegistry.get(element.businessObject.targetRef.id);
                  if (
                    newEnd.type != "bpmn:StartEvent" &&
                    newEnd.type != "bpmn:startEvent" &&
                    newEnd.type != "bpmn:EndEvent" &&
                    newEnd.type != "bpmn:endEvent"
                  ) {
                    if (isTheSameActivity == false) {
                      const new_id =
                        "consent_" + newEnd.id + "_" + idSplitted[3];
                      modeling.updateProperties(source, {
                        id: new_id,
                      });
                    }
                    //qui faccio l'edit di quello che c'è in questionB per eliminare eventualmente il vecchio collegamento
                    //e inserire quello nuovo
                    //controllare che la vecchia non sia legata magari ad un altro consent

                    const newSetQuestionB = new Array();
                    getAnswerQuestionX("questionB").then((response) => {
                      response.forEach((q) => {
                        if (q.id == target.id) {
                          newSetQuestionB.push({
                            id: newEnd.id,
                            value: newEnd.businessObject.name,
                          });
                          if (hasStillConsent) newSetQuestionB.push(q);
                        } else {
                          newSetQuestionB.push(q);
                        }
                      });
                      editMetaInfo("B", setJsonData("No", newSetQuestionB));
                    });
                  } else {
                    modeling.removeConnection(element);
                  }
                  //TODO:
                  /*else{
                        const newNameUse = idSplitted[0]+"_";
                        modeling.updateProperties(source, {
                          id: newNameUse,
                        });    
                      }*/
                } /*else {
                    if (bpmnActivityTypes.some((item) => item == newEnd.type)) {
                      const newSetQuestionB = new Array();
                      getAnswerQuestionX("questionB").then((response) => {
                        response.forEach((q) => {
                          newSetQuestionB.push(q);
                        });
                        newSetQuestionB.push({
                          id: newEnd.id,
                          value: newEnd.businessObject.name,
                        });
                        editMetaInfo("B", setJsonData("No", newSetQuestionB));
                      });
                    }
                  }*/
              }
            }
          }
        });
      })
      .catch((error) => {
        console.error("Errore nell'importazione dell'XML:", error);
      });
  } catch (err) {
    console.error("Si è verificato un errore:", err);
  }
}
//end function to load the diagram

async function handleClick(event) {
  const elementClicked = event.element;
  const isBOpen =
    localStorage.getItem("isOpenB") == null
      ? null
      : localStorage.getItem("isOpenB") == "true"
      ? true
      : false;
  const dropDownB = document.getElementById("dropDownB");
  const collapsed = dropDownB ? dropDownB.querySelector(".btn") : null;

  if (dropDownB && collapsed) {
    const buttonInside = dropDownB.querySelector(".btn-light");
    const buttonInsideId = buttonInside ? buttonInside.id : null;
    const isDifferent =
      buttonInsideId &&
      buttonInsideId != "yes_dropDownB" &&
      buttonInsideId != "no_dropDownB"
        ? true
        : false;
    const isCollapsed =
      (collapsed && collapsed.ariaExpanded == "true") ||
      collapsed.ariaExpanded == null
        ? true
        : false;
    if (
      isDifferent &&
      bpmnActivityTypes.some((item) => item == elementClicked.type) &&
      isCollapsed
    ) {
      // if(isBOpen && bpmnActivityTypes.some(item=> item == elementClicked.type)){ //se B è aperto
      const check = document.getElementById("checkbox_" + elementClicked.id);

      if (elementClicked.di.stroke == null) {
        //se non è già selezionato
        modeling.setColor([elementClicked], {
          stroke: "rgb(44, 169, 18)",
        });
        if (check) check.checked = true;
      } else {
        modeling.setColor([elementClicked], null);
        if (check) check.checked = false;
      }
    }
  }
}

//function to edit the metas of B
//idActivity: id of the activity that was conneted to the consent path
async function editMetaB(idActivity) {
  elementRegistry = viewer.get("elementRegistry");
  var questionB = await getAnswerQuestionX("questionB");
  var result = new Array();
  if (idActivity && questionB.length > 1) {
    questionB = questionB.filter((item) => item.id != idActivity);
    questionB.forEach((item) => {
      const activity = elementRegistry.get(item.id);
      if (!result.some((element) => element.id == activity.id)) {
        result.push({ id: activity.id, value: activity.businessObject.id });
      }
    });
    editMetaInfo("B", setJsonData("No", result));
  }
}
//

//function create backArrow subProcess
function backArrowSubProcess() {
  gdpr_button.disabled = true;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("width", "50");
  svg.setAttribute("height", "50");
  svg.setAttribute("fill", "#2CA912");
  svg.setAttribute("class", "bi bi-arrow-left");
  svg.setAttribute("viewBox", "0 0 16 16");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("fill-rule", "evenodd");
  path.setAttribute(
    "d",
    "M4.354 8.354a.5.5 0 0 1 0-.708l3.293-3.293a.5.5 0 0 1 .708.708L5.707 8l2.648 2.647a.5.5 0 0 1-.708.708l-3.293-3.293a.5.5 0 0 1 0-.708z"
  );

  svg.appendChild(path);

  var closeBtn = document.createElement("span");
  closeBtn.classList.add("close-btn");
  closeBtn.style.marginBottom = "4vh";
  closeBtn.style.marginLeft = "4vh";

  closeBtn.prepend(svg);

  over_canvas.appendChild(closeBtn);

  closeBtn.addEventListener("click", () => {
    loadDiagram(current_diagram);
    over_canvas.removeChild(closeBtn);
    gdpr_button.disabled = false;
    removeChatGPTTipFromAll();
    decolorEverySelected();
  });
}
//

//auxiliary function to remove start and end from call activity
//name: id of the element
//the result of this function is the remotion of the entire gdpr path connected
function removeStartEnd(name) {
  elementRegistry = viewer.get("elementRegistry");
  const nameSplitted = name.split("_");
  if (
    nameSplitted[nameSplitted.length - 1] != "start" &&
    nameSplitted[nameSplitted.length - 1] != "end"
  ) {
    const start = elementRegistry.get(name + "_start");
    const end = elementRegistry.get(name + "_end");
    const thisAct = elementRegistry.get(name);

    if (thisAct) {
      modeling.removeShape(thisAct);
    }
    if (end) {
      modeling.removeShape(end);
    }
    if (start) {
      modeling.removeShape(start);
    }
  } else if (nameSplitted[nameSplitted.length - 1] == "start") {
    const nameWithoutEnd = name.substring(0, name.length - 6);
    const start = elementRegistry.get(nameWithoutEnd);
    const end = elementRegistry.get(nameWithoutEnd + "_end");
    const thisAct = elementRegistry.get(name);

    if (start) {
      modeling.removeShape(start);
    }
    if (end) {
      modeling.removeShape(end);
    }
    if (thisAct) {
      modeling.removeShape(thisAct);
    }
  } else if (nameSplitted[nameSplitted.length - 1] == "end") {
    const nameWithoutEnd = name.substring(0, name.length - 4);
    const end = elementRegistry.get(nameWithoutEnd);
    const start = elementRegistry.get(nameWithoutEnd + "_start");
    const thisAct = elementRegistry.get(name);

    if (end) {
      modeling.removeShape(end);
    }
    if (start) {
      modeling.removeShape(start);
    }
    if (thisAct) {
      modeling.removeShape(thisAct);
    }
  }
  const all = elementRegistry.getAll();
  var exists = false;

  for (var i = 0; i < all.length; i++) {
    if (rights.some((item) => item == all[i].id)) {
      exists = true;
      break;
    }
  }
  if (exists == false) {
    const groupName = elementRegistry.get("GdprGroup");
    if (groupName) modeling.removeShape(groupName);
  }
}

//function to change the ID for the mainProcess
function changeID() {
  const processElement = elementRegistry
    .filter((element) => {
      return element.type === "bpmn:Process" && element.parent == null;
    })
    .pop();
  if (processElement) {
    const newProcessId = "Main_Process";
    modeling.updateProperties(processElement, {
      id: newProcessId,
    });
  } else {
    console.error("Il processo con l'ID specificato non è stato trovato.");
  }
}
//

//Function to check if already have the gdpr marks or add it
function checkMetaInfo() {
  const Mod = viewer._moddle;
  const processElements = getProcessElement();

  if (processElements.length > 0) {
    var firstProcessElement = processElements[0];
    var processBusinessObject = firstProcessElement.businessObject;
    var processExtension = getExtension(
      processBusinessObject,
      "meta:ModelMetaData"
    );
    //the function returns the business object
    if (processExtension) {
      console.log("already have an extention", processExtension);
      return processBusinessObject.extensionElements;
    } else {
      const meta = Mod.create("meta:ModelMetaData");
      processBusinessObject.extensionElements = Mod.create(
        "bpmn:ExtensionElements"
      );
      processBusinessObject.extensionElements.get("values").push(meta);
      meta.gdpr_compliant = false;
      console.log(
        "not have an extention",
        processBusinessObject.extensionElements
      );
      return processBusinessObject.extensionElements;
    }
  } else {
    console.log("Nessun processo trovato nel diagramma.");
  }
}
//end checkMetaInfo

//TODO: Può esserci più di un processo?

//Function to get the element process without knowing the ID
function getProcessElement() {
  var allElements = viewer.get("elementRegistry").getAll();
  var processElements = allElements.filter(function (element) {
    if (
      element.type === "bpmn:Process" ||
      element.type === "bpmn:Collaboration" ||
      element.type === "bpmn:process" ||
      element.type === "bpmn:collaboration"
    ) {
      return element;
    }
  });
  return processElements;
}
//end function to get the element process

//function to edit MetaInfo
function editMetaInfo(question, value_to_assign) {
  const businessObject = checkMetaInfo();
  if (businessObject && businessObject.values.length > 0) {
    businessObject.values.forEach((value) => {
      if (value.$type === "meta:ModelMetaData") {
        switch (question) {
          case "A":
            value.questionA = value_to_assign;
            break;

          case "B":
            value.questionB = value_to_assign;
            break;

          case "C":
            value.questionC = value_to_assign;
            break;

          case "D":
            value.questionD = value_to_assign;
            break;

          case "E":
            value.questionE = value_to_assign;
            break;

          case "F":
            value.questionF = value_to_assign;
            break;

          case "G":
            value.questionG = value_to_assign;
            break;

          case "H":
            value.questionH = value_to_assign;
            break;

          case "I":
            value.questionI = value_to_assign;
            break;

          case "L":
            value.questionL = value_to_assign;
            break;

          case "gdpr":
            value.gdpr_compliant = value_to_assign;
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
export_button.addEventListener("click", function () {
  try {
    closeSideBarSurvey();
    handleSideBar(false);
    decolorEverySelected();
    removeChatGPTTipFromAll();
  } catch (e) {
    console.log("Error", e);
  }

  var container = document.getElementById("canvas");

  var background_container = document.createElement("div");
  background_container.classList = "background-container";

  var popup = document.createElement("div");
  popup.classList.add("popup");

  var what_is = document.createElement("div");
  what_is.innerHTML = "<strong>Insert a title for the diagram</strong>";
  what_is.style.marginLeft = "20%";

  popup.appendChild(what_is);

  var inputText = document.createElement("input");
  inputText.setAttribute("type", "text");
  inputText.setAttribute("placeholder", "Insert the title");
  inputText.setAttribute("value", "Diagram");
  inputText.style.marginTop = "1.8vh";

  popup.appendChild(inputText);

  var confirmBtn = document.createElement("button");
  confirmBtn.classList.add("btn-popup");
  confirmBtn.style.backgroundColor = "#10ad74";
  confirmBtn.style.textSize = "1vh";
  confirmBtn.textContent = "Confirm and export";

  popup.appendChild(confirmBtn);

  var closeBtn = document.createElement("span");
  closeBtn.classList.add("close-btn");
  closeBtn.textContent = "X";
  closeBtn.style.marginBottom = "0.4vh";
  popup.appendChild(closeBtn);

  background_container.appendChild(popup);
  container.appendChild(background_container);

  background_container.addEventListener("click", function (event) {
    const target_ = event.target;
    if (target_.className == "background-container") {
      container.removeChild(background_container);
    }
  });
  closeBtn.addEventListener("click", function () {
    event.stopPropagation();
    container.removeChild(background_container);
  });
  confirmBtn.addEventListener("click", function () {
    event.stopPropagation();
    var title = inputText.value;
    exportDiagram(title);
    container.removeChild(background_container);
  });
});
//part where i actually generate the xml file
function exportDiagram(title) {
  viewer
    .saveXML({ format: true })
    .then(({ xml, error }) => {
      if (error) {
        console.log(error);
      } else {
        console.log("exportDiagram", xml);
        download(xml, title + ".bpmn", "text/xml");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function download(content, filename, contentType) {
  var a = document.createElement("a");
  var file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = filename;
  a.click();
}
//

//in order to make visible and invisible the label over the export button
export_button.addEventListener("mouseover", () => {
  document.getElementById("label_export_button").innerHtml = "Export";
});

export_button.addEventListener("mouseout", () => {
  document.getElementById("label_export_button").innerHtml = "";
});
//
//end export handler

//import handler
import_button.addEventListener("mouseover", () => {
  document.getElementById("label_import_button").innerHtml = "Import";
});

import_button.addEventListener("mouseout", () => {
  document.getElementById("label_import_button").innerHtml = "";
});

import_button.addEventListener("click", () => {
  var input = document.createElement("input");
  input.type = "file";

  input.addEventListener("change", function (event) {
    var diagram_imported = event.target.files[0];
    if (diagram_imported) {
      undoProcedure();
      const reader = new FileReader();
      reader.onload = function (event) {
        const fileXML = event.target.result;
        loadDiagram(fileXML);
        eventBus.fire("TOGGLE_MODE_EVENT", {
          exportMode: false,
        });
        edit.textContent = "Edit Mode";
      };
      reader.readAsText(diagram_imported);
    }
  });

  input.click();
  try {
    closeSideBarSurvey();
    handleSideBar(false);
    decolorEverySelected();
    removeChatGPTTipFromAll();
    setGdprButtonCompleted(false);
  } catch (e) {
    console.log("Error", e);
  }
});
//end import handler

//a function to deselect every element selected before
export function cleanSelection() {
  const selection = viewer.get("selection");
  const setSelected = selection.get();
  setSelected.forEach((selectedElement) => {
    selection.deselect(selectedElement);
  });
}
//

//function to handle the click of the gdpr button ---> open side bar
async function handleClickOnGdprButton() {
  viewer.get("canvas").zoom("fit-viewport");
  handleSideBar(true);
  cleanSelection();
  const mainColumn = document.querySelector(".main-column");
  const sidebarColumn = document.querySelector(".sidebar-column");
  const canvasRaw = document.querySelector("#canvas-raw");
  const spaceBetween = document.querySelector(".space-between");
  //this part generate the space for the side bar
  if (!document.getElementById("survey_area")) {
    // Aggiorna le larghezze delle colonne
    mainColumn.style.width = "74.8%";
    sidebarColumn.style.width = "23.8%";
    sidebarColumn.style.marginLeft = "0.5%";

    sidebarColumn.style.height = canvas.clientHeight + "px";
    sidebarColumn.style.marginTop = "1vh";
    sidebarColumn.style.borderRadius = "4px";

    //start survey area handler
    const survey_area = document.createElement("div");
    survey_area.id = "survey_area";
    survey_col.appendChild(survey_area);

    //create the close button to close the side bar
    const close_survey = document.createElement("span");
    close_survey.classList.add("close-btn");
    close_survey.textContent = "X";
    close_survey.style.marginTop = "2.5vh";
    close_survey.style.marginRight = "3.5vh";

    close_survey.addEventListener("click", () => {
      closeSideBarSurvey();
      handleSideBar(false);
      decolorEverySelected();
      removeChatGPTTipFromAll();
      localStorage.setItem("isOpenB", false);
    });

    survey_area.appendChild(close_survey);

    const title = "GDPR panel";
    const textNode = document.createTextNode(title);

    const divTitle = document.createElement("div");
    divTitle.className = "container-centered";
    divTitle.style.marginTop = "4vh";
    divTitle.style.marginBottom = "2vh";
    divTitle.style.fontWeight = "bold";
    divTitle.style.fontSize = "2vh";

    divTitle.appendChild(textNode);
    survey_area.appendChild(divTitle);

    const areaDropDowns = document.createElement("div");
    areaDropDowns.className = "container";
    areaDropDowns.id = "areaDropDowns";
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
    const leftValue = areaWidth / 2 - undo_button.offsetWidth / 2;
    undo.style.marginLeft = `${leftValue}px`;
    undo_button.addEventListener("click", handleUndoGdpr);
    checkQuestion();
  }
  try {
    const currentXML = await fromXMLToText();
    const descriptionReq = await callChatGpt(
      "I give you the textual description of a bpmn process, can you give me back the description of the objective of this process? Just a brief description of at most 30 lines." +
        currentXML
    );
    const description = descriptionReq.content;
    localStorage.setItem("currentXml", currentXML);
    localStorage.setItem("description", description);
    console.log(
      "description: " + description,
      "\ncurrentTransformationDiagram: \n",
      currentXML
    );
  } catch (e) {
    console.error("Error", e);
  }
}
//

//function to get back the xml of the current diagram
export async function getXMLOfTheCurrentBpmn() {
  return new Promise((resolve, reject) => {
    viewer
      .saveXML({ format: true })
      .then(({ xml, error }) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(xml);
        }
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
}
//

//function to handle the undo of everything we made for the gdpr compliance
//i have to edit the meta info
//to remove every path added
function handleUndoGdpr() {
  elementRegistry = viewer.get("elementRegistry");
  displayDynamicPopUp("Are you sure?").then((conferma) => {
    if (conferma) {
      undoProcedure();
    }
    decolorEverySelected();
  });
}
//

function undoProcedure() {
  setGdprButtonCompleted(false);
  getMetaInformationResponse().then((response) => {
    for (let question in response) {
      if (response[question] != null) {
        switch (question) {
          case "gdpr_compliant":
            editMetaInfo("gdpr", false);
            break;
          case "questionA":
            editMetaInfo("A", null);
          case "questionB":
            response[question].forEach((element) => {
              if (element.id != "response") {
                const activity = elementRegistry.get(element.id);
                removeConsentFromActivity(activity, "consent_");
              }
            });
            editMetaInfo("B", null);
            break;

          case "questionC":
          case "questionD":
          case "questionE":
          case "questionF":
          case "questionG":
          case "questionH":
          case "questionI":
          case "questionL":
            const id = questionToId(question);
            deleteGdprPath(id);
            const letter = question[question.length - 1];
            editMetaInfo(letter, null);
            break;
          default:
            break;
        }
      }
    }
    const group = elementRegistry.get("GdprGroup");
    if (group) {
      modeling.removeShape(group);
    }
    closeSideBarSurvey();
    handleSideBar(false);
    removeChatGPTTipFromAll();
    decolorEverySelected();
    reorderDiagram();
    viewer.get("canvas").zoom("fit-viewport");
  });
  setGdprButtonCompleted(false);
}

//function to get the id from the question
function questionToId(question) {
  var result = "";
  switch (question) {
    case "questionC":
      result = "right_to_access";
      break;
    case "questionD":
      result = "right_to_portability";
      break;
    case "questionE":
      result = "right_to_rectify";
      break;
    case "questionF":
      result = "right_to_object";
      break;
    case "questionG":
      result = "right_to_object_to_automated_processing";
      break;
    case "questionH":
      result = "right_to_restrict_processing";
      break;
    case "questionI":
      result = "right_to_be_forgotten";
      break;
    case "questionL":
      result = "right_to_be_informed_of_data_breaches";
      break;
    default:
      break;
  }
  return result;
}
//

// gdpr compliance button
gdpr_button.addEventListener("click", handleClickOnGdprButton);
//end gdpr handler

//function to generete the right questions dropdown
async function checkQuestion() {
  try {
    const response = await getMetaInformationResponse();
    questions_answers = response;
    if (questions_answers["questionA"] === null) {
      createWithOnlyQuestionXExpandable("A", questions_answers);
    } else {
      const lastLetter = getLastAnswered(questions_answers);
      createWithOnlyQuestionXExpandable(lastLetter, questions_answers);

      for (let key in questions_answers) {
        if (key === "questionA") {
          const risp = questions_answers["questionA"][0].value;
          if (risp === "Yes") {
            await yesdropDownA();
          } else {
            await nodropDownA();
          }
        } else if (key === "questionB" && questions_answers[key] !== null) {
          const risp = questions_answers["questionB"][0].value;
          if (risp === "Yes") {
            yesHandler("B", "C");
          } else {
            var B = questions_answers.questionB;
            B = B.filter((item) => item.value !== "No");
            const isLast = lastLetter === "B" ? true : false;
            nodropDownB(B, isLast);
          }
        } else if (key === "questionI" && questions_answers[key] !== null) {
          const risp = questions_answers["questionI"][0].value;
          if (risp === "Yes") {
            yesHandler("I", "L");
          } else {
            noHandler(
              right_to_be_forgotten,
              "Request to be Forgotten Received",
              "Request to be Forgotten fulfilled",
              "right_to_be_forgotten",
              "bpmn:MessageEventDefinition",
              "I",
              "L"
            );
          }
        } else if (key === "questionH" && questions_answers[key] !== null) {
          const risp = questions_answers["questionH"][0].value;
          if (risp === "Yes") {
            yesHandler("H", "I");
          } else {
            noHandler(
              right_to_restrict_processing,
              "Processing Restriction Request Received",
              "Processing Restrict Request fulfilled",
              "right_to_restrict_processing",
              "bpmn:MessageEventDefinition",
              "H",
              "I"
            );
          }
        } else if (key === "questionG" && questions_answers[key] !== null) {
          const risp = questions_answers["questionG"][0].value;
          if (risp === "Yes") {
            yesHandler("G", "H");
          } else {
            noHandler(
              right_to_object_to_automated_processing,
              "Objection to Automated Processing Request Received",
              "Objection to Automated Processing Request fulfilled",
              "right_to_object_to_automated_processing",
              "bpmn:MessageEventDefinition",
              "G",
              "H"
            );
          }
        } else if (key === "questionF" && questions_answers[key] !== null) {
          const risp = questions_answers["questionF"][0].value;
          if (risp === "Yes") {
            yesHandler("F", "G");
          } else {
            noHandler(
              right_to_object,
              "Objection Request Received",
              "Objection Request fulfilled",
              "right_to_object",
              "bpmn:MessageEventDefinition",
              "F",
              "G"
            );
          }
        } else if (key === "questionE" && questions_answers[key] !== null) {
          const risp = questions_answers["questionE"][0].value;
          if (risp === "Yes") {
            yesHandler("E", "F");
          } else {
            noHandler(
              right_to_rectify,
              "Rectification Request Received",
              "Rectification Request fulfilled",
              "right_to_rectify",
              "bpmn:MessageEventDefinition",
              "E",
              "F"
            );
          }
        } else if (key === "questionD" && questions_answers[key] !== null) {
          const risp = questions_answers["questionD"][0].value;
          if (risp === "Yes") {
            yesHandler("D", "E");
          } else {
            noHandler(
              right_to_portability,
              "Portability Request Received",
              "Portability Request fulfilled",
              "right_to_portability",
              "bpmn:MessageEventDefinition",
              "D",
              "E"
            );
          }
        } else if (key === "questionC" && questions_answers[key] !== null) {
          const risp = questions_answers["questionC"][0].value;
          if (risp === "Yes") {
            yesHandler("C", "D");
          } else {
            noHandler(
              right_to_access,
              "Access Request Received",
              "Access Request fulfilled",
              "right_to_access",
              "bpmn:MessageEventDefinition",
              "C",
              "D"
            );
          }
        } else if (key === "questionL" && questions_answers[key] !== null) {
          const risp = questions_answers["questionL"][0].value;
          if (risp === "Yes") {
            yesHandler("L", null);
          } else {
            noHandler(
              right_to_be_informed_of_data_breaches,
              "Data Breach occurred",
              "Data Breach Managed",
              "right_to_be_informed_of_data_breaches",
              "bpmn:ErrorEventDefinition",
              "L",
              null
            );
          }
        }
      }
    }
  } catch (error) {
    console.error("Error fetching meta information:", error);
  }
}

//

//function to get the diagram
function getDiagram() {
  return new Promise((resolve, reject) => {
    viewer
      .saveXML({ format: true, preamble: false })
      .then(({ xml, error }) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(xml);
        }
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
}
//

//TODO: remodel it because if there are collaborations we have a problem :(
//function to get the main process
function getMainProcess() {
  const mainProcess = elementRegistry.filter((element) => {
    return element.type === "bpmn:Process" && element.id == "Main_Process";
  });
  return mainProcess.pop();
}
//

//function to check if the id is unique
function checkUniqueID(id) {
  console.log("checkUniqueID", id);
  try {
    elementRegistry = viewer.get("elementRegistry");
    const uniqueID = elementRegistry.get(id);
    if (uniqueID) {
      const parse = id.split("_");
      const name = parse[0];

      const elementNumber = parseInt(parse[1]);
      const nextElementNumber = elementNumber + 1;
      const nextID = `${parse[0]}_${nextElementNumber}`;
      return nextID;
    } else {
      return id;
    }
  } catch (error) {
    console.log("Error in checking unique id");
  }
}
//

//funtion to create the subprocess for the question
//id: id of the subprocess, content_label: the label is visualized in the subprocess,
//diagram_to_import: the diagram that will be inserted into the subprocess
//element: the element that will be the successor of this so i can get the parent ref
async function subProcessGeneration(
  id_passed,
  content_label,
  diagram_to_import,
  element
) {
  try {
    const id = id_passed;
    const elementRegistry = viewer.get("elementRegistry");
    const not_exists = elementRegistry.get(id_passed) == undefined;

    if (not_exists) {
      const subprocess = elementFactory.createShape({
        type: "bpmn:CallActivity",
        id: id,
        name: content_label,
        isExpanded: true,
      });

      subprocess.businessObject.id = id_passed;
      const mainProcess = element.parent;

      subprocess.businessObject.name = content_label;
      modeling.updateProperties(subprocess, { name: content_label });

      //test
      second_viewer.importXML(diagram_to_import).then(() => {
        var externalProcess;
        const elementRegistry2 = second_viewer.get("elementRegistry");
        elementRegistry2.getAll().forEach((element) => {
          if (
            element.type === "bpmn:Participant" &&
            element.businessObject.name == "Data Controller"
          ) {
            const ProcessID = element.businessObject.processRef.id;
            externalProcess = element;
          }
        });

        const zeebeExtension = moddle_2.create("zeebe:CalledElement", {
          type: "bpmn:Process",
          processRef: externalProcess.businessObject.processRef.id,
        });

        const extensionElements =
          subprocess.businessObject.extensionElements ||
          moddle_2.create("bpmn:ExtensionElements");
        extensionElements.get("values").push(zeebeExtension);
        subprocess.businessObject.extensionElements = extensionElements;
      });

      modeling.createShape(subprocess, { x: 700, y: 100 }, mainProcess);
      return subprocess;
    } else {
      return false;
    }
  } catch (error) {
    console.error(
      "Si è verificato un errore durante la creazione del sottoprocesso con processo interno:",
      error
    );
    return null;
  }
}
//

//function to get the reference of an element
function getElement(id) {
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
  const incoming = referenceElement.incoming;
  var res = new Array();
  if (incoming[0]) {
    incoming.forEach((element) => {
      const previousE = element.businessObject.sourceRef
        ? element.businessObject.sourceRef.id
        : null;
      const prev = elementRegistry.get(previousE);
      if (prev && prev.type && prev.type != " bpmn:Participant") {
        res.push(prev);
      }
    });
    return res;
  } else return false;
}
//

//function to get the reference of the successor element of a certain element
function getSuccessorElement(referenceElement) {
  elementRegistry = viewer.get("elementRegistry");
  const outgoing = referenceElement.outgoing;
  if (outgoing[0]) {
    const previousE = outgoing[0].businessObject.targetRef.id;
    const res = elementRegistry.get(previousE);
    return res;
  } else return false;
}
//

//function to add an element between two
//first element: the first element of the sequence
//second element: the last element of the sequence
//new element: the element that will be added between the first and the second
function addActivityBetweenTwoElements(
  firstElement,
  secondElement,
  newElement
) {
  const modeling = viewer.get("modeling");
  const getBoundsNew = newElement.di.bounds;

  if (firstElement == null) {
    const newBoundsNew = {
      x: secondElement.x - 1.5 * newElement.width,
      y: secondElement.y,
      width: getBoundsNew.width,
      height: getBoundsNew.height,
    };
    modeling.resizeShape(newElement, newBoundsNew);

    const newSequenceFlowAttrsOutgoing = {
      type: "bpmn:SequenceFlow",
    };

    modeling.createConnection(
      newElement,
      secondElement,
      newSequenceFlowAttrsOutgoing,
      secondElement.parent
    );
  } else {
    const newX = (secondElement.x + firstElement.x) / 2;
    var newY =
      firstElement.type == "bpmn:StartEvent" ||
      firstElement.type == "bpmn:EndEvent" ||
      firstElement.type == "bpmn:startEvent" ||
      firstElement.type == "bpmn:endEvent"
        ? firstElement.y - 22
        : firstElement.type == "bpmn:ExclusiveGateway" ||
          firstElement.type == "bpmn:ParallelGateway" ||
          firstElement.type == "bpmn:Gateway"
        ? secondElement.y
        : firstElement.y;

    const outgoingFlow = firstElement.outgoing;

    if (outgoingFlow.length > 0) {
      outgoingFlow.forEach((outgoingElem) => {
        if (
          outgoingElem.type != "bpmn:MessageFlow" &&
          outgoingElem.businessObject.targetRef.id === secondElement.id
        ) {
          modeling.removeConnection(outgoingElem);
        }
      });
    }

    const to_shift = newElement.di.bounds.width;
    const newBoundsNew = {
      x: newX,
      y: newY,
      width: getBoundsNew.width,
      height: getBoundsNew.height,
    };
    modeling.resizeShape(newElement, newBoundsNew);

    const newSequenceFlowAttrsIncoming = {
      type: "bpmn:SequenceFlow",
    };
    modeling.createConnection(
      firstElement,
      newElement,
      newSequenceFlowAttrsIncoming,
      firstElement.parent
    );

    const newSequenceFlowAttrsOutgoing = {
      type: "bpmn:SequenceFlow",
    };
    modeling.createConnection(
      newElement,
      secondElement,
      newSequenceFlowAttrsOutgoing,
      secondElement.parent
    );
  }
  alienator.trigger([firstElement, newElement, secondElement], "middle");
  reorderDiagram();
}
//

//function to say if an element has a successor and in the case, return it
function hasOutgoing(element) {
  const elementRegistry = viewer.get("elementRegistry");
  let outgoingSet = element.outgoing;

  outgoingSet = outgoingSet.filter(
    (outgoing) =>
      outgoing.type === "bpmn:SequenceFlow" ||
      outgoing.type === "bpmn:sequenceFlow"
  );

  if (outgoingSet.length > 0) {
    outgoingSet.forEach((outgoing) => {
      const target = outgoing.businessObject.targetRef.id;
      const targetRef = elementRegistry.get(target);
      if (targetRef.type !== "bpmn:Participant") outgoing.targetRef = targetRef;
    });

    outgoingSet.sort(compareByX);
    return outgoingSet[0];
  } else {
    return null;
  }
}
//

//function to get the set of ordered elements, ordered by their sequence flow
//all the elements but not the sequence flow or partecipant or collaboration
function getOrderedSub(allElements) {
  const new_set = [];
  var exist;
  // Prendo solo gli elementi che mi interessano
  let starts = allElements.filter(
    (element) => element.type == "bpmn:StartEvent"
  );
  while (starts.length > 0) {
    // Vedo se c'è uno start e prendo il primo

    // Se non c'è uno start, prendo l'ultimo elemento
    exist = starts[0];
    starts = starts.filter((element) => element.id !== exist.id);

    // Se non è già presente nel set, aggiungilo
    if (!new_set.some((item) => item === exist)) {
      new_set.push(exist);
    }

    // start diventa il nostro punto di partenza
    let first = exist;

    while (true) {
      // Finché c'è un ramo uscente prendi l'elemento collegato al ramo ed aggiungilo
      const next_to_add = hasOutgoing(first); // Prendo riferimento

      if (!next_to_add) break; // Esci dal loop se non c'è un elemento successivo

      const next = elementRegistry.get(next_to_add.businessObject.targetRef.id); // Il riferimento diventa il mio nuovo next

      if (!new_set.some((item) => item === next)) {
        new_set.push(next);
      }

      first = next;
    }
  }

  // Aggiungere gli elementi non connessi
  allElements
    .filter((element) => allBpmnElements.some((item) => item === element.type))
    .forEach((element) => {
      if (!new_set.some((item) => item === element)) {
        new_set.push(element);
      }
    });

  return new_set;
}

function compareByX(c, d) {
  elementRegistry = viewer.get("elementRegistry");
  const a = elementRegistry.get(c.businessObject.targetRef.id);
  const b = elementRegistry.get(d.businessObject.targetRef.id);
  if (a.x !== b.x) {
    return a.x - b.x;
  } else {
    return b.y - a.y;
  }
}

function getSequenceElements(sub) {
  const elementRegistry = viewer.get("elementRegistry");
  const modeling = viewer.get("modeling");
  var startEvents;
  if (!sub) {
    // Trova tutti gli elementi di tipo 'bpmn:StartEvent'
    startEvents = elementRegistry.filter(
      (element) =>
        element.type === "bpmn:StartEvent" || element.type === "bpmn:startEvent"
    );
  } else {
    startEvents = sub.filter(
      (element) =>
        element.type === "bpmn:StartEvent" || element.type === "bpmn:startEvent"
    );
  }

  const orderedElements = [];

  startEvents.forEach((startEvent) => {
    // Chiamata ricorsiva per ottenere tutti gli elementi in sequenza partendo dal startEvent
    addSequence(startEvent, orderedElements, elementRegistry);
  });

  return orderedElements;
}

function addSequence(element, orderedElements, elementRegistry) {
  if (!element || orderedElements.includes(element)) return;

  orderedElements.push(element);

  const outgoing = element.outgoing.filter(
    (outgoing) =>
      outgoing.type === "bpmn:SequenceFlow" ||
      outgoing.type === "bpmn:sequenceFlow"
  );

  outgoing.forEach((flow) => {
    const targetId = flow.businessObject.targetRef.id;
    const targetElement = elementRegistry.get(targetId);

    addSequence(targetElement, orderedElements, elementRegistry);
  });
}

function isInRange(number, min) {
  const max = min + 70;
  return number >= min && number <= max;
}

function hasCollaboration() {
  elementRegistry = viewer.get("elementRegistry");
  const allElements = elementRegistry.getAll();
  const participants = allElements.filter(
    (element) => element.type == "bpmn:Participant"
  );
  if (participants.length > 0) {
    return participants;
  }
  return false;
}

//function to reorder the diagram
export function reorderDiagram() {
  //prendo tutti gli elementi del processo
  elementRegistry = viewer.get("elementRegistry");
  const allElements = elementRegistry.getAll();

  //has some collaboration inside it?
  const has_Collaboration = hasCollaboration();

  var distribute;

  if (has_Collaboration) {
    //ha delle collaborazioni => ci sono diversi partecipanti
    has_Collaboration.forEach((part) => {
      //prendi ogni partecipazione
      const subSet = getSequenceElements(null);
      //getOrderedSub(part.children); //ordina gli elementi interni ad ognuna di esse singolarmente
      reOrderSubSet(subSet);
      /*distribute = part.children.filter(
        (element) =>
          element.type == "SequenceFlow" || element.type == "MessageFlow"
      );
      distributor.trigger(distribute, "vertical");
      distributor.trigger(distribute, "horizontal");*/
      reorderPools();
      fixGroups();
    });
  } else {
    var sub = getSequenceElements(allElements);
    sub = sub.filter(
      (item) =>
        item.type != "bpmn:MessageFlow" &&
        item.type != "bpmn:Group" &&
        item.type != "bpmn:DataInputAssociation" &&
        item.type != "bpmn:DataStoreReference" &&
        item.type != "bpmn:DataObjectReference" &&
        item.type != "bpmn:DataObjectAssociation"
    );
    reOrderSubSet(sub);
    /*distribute = allElements.filter(
      (element) => element.id != "GdprGroup" && !element.id.includes("right")
    );
    distributor.trigger(distribute, "vertical");
    distributor.trigger(distribute, "horizontal");*/
    fixGroups();
  }
  viewer.get("canvas").zoom("fit-viewport");
}
//

function fixGroups() {
  elementRegistry = viewer.get("elementRegistry");
  var starts = null;
  const groups = elementRegistry
    .getAll()
    .filter((item) => item.type == "bpmn:Group" && item.id != "GdprGroup");
  const allElements = elementRegistry.getAll();
  if (groups.length > 0) {
    groups.forEach((group) => {
      const xGroup = group.x ? group.x : null;
      const yGroup = group.y ? group.y : null;
      const heightGroup = group.height ? group.height : null;
      const widthGroup = group.width ? group.width : null;
      if (xGroup && yGroup && heightGroup && widthGroup) {
        starts = allElements.filter(
          (item) =>
            item.type == "bpmn:StartEvent" &&
            item.y >= yGroup &&
            item.y + item.height <= yGroup + heightGroup
        );
        if (starts && starts.length > 0) {
          starts.forEach((start) => {
            if (start.outgoing && start.outgoing.length > 0) {
              start.outgoing.forEach((out) => {
                if (out.type == "bpmn:SequenceFlow" && out.target != start) {
                  reOrderSubSet([start, out.target]);
                  allignSuccessor(out.target, group);
                }
              });
            }
          });
        }
      }
    });
  }
}

//function to allign an element inside the group and resizing the group if the element goes outside the group
//element: the element inside the group that i want to consider
//group:the group i'm considering
function allignSuccessor(element, group) {
  const elementEndX = element.x + element.width;
  const groupEndX = group.x + group.width;
  if (elementEndX > groupEndX) {
    const offsetX = elementEndX - groupEndX + 30;
    modeling.resizeShape(group, {
      x: group.x,
      y: group.y,
      height: group.height,
      width: group.width + offsetX,
    });
    modeling.moveShape(element, { x: -offsetX, y: 0 });
  }
  if (element.outgoing && element.outgoing.length > 0) {
    element.outgoing.forEach((out) => {
      if (out.type == "bpmn:SequenceFlow" && out.target != element) {
        console.log("out", element, out.target);
        allignSuccessor(out.target, group);
        reOrderSubSet([element, out.target]);
      }
    });
  }
}

function reOrderSubSet(sub) {
  sub.forEach((element) => {
    //get the set of elements that precede the element
    const previousElementSet = getPreviousElement(element);
    if (previousElementSet.length > 0) {
      var setVertical = null;
      //se ci sono elementi prima
      previousElementSet.forEach((previousElement) => {
        //per ogni elemento
        //assegnamo una distanza fissa in base a quanto è largo ogni elemento
        const compare = 40;
        const diff = element.x - (previousElement.x + previousElement.width); //quanto sono distanti i due elementi
        var add = diff > compare ? 0 : compare; //quanto devo aggiungere/togliere per ottenere la distanza perfetta
        var addY = 0;

        var incomingElementSet = element.incoming; //ottieni tutte le frecce entranti
        incomingElementSet = incomingElementSet.filter(
          (elem) => elem.type == "bpmn:SequenceFlow"
        );
        if (incomingElementSet.length > 0) {
          for (var i = 0; i < incomingElementSet.length; i++) {
            var incomingElement = incomingElementSet[i]; //freccia entrante corrente
            if (
              incomingElement.businessObject.sourceRef.id == previousElement.id //se stiamo considerando la freccia che parte dall'elemento precedente
            ) {
              const newPositionX = element.x + add;
              const newPositionY = element.y + addY;

              modeling.moveShape(element, { x: add, y: addY });

              if (element.attachers.length > 0) {
                element.attachers.forEach((attached) => {
                  modeling.moveShape(attached, { x: add, y: addY });
                });
              }
              //if the object i'm moving has a label, move the label too
              if (element.labels.length > 0) {
                element.labels.forEach((label) => {
                  modeling.moveShape(label, { x: add, y: addY });
                });
              } else {
                const label = elementRegistry.get(element.id + "_label");
                if (label) {
                  modeling.moveShape(label, { x: add, y: addY });
                }
              }

              const newWaypoints = [
                {
                  x: previousElement.x + previousElement.width,
                  y: previousElement.y + previousElement.height / 2,
                },
                { x: newPositionX, y: newPositionY + element.height / 2 },
              ];
              modeling.updateWaypoints(incomingElement, newWaypoints);
              existSomethingInBetween(incomingElement);
            }
          }
        }
      });
    }
  });
}

function existSomethingInBetween(flow) {
  elementRegistry = viewer.get("elementRegistry");
  var allElements = elementRegistry.getAll();
  var waypoints = flow.waypoints;
  if (waypoints) {
    const startingPoint = waypoints[0];
    const endingPoint = waypoints[1];
    allElements = allElements.filter(
      (element) =>
        startingPoint.x < element.x &&
        element.x < endingPoint.x &&
        startingPoint.y < element.y &&
        element.y < endingPoint.y &&
        bpmnActivityTypes.some((item) => item == element.type)
    );
    if (allElements.length > 0) {
      console.log("Found", allElements);
      var considered;
      if (allElements.length == 1) {
        considered = allElements[0];
      } else {
        considered = allElements.reduce((prev, current) => {
          return prev.y > current.y ? prev : current;
        });
      }
      const newWaypoints = { x: startingPoint.x, y: considered.y - 50 };
      const newWaypoints2 = {
        x: endingPoint.x,
        y: considered.y - 50,
      };

      waypoints.splice(1, 0, newWaypoints, newWaypoints2);

      modeling.updateWaypoints(flow, waypoints);
      console.log("Updated", flow);
      if (flow.labels.length > 0) {
        flow.labels.forEach((label) => {
          modeling.updateProperties(label, {
            x: (startingPoint.x + endingPoint.x) / 2,
            y: considered.y - 50,
          });
        });
      }
    } else {
      return;
    }
  }
}

function adjustPools(sortedPools) {
  const desiredDistance = 100;
  const maxDistance = 200;
  let prevY = -1;
  let currentX = -1;

  sortedPools.forEach((pool) => {
    if (prevY !== -1) {
      const currentY = pool.y;
      const distance = currentY - prevY;
      let deltaY = 0;
      let deltaX = 0;

      if (distance > maxDistance) {
        deltaY = prevY + desiredDistance - currentY;
      } else if (distance < desiredDistance) {
        deltaY = prevY + desiredDistance - currentY;
      }

      if (deltaY !== 0) {
        if (pool.x != currentX) deltaX = currentX - pool.x;
        modeling.moveElements([pool], { x: deltaX, y: deltaY });
        const messageFlows = elementRegistry
          .getAll()
          .filter((element) => element.type === "bpmn:MessageFlow");

        messageFlows.forEach((messageFlow) => {
          const source = messageFlow.source;
          const target = messageFlow.target;
          if (source.parent === pool || target.parent === pool) {
            const newWaypoints = messageFlow.waypoints.map((waypoint) => {
              return {
                x: waypoint.x,
                y: waypoint.y + deltaY,
              };
            });
            modeling.updateWaypoints(messageFlow, newWaypoints);
          }
        });
      }
    }

    const children = pool.children.filter(
      (item) =>
        item.type !== "bpmn:SequenceFlow" &&
        item.type !== "bpmn:MessageFlow" &&
        item.type !== "bpmn:DataObjectAssociation" &&
        item.type !== "bpmn:DataInputAssociation"
    );

    if (children.length > 0) {
      const newBounds = {
        x: pool.x,
        y: pool.y,
        width: pool.width,
        height: pool.height,
      };

      const sortedByY = sortByY(children);
      const firstY = sortedByY[0];
      const lastY = sortedByY[sortedByY.length - 1];

      if (firstY.y < pool.y - 90) {
        newBounds.y = firstY.y - 90;
      } else if (firstY.y > pool.y + 90) {
        newBounds.y = firstY.y - 90;
      } else {
        newBounds.y = pool.y;
      }

      if (lastY.y + lastY.height > pool.y + pool.height - 90) {
        newBounds.height = lastY.y + lastY.height - pool.y + 90;
      } else if (lastY.y + lastY.height < pool.y + pool.height - 90) {
        newBounds.height = lastY.y + lastY.height - pool.y + 90;
      } else {
        newBounds.height = pool.height;
      }

      const sortedByX = sortByX(children);
      const firstX = sortedByX[0];
      const lastX = sortedByX[sortedByX.length - 1];

      if (firstX.x < pool.x - 90) {
        newBounds.x = firstX.x - 90;
      } else if (firstX.x > pool.x + 90) {
        newBounds.x = firstX.x - 90;
      } else {
        newBounds.x = pool.x;
      }

      if (lastX.x + lastX.width > pool.x + pool.width - 90) {
        newBounds.width = lastX.x + lastX.width - pool.x + 90;
      } else if (lastX.x + lastX.width < pool.x + pool.width - 90) {
        newBounds.width = lastX.x + lastX.width - pool.x + 90;
      } else {
        newBounds.width = pool.width;
      }

      const gdpr = elementRegistry.get("GdprGroup");
      if (gdpr) {
        if (gdpr.y >= pool.y && gdpr.y + gdpr.height > pool.y + pool.height) {
          // Controlla se il GDPR estende oltre i limiti del pool
          newBounds.height = gdpr.y + gdpr.height + 20 - pool.y;
        }
        var setOfRights = new Array();
        rights.forEach((right) => {
          const rightRef = elementRegistry.get(right);
          if (rightRef) {
            setOfRights.push(rightRef);
          }
        });
        if (setOfRights.length > 0) {
          const sortGdprY = sortByY(setOfRights);
          const firstYGdpr = sortGdprY[0];
          const lastYGdpr = sortGdprY[sortedByX.length - 1];

          var newBoundsGdpr = {
            x: gdpr.x,
            y: gdpr.y,
            width: gdpr.width,
            height: gdpr.height,
          };

          if (firstYGdpr.y < gdpr.y - 10) {
            newBoundsGdpr.y = firstYGdpr.y - 10;
          } else if (firstYGdpr.y > gdpr.y + 10) {
            newBoundsGdpr.y = firstYGdpr.y - 10;
          } else {
            newBoundsGdpr.y = gdpr.y;
          }

          if (lastYGdpr.y + lastYGdpr.height > gdpr.y + gdpr.height - 10) {
            newBoundsGdpr.height = lastYGdpr.y + lastYGdpr.height - gdpr.y + 10;
          } else if (
            lastYGdpr.y + lastYGdpr.height <
            gdpr.y + gdpr.height - 10
          ) {
            newBoundsGdpr.height = lastYGdpr.y + lastYGdpr.height - gdpr.y + 10;
          } else {
            newBoundsGdpr.height = gdpr.height;
          }

          modeling.resizeShape(gdpr, newBoundsGdpr);
        }
      }
      modeling.resizeShape(pool, newBounds);
    }

    prevY = pool.y + pool.height;
    currentX = pool.x;
  });
}

function resizeGdprGroup() {}

async function reorderPools() {
  const elementRegistry = viewer.get("elementRegistry");
  var pools = elementRegistry.filter(
    (element) => element.type === "bpmn:Participant"
  );
  const sortedPools = pools.sort((a, b) => a.y - b.y);
  adjustPools(sortedPools);
}

function sortByY(elements) {
  var min = elements[0];
  var max = elements[0];
  elements.forEach((element) => {
    if (element.y < min.y) {
      min = element;
    }
    if (element.y + element.height > max.y + max.height) {
      max = element;
    }
  });
  return [min, max];
}
function sortByX(elements) {
  var min = elements[0];
  var max = elements[0];
  elements.forEach((element) => {
    if (element.x < min.x) {
      min = element;
    }
    if (element.x + element.width > max.x + max.width) {
      max = element;
    }
  });
  return [min, max];
}

//function to get incoming sequence flow element
function getIncoming(element) {
  elementRegistry = viewer.get("elementRegistry");
  const incoming = element.incoming[0];
  return incoming;
}
//

//function to handle the side bar close/open function
//open: you want to open the side bar?
export function handleSideBar(open) {
  if (open) {
    eventBus.fire("TOGGLE_MODE_EVENT", {
      exportMode: true,
    });
    mode.textContent = "GDPR Mode";
    const visualized =
      localStorage.getItem("popUpVisualized") == "true" ? true : false;
    if (!visualized) {
      displayDynamicAlert(
        "You are now in GDPR mode, and the editor is disabled. \n If you want to edit again, you must close the GDPR panel.",
        "warning",
        6000
      );
      localStorage.setItem("popUpVisualized", "true");
    }
  } else {
    eventBus.fire("TOGGLE_MODE_EVENT", {
      exportMode: false,
    });
    edit.textContent = "Edit Mode";
  }
}
//

//function to extract the set of activities available in the diagram
export async function getActivities() {
  elementRegistry = viewer.get("elementRegistry");
  const allElements = elementRegistry.getAll();

  var activities = new Array();

  if (allElements) {
    allElements.forEach((element) => {
      if (bpmnActivityTypes.some((item) => item == element.type)) {
        const id = element.id;
        const name = element.businessObject.name;
        const splittedName = id.split("_");
        if (splittedName[splittedName.length - 1] != "plane") {
          activities.push({ id, name });
        }
      }
    });
    return activities;
  }
}
//

//if i want to remove the path added for the gdpr compliance
//activity: the activity after the path so the activity for which i imserted the path
//type: the type of path i want to remove ex. consent for data
export function removeConsentFromActivity(activity, type) {
  elementRegistry = viewer.get("elementRegistry");
  try {
    var i = 0;
    //mi serve un ciclo nel caso io abbia aggiunto più consent alla stessa attività perche ho più path che portano ad essa
    var name = type + activity.id + "_" + i;
    var toRemove = elementRegistry.get(name);
    while (toRemove) {
      commandStack.execute(
        "shape.delete",
        {
          shape: toRemove,
        },
        {
          context: {
            autoExecute: false,
          },
        }
      );
      i++;
      var name = type + activity.id + "_" + i;
      toRemove = elementRegistry.get(name);
    }

    const Act = elementRegistry.get(activity.id);
    const incomingSet = Act.incoming;
    if (incomingSet.length > 0) {
      for (var i = 0; i < incomingSet.length; i++) {
        var incoming_elem = incomingSet[i];
        const source = incoming_elem.source;
        const splitted = source.id.split("_");

        if (splitted[0] == "consent" && type == "consent_") {
          try {
            commandStack.execute("connection.delete", {
              connection: incoming_elem,
            });
            console.log("Connection removed successfully");
          } catch (error) {
            console.error("Error removing connection:", error);
          }
        }
      }
    }
    //reorderDiagram();
  } catch (e) {
    console.error("Some problem in removing path gdpr added to activity", e);
  }
}
//

//
function getStartFirst(parent) {
  elementRegistry = viewer.get("elementRegistry");
  const allElements = parent.children;
  var result = null;
  for (var i = 0; i < allElements.length; i++) {
    if (
      allElements[i].type == "bpmn:StartEvent" ||
      allElements[i].type == "bpmn:startEvent"
    ) {
      result = allElements[i];
      break;
    }
  }
  return result;
}
//

function getParticipantFromCollaboration(collaboration) {
  var parentRoot = collaboration;
  var numChild = 0;
  var result;

  for (var i = 0; i < parentRoot.children.length; i++) {
    if (parentRoot.children[i].type == "bpmn:Participant") {
      if (numChild < parentRoot.children[i].children.length) {
        numChild = parentRoot.children[i].children.length;
        result = parentRoot.children[i];
      }
    }
  }
  return result;
}

//function to add the group where i'm going to insert the path for gdpr compliance
export function createAGroup() {
  modeling = viewer.get("modeling");
  canvas_ref = viewer.get("canvas");
  var parentRoot = canvas_ref.getRootElement();
  var oldP = null;

  if (parentRoot.type == "bpmn:Collaboration") {
    //se c'è una collaborazione e quindi lo devo andare ad inserire all'interno di una partecipazione
    parentRoot = getParticipantFromCollaboration(parentRoot);
    oldP = {
      x: parentRoot.x - 500,
      y: parentRoot.y,
      width: parentRoot.width + 500,
      height: parentRoot.height + 200,
    };
    //mi salvo le coordinate della partecipazione
  }

  const start = getStartFirst(parentRoot); //mi prendo il primo elemento della partecipazione

  if (start != null) {
    var x = 0;
    var y = start.y;
  }

  if (oldP) {
    x = oldP.x + 300;
    y = oldP.y + 100;
  } else {
    x = x - 200;
    y = y + 150;
  }

  const groupShape = elementFactory.createShape({
    type: "bpmn:Group",
    width: 320,
    height: 200,
    id: "GdprGroup",
  });

  groupShape.id = "GdprGroup";
  groupShape.businessObject.id = "GdprGroup";
  groupShape.businessObject.name = "Achieve Gdpr Compliance";
  groupShape.height = 200;
  try {
    if (oldP != null) {
      modeling.resizeShape(parentRoot, oldP);
    }
    modeling.createShape(groupShape, { x: x, y: y }, parentRoot);
  } catch (error) {
    console.error("error in creating/resizing group");
  }
  viewer.get("canvas").zoom("fit-viewport");
}
//

//function to check if the group containing the path already exists
export function existGdprGroup() {
  elementRegistry = viewer.get("elementRegistry");
  const allElements = elementRegistry.getAll();
  var result = false;
  allElements.forEach((element) => {
    if (element.id == "GdprGroup") {
      result = true;
    }
  });
  return result;
}
//

//function to find a free space in the group
async function findFreeY() {
  elementRegistry = viewer.get("elementRegistry");
  const group = elementRegistry.get("GdprGroup");
  var max_height = group.height != 0 ? group.height : 150;
  const y_ex = group.y;
  var elem;
  var y = y_ex + 20; // la prima y sarà la posizione di group + 20 come padding
  const rights = [
    "right_to_access",
    "right_to_portability",
    "right_to_rectify",
    "right_to_object",
    "right_to_object_to_automated_processing",
    "right_to_restrict_processing",
    "right_to_be_forgotten",
    "right_to_be_informed_of_data_breaches",
  ];
  rights.forEach((right) => {
    if (elementRegistry.get(right)) {
      const r = elementRegistry.get(right);
      y = r.y + 150;
    }
  });
  const limitPoint = y_ex + max_height - 20; //20 è il padding
  const spaceNeeded = y + 20 + 120;

  if (spaceNeeded > limitPoint) {
    const add = modeling.resizeShape(group, {
      x: group.x,
      y: group.y,
      width: group.width,
      height: group.height + (y + 130 - (max_height + y_ex)),
    });
    //modeling.updateProperties(group, { height: max_height + 120 });
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
export async function addSubEvent(
  diagram,
  start_event_title,
  end_event_title,
  path_name,
  start_type
) {
  const elementRegistry = viewer.get("elementRegistry");
  const elementFactory = viewer.get("elementFactory");
  const modeling = viewer.get("modeling");

  const gdpr = elementRegistry.get("GdprGroup");
  if (!gdpr) {
    console.error("GdprGroup not found in element registry");
    return;
  }
  var parent = viewer.get("canvas").getRootElement(); //= gdpr.parent;
  if (parent.type == "bpmn:Collaboration") {
    parent = getParticipantFromCollaboration(parent);
  }
  if (!parent) {
    console.error("Parent of GdprGroup is undefined");
    return;
  }

  const y = await findFreeY();
  const start_event = elementFactory.createShape({
    type: "bpmn:StartEvent",
    id: path_name + "_start",
    width: 36,
    height: 36,
    eventDefinitionType: start_type,
  });

  start_event.businessObject.name = start_event_title;
  start_event.businessObject.id = path_name + "_start";

  try {
    modeling.createShape(start_event, { x: gdpr.x + 40, y: y }, parent);
  } catch (error) {
    console.error("Error creating or resizing start_event:", error);
    return;
  }

  const end_event = elementFactory.createShape({
    type: "bpmn:EndEvent",
    id: path_name + "_end",
    width: 36,
    height: 36,
  });

  end_event.businessObject.id = path_name + "_end";
  end_event.businessObject.name = end_event_title;

  try {
    modeling.createShape(end_event, { x: gdpr.x + 200, y: y }, parent);
  } catch (error) {
    console.error("Error creating or resizing end_event:", error);
    return;
  }

  const title_splitted = path_name.split("_");
  let title = "";
  title_splitted.forEach((part) => {
    let new_part = "";
    if (title === "") {
      new_part = part.charAt(0).toUpperCase() + part.slice(1);
    }
    title = new_part === "" ? title + part + " " : title + new_part + " ";
  });

  let subprocess;
  try {
    subprocess = await subProcessGeneration(
      path_name,
      title.trim(),
      diagram,
      end_event
    );
  } catch (error) {
    console.error("Error generating subprocess:", error);
    return;
  }

  try {
    await addActivityBetweenTwoElements(start_event, end_event, subprocess);
  } catch (error) {
    console.error("Error adding activity between elements:", error);
    return;
  }
}
//

//function to delete the gdrp path
function deleteGdprPath(id) {
  elementRegistry = viewer.get("elementRegistry");
  const allElements = elementRegistry.getAll();
  try {
    allElements.forEach((item) => {
      const element = item.id;
      let lastIndex = element.lastIndexOf("_");
      let result = element.substring(0, lastIndex);
      if (result == id || element == id) {
        modeling.removeShape(item);
      }
    });
  } catch (e) {
    console.error("Error in delete Gdpr path: " + e.message);
  }
}
//

//function to check if a gdpr group exists
export function existsGdprPath(id) {
  elementRegistry = viewer.get("elementRegistry");
  const exists = elementRegistry.get(id) ? true : false;
  return exists;
}
//

//function to get the answer to a certain question "question"
export async function getAnswerQuestionX(question) {
  try {
    const response = await getMetaInformationResponse();
    var result = response[question];
    if (result != null) {
      result = result.filter((item) => item.id != "response");
    } else {
      result = null;
    }
    return result;
  } catch (e) {
    console.error("error in getting a certain answer");
    return null;
  }
}
//

export function decolorEverySelected() {
  elementRegistry = viewer.get("elementRegistry");
  const all = elementRegistry.getAll();
  all.forEach((item) => {
    if (item.di.stroke == "#2ca912") {
      modeling.setColor(item, null);
    }
  });
}

export function colorActivity(activityId) {
  const activity = elementRegistry.get(activityId);
  modeling.setColor([activity], {
    stroke: "rgb(44, 169, 18)",
  });
}

export function decolorActivity(activityId) {
  const activity = elementRegistry.get(activityId);
  modeling.setColor([activity], null);
}

//function to get the origins of the message
//set: the set of incoming / outgoing sequence flow
//type: is outgoing sequence (out) or incoming sequence (in)
function getOrigin(set, type) {
  var result = new Array();
  if (set.length == 0) {
    return result;
  } else {
    if (type == "out") {
      //cerco nel target ref
      set.forEach((o) => {
        if (o.type == "bpmn:MessageFlow") {
          const object = o.target ? elementRegistry.get(o.target.id) : null;

          const nameObject =
            object && object.businessObject.name
              ? object.businessObject.name
              : object.type + object.id;

          if (nameObject) {
            result.push(nameObject);
          }
        }
      });
    } else if ((type = "in")) {
      set.forEach((o) => {
        if (o.type == "bpmn:MessageFlow") {
          const object = o.source ? elementRegistry.get(o.source.id) : null;
          const nameObject = object
            ? object.businessObject.name
              ? object.businessObject.name
              : object.type + object.id
            : null;
          if (nameObject) {
            result.push(nameObject);
          }
        }
      });
    }
    return result;
  }
}
//

//function to add an activity of the textual description that we want to generate of the XML
//child: the activity i want to add
//content: what i have already inserted
//connected: if the acrivity is an endEvent or is connected to something else(and so, i will put the 'linked to' in the text otherwise no). The default is false
function addActivityInText(child, content, connected = true) {
  const name = child.businessObject.name
    ? child.businessObject.name
    : child.type;
  content =
    content +
    "<Activity name: " +
    name +
    " \nType: " +
    child.type.split(":")[1] +
    "\nID: " +
    child.id; //ci aggiungiamo il nome di ogni attività
  //ci sono delle frecce dalla partecipazione considerata ad un altra?
  const sendMessageSet = child.outgoing.filter(
    (element) => element.type == "bpmn:MessageFlow"
  );
  //ci sono delle frecce da un altra partecipazione a quella considerata ?
  const receiveMessageSet = child.incoming.filter(
    (element) => element.type == "bpmn:MessageFlow"
  );

  const sent = getOrigin(sendMessageSet, "out");
  const received = getOrigin(receiveMessageSet, "in");

  if (sendMessageSet.length > 0 && receiveMessageSet.length > 0) {
    //manda e riceve messaggi
    if (sent == received) {
      content =
        content +
        " \nExchanges with other partecipations: Send a message and receives a response from: " +
        sent.join(" ") +
        " />";
    } else {
      content =
        content +
        " \nExchange with other partecipations: Send a message to: " +
        sent.join(" ") +
        " and receives a response from: " +
        received.join(" ") +
        " />";
    }
  } else if (sendMessageSet.length > 0) {
    content =
      content +
      " \nExchange with other partecipations: Send a message to " +
      sent.join(" ") +
      " />";
  } else if (receiveMessageSet.length > 0) {
    content =
      content +
      " \nExchange with other partecipations: Receive a message from " +
      received.join(" ") +
      " />";
  } else {
    content =
      content + " \nExchange with other partecipations: no exchanges" + " />";
  }
  if (child.type != "bpmn:EndEvent" && connected) {
    content += " linked to: \n";
  } else {
    content += "\n";
  }
  return content;
}

// Add an event listener for the custom event
document.addEventListener("removeGif", function (e) {
  const passedId = e.detail.id;
  if (passedId) {
    const imgLoader = document.getElementById("imgLoader_" + passedId);
    if (imgLoader) imgLoader.remove();
  }
});

////function to add a gateway and all the path connected to it, until its termination of the textual description that we want to generate of the XML
//child: the gateway i want to add
//setOfElements: the set of elements i still need to insert into the textual  description (withou the gateway i'm going to insert write now)
function addGatewayInText(child, content, setOfElements) {
  var first;
  var typeOfGateway = child.type;
  var pathSentence;
  const outGateway = child.outgoing; //get the gateway outgoings
  setOfElements = setOfElements.filter((item) => item.id != child.id);
  const isClosureGateway = child.outgoing.length > 1 ? "Start" : "Closure";
  //Change behavior in base to the type of gateway
  switch (typeOfGateway) {
    case "bpmn:ExclusiveGateway":
      //get the gateway condition
      const GatewayCondition = child.businessObject.name
        ? child.businessObject.name
        : " No condition specified";
      content =
        content +
        "\n[" +
        isClosureGateway +
        " Exclusive Gateway \nID:" +
        child.id;
      if (isClosureGateway == "Start") {
        content =
          content +
          " (only one of the path can be taken)" +
          " \ncondition to check in order to proceed with the right path '" +
          GatewayCondition +
          "' different paths: ";
      }
      pathSentence = "\nPath of " + child.id + " taken if: '";
      break;
    case "bpmn:ParallelGateway":
      content =
        content +
        "\n[" +
        isClosureGateway +
        " Parallel Gateway \nID:" +
        child.id +
        " ";
      if (isClosureGateway == "Start") {
        content =
          content +
          child.id +
          "(all the path will be taken)" +
          "' different paths: ";
      }
      pathSentence = "\nPath of  " + child.id + " number: ";
      break;
    case "bpmn:InclusiveGateway":
      content =
        content +
        "\n[" +
        isClosureGateway +
        " Inclusive Gateway\nID: " +
        child.id +
        " ";
      if (isClosureGateway == "Start") {
        content =
          content +
          child.id +
          "(all the paths that met the conditions will be taken. At least one will be taken)" +
          "' possible paths: ";
      }
    case "bpmn:EventBasedGateway":
      content =
        content +
        "\n[" +
        isClosureGateway +
        " Event Based Gateway\nID: " +
        child.id +
        " ";
      if (isClosureGateway == "Start") {
        content =
          content +
          child.id +
          "(the path taken is the one that contains the first event that will be triggered)" +
          "' different paths: ";
      }
    case "bpmn:ComplexGateway":
      content =
        content +
        "\n[" +
        isClosureGateway +
        " Complex Gateway\nID: " +
        child.id +
        " ";
      if (isClosureGateway == "Start") {
        content =
          content +
          " (only one of the path can be taken)" +
          " \ncondition to check in order to proceed with the right path '" +
          GatewayCondition +
          "' different paths: ";
      }
      pathSentence = "\nPath of " + child.id + " taken if: '";
      break;
    default:
      break;
  }
  if (isClosureGateway == "Closure") content += "] linked to: \n";

  if (outGateway && outGateway.length > 1) {
    //if we have some outgoing flows

    for (var i = 0; i < outGateway.length; i++) {
      //itero su ogni ramo
      if (isClosureGateway == "Start") {
        content = content + pathSentence;
        if (
          typeOfGateway == "bpmn:ParallelGateway" ||
          typeOfGateway == "bpmn:EventBasedGateway"
        ) {
          content = content + " " + i + " ";
        } else if (
          typeOfGateway == "bpmn:ExclusiveGateway" ||
          typeOfGateway == "bpmn:InclusiveGateway" ||
          typeOfGateway == "bpmn:ComplexGateway"
        ) {
          const path_name = outGateway[i].businessObject.name
            ? outGateway[i].businessObject.name
            : "no path condition specified";
          content = content + path_name + "' ";
        }
      }

      var targetFlow = outGateway[i]; //primo ramo considerato
      var targetRef; //la prima activity che incontro nel mio path
      var target;
      var target_name;
      var times = 0;

      while (targetFlow) {
        targetRef = targetFlow.target.id ? targetFlow.target.id : false;
        if (targetRef) {
          target = elementRegistry.get(targetRef);
          if (
            target &&
            (target.type != typeOfGateway ||
              (target.type == typeOfGateway && target.outgoing.length > 1)) && //se è un exlcusive allora se ha 1 solo ramo uscente => che è di chiusura
            setOfElements.some((e) => e.id == target.id) //se non c'è l'ho giù analizzato
          ) {
            var retSet;
            var toPass = [target];
            if (times == 0) content = content + " linked to\n ";
            times++;
            [content, retSet] = iterateSetOfElementsToTranslate(
              toPass,
              content,
              null
            ); //target è l'elemento che trovo sul ramo uscente del gateway(primo giro) quindi itero su di lui per aggiungerlo al content
            setOfElements = setOfElements.filter(
              (item) => item.id != target.id
            ); //lo tolgo dal set

            if (target.outgoing.length > 1) {
              targetFlow = target.outgoing.filter(
                (item) => item.type == "bpmn:SequenceFlow"
              );
              targetFlow = targetFlow[0];
            } else if (target.outgoing.length == 1)
              targetFlow = target.outgoing[0];
            else {
              targetFlow = false;
            }
          } else {
            targetFlow = false;
            if (
              target &&
              target.type == typeOfGateway &&
              target.outgoing.length <= 1
            ) {
              const nameLastTarget = target.id ? target.id : " ";
              content += " \nlinked to " + nameLastTarget + " ";

              //se sto chiudendo il gateway
              if (target.outgoing.length != 0) {
                targetFlow = null;
                first = target;
              }
            } else {
              targetFlow = false;
            }
          }
        }
      }
    }
    content =
      content +
      "\n End paths of " +
      typeOfGateway.split(":")[1] +
      " " +
      child.id +
      " ]\n";
  }
  return [content, setOfElements, first];
}
//the function returns
//the content that is the textual description generated so far
//the setOfElements updated (without the elements that i inserted)
//first the first element i need to analyze after the gatway that started the function

//function to call in a recursive manner
//set: the set of element i need to translate into text
//content; the content (the current written text)
function iterateSetOfElementsToTranslate(set, content, firstPassed) {
  var first = firstPassed;
  var connected = true;
  var hasBoundaryAttached = false;
  // se ci sono elementi nel set che gli passo
  while (set.length > 0) {
    var next = null;
    if (first == null) {
      first = set[0]; //se non gli ho passato un inizio
      connected = first.type == "bpmn:StartEvent" ? true : false;
    }
    set = set.filter((item) => item && item.id != first.id); //tolgo l'elemento considerato dal set
    if (
      bpmnActivityTypes.some(
        (item) =>
          item == first.type ||
          first.type == "bpmn:StartEvent" ||
          first.type == "bpmn:EndEvent" ||
          first.type == "bpmn:IntermediateCatchEvent" ||
          first.type == "bpmn:IntermediateThrowEvent" ||
          first.type == "bpmn:BoundaryEvent"
      )
    ) {
      if (first.type == "bpmn:SubProcess") {
        [content, set] = procedureSubProcess(first, set, content);
      }
      [hasBoundaryAttached, content, set] = procedureHasBoundary(
        first,
        set,
        content
      );
      if (hasBoundaryAttached == false) {
        content = addActivityInText(first, content, connected);
      }
      connected = true;
    }
    //oppure è un gateway
    else if (GatewayTypes.some((item) => item == first.type)) {
      [content, set, next] = addGatewayInText(first, content, set);
    }

    if (next == null) {
      const getAttached = first.outgoing.filter(
        //prendo il riferimento dell'attività attaccata a quella che sto considerando
        (out) => out.type == "bpmn:SequenceFlow"
      );
      if (getAttached.length > 0) {
        next = elementRegistry.get(getAttached[0].target.id);
      }
    }
    first = next ? next : null;
  }
  return [content, set];
}
//

//function that handle the case in which the activity has a boundary activity attached
//ActivityToCheck the Id of the activity i want to check the attachment of
//setOfElements is the set of elements that i still need to insert
//content: the textual description generated so far
function procedureHasBoundary(ActivityToCheck, setOfElements, content) {
  var result = false;
  var boundaryActivity;
  var firstTarget;
  var activityName = ActivityToCheck.businessObject.name
    ? ActivityToCheck.businessObject.name
    : ActivityToCheck.id;
  elementRegistry = viewer.get("elementRegistry");
  const allElements = elementRegistry.getAll();
  const boundary = allElements.filter(
    (item) => item.type == "bpmn:BoundaryEvent"
  );
  if (boundary && boundary.length > 0) {
    for (var i = 0; i < boundary.length; i++) {
      const refBoundary = boundary[i].businessObject.attachedToRef
        ? boundary[i].businessObject.attachedToRef
        : false;
      if (refBoundary && refBoundary.id == ActivityToCheck.id) {
        result = true;
        boundaryActivity = boundary[i];
        break;
      }
    }
  }
  if (result) {
    const boundaryHasLin = boundaryActivity.outgoing.length > 0 ? true : false; //è connessa ad altro?

    content = addActivityInText(ActivityToCheck, content, false);
    content = content + " { " + activityName + " has a boundary activity: \n";

    setOfElements = setOfElements.filter(
      (item) => item.id != boundaryActivity.id
    ); //tolgo la boundary dal set

    content = addActivityInText(boundaryActivity, content, boundaryHasLin);

    if (boundaryHasLin) {
      const setOfLinkFromBoundary = boundaryActivity.outgoing.filter(
        (item) => item.type == "bpmn:SequenceFlow"
      );
      //devo gestire l'aggiunta di ogni elemento connesso alla boundary fino al termine
      setOfLinkFromBoundary.forEach((first) => {
        //devo iterare su tutti i rami uscenti di boundary
        firstTarget = first.target; //prendo il primo
        while (firstTarget) {
          //finchè ha un collegamento
          var connected = firstTarget.type == "bpmn:EndEvent" ? true : false; //ne ha un altro ?
          content = addActivityInText(firstTarget, content, connected); //aggiungilo al text
          setOfElements = setOfElements.filter(
            //elimino dll'insieme degli elementi
            (item) => item.id != firstTarget.id
          );
          const set =
            firstTarget.outgoing.length > 0
              ? firstTarget.outgoing.filter(
                  (item) => item.type == "bpmn:SequenceFlow"
                )
              : false;
          firstTarget = set ? set[0].target : false;
        }
      });
    }
    content =
      content +
      " end boundary path} \n The activity " +
      activityName +
      " is linked to:\n";
  }

  return [result, content, setOfElements];
}
//

//function that handles the case in  which the activity has a subprocess
//ActivityToCheck, the activity subproess that i need to check
//set of elements the set of elements i need to consider
//content. the textual description generated so far
function procedureSubProcess(ActivityToCheck, setOfElements, content) {
  var activityName = ActivityToCheck.businessObject.name
    ? ActivityToCheck.businessObject.name
    : ActivityToCheck.id;
  var setOfChildren = ActivityToCheck.businessObject.flowElements;

  setOfChildren = setOfChildren.filter(
    (item) =>
      item.$type != "bpmn:DataInputAssociatio" &&
      item.$type != "bpmn:DataStoreReference" &&
      item.$type != "bpmn:Group" &&
      item.$type != "bpmn:MessageFlow" &&
      item.$type != "bpmn:SequenceFlow" &&
      item.$type != "label" &&
      item.$type != "bpmn:DataObjectReference" &&
      item.$type != "bpmn:DataObjectAssociation"
  );
  if (setOfChildren.length > 0) {
    setOfElements = setOfElements.filter(
      (item) => !setOfChildren.some((c) => c.id == item.id)
    );
    content =
      content +
      " activity " +
      activityName +
      " is a Sub Process the process inside it is: {\n ";
    const setToPass = new Array();
    setOfChildren.forEach((child) => {
      setToPass.push(elementRegistry.get(child.id));
    });
    [content, setOfChildren] = iterateSetOfElementsToTranslate(
      setToPass,
      content,
      null
    );
    content = content + " end subprocess}\n ";
  }

  return [content, setOfElements];
}

//function to transform the xml to a text scheme of the process
//xml: the xml of the process at the moment in which the function is called
export function fromXMLToText(xml) {
  //creo un blob (file txt) dove andrò ad inserire la descrizione testuale del processo.
  var content = "";
  elementRegistry = viewer.get("elementRegistry");
  const allElements = elementRegistry.getAll(); //prendo tutti gli elementi che ho nel diagramma

  const sub = allElements.filter(
    (element) =>
      element.type == "bpmn:Participant" || element.type == "bpmn:participant"
  ); //filtro il set per avere solo le partecipazioni

  if (sub.length > 0) {
    //ci sono delle partecipazioni
    sub.forEach((subset) => {
      //itero su ogni partecipazione
      const partecipant_name = subset.businessObject.name
        ? subset.businessObject.name
        : subset.id; //prendo il nome della partecipazione

      var childToIterate = subset.children; //prendo tutti gli elementi appartenenti alla partecipazione
      childToIterate = childToIterate.filter(
        (item) =>
          item.type != "bpmn:DataInputAssociatio" &&
          item.type != "bpmn:DataStoreReference" &&
          item.type != "bpmn:Group" &&
          item.type != "bpmn:MessageFlow" &&
          item.type != "bpmn:SequenceFlow" &&
          item.type != "label" &&
          item.type != "bpmn:DataObjectReference" &&
          item.type != "bpmn:DataObjectAssociation"
      );

      if (childToIterate.length > 0) {
        // se ha degli elementi allora
        content = content + "\n{Participant: " + partecipant_name + "\n";
        var first = childToIterate[0]; //prendo il primo elemento della partecipazione
        [content, childToIterate] = iterateSetOfElementsToTranslate(
          childToIterate,
          content,
          first
        ); //invio chiamata ricorsiva su primo elemento
        content = content + "\nEnd Participant: " + partecipant_name + "}\n";
      } else {
        content =
          content +
          "\n{ Participant: " +
          partecipant_name +
          " (empty pool) }\n";
      }
    });
  } else {
    //non ci sono partecipazioni
    var allSet = allElements.filter(
      (item) =>
        item.type != "bpmn:DataInputAssociatio" &&
        item.type != "bpmn:DataStoreReference" &&
        item.type != "bpmn:Group" &&
        item.type != "bpmn:MessageFlow" &&
        item.type != "bpmn:SequenceFlow" &&
        item.type != "label" &&
        item.type != "bpmn:DataObjectReference" &&
        item.type != "bpmn:DataObjectAssociation"
    );
    if (allSet.length > 0) {
      var first = allSet[0];
      allSet = allSet.filter((item) => item.id != first.id);
      content =
        content +
        "\nNo Partecipations, unique\n Start of the process: {" +
        "\n";
      [content, allSet] = iterateSetOfElementsToTranslate(
        allSet,
        content,
        first
      );
      content = content + "\nEnd of the process} " + "\n";
    }
  }
  const blob = new Blob([content], { type: "text/plain" });
  return content;
}
//
export {
  getDiagram,
  editMetaInfo,
  subProcessGeneration,
  getElement,
  getPreviousElement,
  addActivityBetweenTwoElements,
};
