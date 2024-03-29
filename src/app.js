import BpmnModeler from 'bpmn-js';

import diagram from '../resources/diagram.bpmn';

var viewer = new BpmnJS({
  container: '#canvas'
});

try {

  viewer.importXML(diagram);

  console.log('success!');
  viewer.get('canvas').zoom('fit-viewport');
} catch (err) {

  console.error('something went wrong:', err);
}