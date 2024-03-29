import BpmnModeler from 'bpmn-js';

import diagram from '../resources/diagram.bpmn';

var viewer = new BpmnJS({
  container: '#canvas'
});

const export_button=document.getElementById('export_button');

try {
  viewer.importXML(diagram);

  console.log('success!');
  viewer.get('canvas').zoom('fit-viewport');
} catch (err) {
  console.error('something went wrong:', err);
}


export_button.addEventListener('click', function () {
  viewer.saveXML({ format: true, preamble: false })
      .then(({ xml, error }) => {
          if (error) {
              console.log(error);
          } else {
              download(xml, 'diagram.bpmn', 'text/xml');
          }
      })
      .catch(error => {
          console.log(error);
      });
});

export_button.addEventListener('mouseover', () =>{
  document.getElementById("label_export_button").innerHtml = "Export";
});

export_button.addEventListener('mouseout', () =>{
  document.getElementById("label_export_button").innerHtml = "";
});

function download(content, filename, contentType) {
  var a = document.createElement('a');
  var file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = filename;
  a.click();
}




