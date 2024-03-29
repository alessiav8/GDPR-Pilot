import BpmnViewer from 'bpmn-js';

const piazzaDiagramViewer ='<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="4.0.0"><bpmn:process id="Process_1" isExecutable="true"><bpmn:startEvent id="StartEvent_1"/><bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Task_1"/><bpmn:task id="Task_1" name="Task 1"><bpmn:outgoing>Flow_2</bpmn:outgoing></bpmn:task><bpmn:sequenceFlow id="Flow_2" sourceRef="Task_1" targetRef="EndEvent_1"/><bpmn:endEvent id="EndEvent_1"/></bpmn:process></bpmn:definitions>';

var viewer = new BpmnViewer({
  container: '#canvas'
});

var modeler = new BpmnJS({
  container: '#canvas' 
});

viewer.importXML(piazzaDiagramViewer).then(function(result) {

  const { warnings } = result;

  console.log('success !', warnings);

  viewer.get('canvas').zoom('fit-viewport');
}).catch(function(err) {

  const { warnings, message } = err;

  console.log('something went wrong:', warnings, message);
});
