import {
    is
  } from 'bpmn-js/lib/util/ModelUtil';
  
  import {
    assign
  } from 'min-dash';
  
  export default function DisabledTypeChangeContextPadProvider(contextPad, bpmnReplace, elementRegistry, translate) {
    contextPad.registerProvider(this);
  
    this._bpmnReplace = bpmnReplace;
    this._elementRegistry = elementRegistry;
    this._translate = translate;
  }
  
  DisabledTypeChangeContextPadProvider.$inject = [
    'contextPad',
    'bpmnReplace',
    'elementRegistry',
    'translate'
  ];
  
  const gdprActivityQuestionsPrefix=[
    "consent","right"
  ]
  
  DisabledTypeChangeContextPadProvider.prototype.getContextPadEntries = function(element) {
    var bpmnReplace = this._bpmnReplace,
        elementRegistry = this._elementRegistry,
        translate = this._translate;
  
    return function(entries) {
      if (element.id.split('_')[0] == "consent") {
        delete entries['replace'];
      }
      else if (element.id.split('_')[0] == "right" && element.type!="bpmn:SequenceFlow") {
        delete entries['replace'];
        delete entries['append.append-task'];
        delete entries['append.end-event'];
        delete entries['append.gateway'];
        delete entries['append.intermediate-event'];
        delete entries['connect'];
      }
      else if(element.type=="bpmn:SequenceFlow"){
        const sourceId= element.source.id;
        const splitSourceId = sourceId.split("_");
        const suffixLength = splitSourceId[splitSourceId.length - 1].length + 1;
        const withoutEnd = sourceId.substring(0, sourceId.length - suffixLength);
        if(gdprActivityQuestionsPrefix.some(item => splitSourceId[0]==item )){
          delete entries['replace'];
          delete entries['delete'];
        }
      }
      console.log(entries);
  
      return entries;
    };
  };