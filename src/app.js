import BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import BpmnModdle from 'bpmn-moddle';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import diagram from '../resources/diagram.bpmn';
import { yesdropDownA, nodropDownA } from './questions.js';
import { createDropDown, removeUlFromDropDown, closeSideBarSurvey, getMetaInformationResponse } from './support.js';
var MetaPackage = require('./metaInfo.json');

var moddle = new BpmnModdle();

var viewer = new BpmnJS({
    container: '#canvas',
    moddleExtensions: {
        meta: MetaPackage
    }
});

function getExtension(element, type) {
  if (!element.extensionElements) {
    return null;
  }

  return element.extensionElements.filter(function(e) {
    return e.$instanceOf(type);
  })[0];
}

async function Starter() {
    try {
        viewer.importXML(diagram)
            .then(async () => {
                const definitions = viewer.getDefinitions();
                viewer.get('canvas').zoom('fit-viewport');

                const Mod= viewer._moddle;
                const elementFactory = viewer.get('elementFactory');

                const processElements = getProcessElement();
                if (processElements.length > 0) {
                    var firstProcessElement = processElements[0];
                    var processBusinessObject = firstProcessElement.businessObject;
                    
                    var processExtension = getExtension(processBusinessObject, 'meta:ModelMetaData');
                    if (processExtension) {
                        console.log("Dati dell'estensione del processo:", processExtension);
                    } else {
                        const meta = Mod.create('meta:ModelMetaData');
                        console.log("meta",meta)
                        processBusinessObject.extensionElements = Mod.create('bpmn:ExtensionElements');
                        processBusinessObject.extensionElements.get('values').push(meta);

                        meta.questionA="Yes"
                        const saved = await viewer.saveXML({ format: true });
                          if (saved.error) {
                              console.error(saved.error);
                          } else {
                              console.log("XML generato:", saved.xml);
                              console.log('Elemento personalizzato aggiunto al diagramma con successo!');
                          }
                        console.log("Nessuna estensione trovata per il processo.");
                    }
                } else {
                    console.log("Nessun processo trovato nel diagramma.");
                }

                


                /*const saved = await viewer.saveXML({ format: true });
                if (saved.error) {
                    console.error(saved.error);
                } else {
                    console.log("XML generato:", saved.xml);
                    console.log('Elemento personalizzato aggiunto al diagramma con successo!');
                }*/
                console.log('Elemento personalizzato aggiunto al diagramma con successo!');
            })
            .catch(error => {
                console.error('Errore nell\'importazione dell\'XML:', error);
            });
    } catch (err) {
        console.error('Si è verificato un errore:', err);
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    await Starter();
});

//Function to check if already have the gdpr marks or add it
function checkMetaInfo(){
  
}

//

//TODO: Può esserci più di un processo? 

//Function to get the element process without knowing the ID
function getProcessElement(){
  var allElements = viewer.get('elementRegistry').getAll();

  var processElements = allElements.filter(function(element) {
      return element.type === 'bpmn:Process';
  });
  return processElements;
}
//end function to get the element process



//statements
const export_button=document.getElementById('export_button');
const import_button=document.getElementById('import_button');
const gdpr_button=document.getElementById('gdpr_compliant_button');
const canvas_raw=document.getElementById('canvas_raw');
const canvas= document.getElementById('canvas');
const canvas_col=document.getElementById('canvas_col');
const survey_col=document.getElementById('survey_col');

//gdpr questions
const YA=document.getElementById('yes_dropDownA');
const NA=document.getElementById('no_dropDownA');
//end gdpr questions

//end statements

//export handler 
export_button.addEventListener('click', function () {
  try{
    closeSideBarSurvey();
  }
  catch(e){
    console.error("Error",e);
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
          try{
            viewer.importXML(fileXML);
            window.alert("Diagram imported successfully");
          }catch(e){
            console.error("Error in importing the diagram",e)
          }
      };
      reader.readAsText(diagram_imported);
  }
})

input.click();
try{
  closeSideBarSurvey();
}
catch(e){
  console.error("Error",e);
}
});
//end import handler 


// gdpr compliance button
gdpr_button.addEventListener('click', () =>{

  const mainColumn = document.querySelector('.main-column');
  const sidebarColumn = document.querySelector('.sidebar-column');
  const canvasRaw = document.querySelector('#canvas-raw');
  const spaceBetween=document.querySelector('.space-between');

  const questions = getMetaInformationResponse();
  console.log("questions",questions);

  if(!document.getElementById("survey_area")){

    // Aggiorna le larghezze delle colonne
    mainColumn.style.width = '74.8%';
    sidebarColumn.style.width = '23.8%';
    sidebarColumn.style.marginLeft="0.5%";

    sidebarColumn.style.height = canvas.clientHeight + 'px';
    sidebarColumn.style.marginTop = '2vh';
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
    });

    survey_area.appendChild(close_survey);

    const title = "GDPR compliance";
    const textNode = document.createTextNode(title);

    const divTitle= document.createElement("div");
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
    survey_area.appendChild(areaDropDowns)

    const dropDownA = createDropDown("dropDownA",true,"Personal data","Do you handle personal data in your process?");
    //end survey area 

  }

});


//end gdpr handler

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



export {getDiagram,pushDiagram}
