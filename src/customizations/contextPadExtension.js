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
  this._contextPad = contextPad;
}

DisabledTypeChangeContextPadProvider.$inject = [
  'contextPad',
  'bpmnReplace',
  'elementRegistry',
  'translate'
];

const gdprActivityQuestionsPrefix=[
  "consent",
]
DisabledTypeChangeContextPadProvider.prototype.getContextPadEntries = function(element, contextPad) {

  var bpmnReplace = this._bpmnReplace,
      elementRegistry = this._elementRegistry,
      translate = this._translate,
      contextP= this._contextPad;

};
