import BpmnViewer from 'bpmn-js';
import piazzaDiagramViewer from '../resources/diagram.bpmn'; 

var viewer = new BpmnViewer({
  container: '#canvas'
});

viewer.importXML(pizzaDiagram).then(function(result) {

  const { warnings } = result;

  console.log('success !', warnings);

  viewer.get('canvas').zoom('fit-viewport');
}).catch(function(err) {

  const { warnings, message } = err;

  console.log('something went wrong:', warnings, message);
});