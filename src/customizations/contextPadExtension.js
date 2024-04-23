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
  "consent",
]

DisabledTypeChangeContextPadProvider.prototype.getContextPadEntries = function(element) {
  var bpmnReplace = this._bpmnReplace,
      elementRegistry = this._elementRegistry,
      translate = this._translate;

  return function(entries) {
    if (gdprActivityQuestionsPrefix.some(item=> item==element.id.split('_')[0]) ) {
      delete entries['replace'];      
      delete entries['connect'];
    }
    return entries;
  };
};
