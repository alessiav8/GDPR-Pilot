import BpmnModeler from 'bpmn-js';
import BpmnViewer from 'bpmn-js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import diagram from '../resources/diagram.bpmn';

var viewer = new BpmnJS({
  container: '#canvas'
});

try {
  viewer.importXML(diagram);
  viewer.get('canvas').zoom('fit-viewport');
} catch (err) {
  console.error('something went wrong:', err);
}

//statements
const export_button=document.getElementById('export_button');
const import_button=document.getElementById('import_button');
const gdpr_button=document.getElementById('gdpr_compliant_button');
const canvas_raw=document.getElementById('canvas_raw');
const canvas= document.getElementById('canvas');
const canvas_col=document.getElementById('canvas_col');
const survey_col=document.getElementById('survey_col');
//end statements

//export handler 
export_button.addEventListener('click', function () {

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
  viewer.saveXML({ format: true, preamble: false })
  .then(({ xml, error }) => {
      if (error) {
          console.log(error);
      } else {
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

input.addEventListener('change', function(event) {var diagram_imported = event.target.files[0];
  console.log(diagram_imported);
  if (diagram_imported) {
      const reader = new FileReader();
      reader.onload = function(event) {
          const fileXML = event.target.result;
          try{
            viewer.importXML(fileXML);
          }catch(e){
            console.error("Error in importing the diagram",e)
          }
      };
      reader.readAsText(diagram_imported);
  }
})

input.click();
});
//end import handler 


// gdpr compliance button
gdpr_button.addEventListener('click', () =>{

  const mainColumn = document.querySelector('.main-column');
  const sidebarColumn = document.querySelector('.sidebar-column');
  const canvasRaw = document.querySelector('#canvas-raw');
  const spaceBetween=document.querySelector('.space-between');

  if(!document.getElementById("survey_area")){

    // Aggiorna le larghezze delle colonne
    mainColumn.style.width = '74.8%';
    spaceBetween.style.width='0.1%'
    sidebarColumn.style.width = '22.8%';

    sidebarColumn.style.height = canvas.clientHeight + 'px';
    sidebarColumn.style.marginTop = '3vh';

    //start survey area handler
    const survey_area = document.createElement('div');
    survey_area.id="survey_area";
    survey_col.appendChild(survey_area);

    const close_survey = document.createElement('span');
    close_survey.classList.add('close-btn');
    close_survey.textContent = 'X';
    close_survey.style.marginTop="2.5vh";
    close_survey.style.marginRight="3.5vh"

    close_survey.addEventListener('click', () =>{
      survey_col.removeChild(document.getElementById("survey_area"));
      mainColumn.style.width = '100%';
      spaceBetween.style.width='0%'
      sidebarColumn.style.width = '0%';
      sidebarColumn.style.height = '0%';
      sidebarColumn.style.marginTop = '0vh';
    });

    survey_area.appendChild(close_survey);


    //end survey area 

  }

});

//