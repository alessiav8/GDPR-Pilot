import {
    is
  } from 'bpmn-js/lib/util/ModelUtil';
  
  import {
    assign
  } from 'min-dash';
  
  import right_to_access from "../../resources/right_to_be_consent.bpmn";

  export default function DisabledTypeChangeContextPadProvider(contextPad, bpmnReplace, elementRegistry, translate, viewer,second) {
    contextPad.registerProvider(this);
    this._bpmnReplace = bpmnReplace;
    this._elementRegistry = elementRegistry;
    this._translate = translate;
    this._viewer=viewer;
    this._second= second;
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
        translate = this._translate,
        viewer = this._viewer,
        second= this._second;

      function openNewPage(event) {
            viewer.detach();
            second.attachTo('#canvas');
            second.importXML(right_to_access);

            const back = document.getElementById('GoBackArrow');
            back.className = 'btn btn-primary';
            back.style.display="block";
            const container = second._container;
            container.appendChild(back);

            back.addEventListener('click',function(event){
              second.detach();
              viewer.attachTo('#canvas');
              back.style.display="none"
              

            })

            //const idToPass= (element.id.split("_")[0]=="consent") ? "consent" : element.id;
            //window.open("diagrams.html?id="+idToPass, '_blank');

      }
          
      
    return function(entries) {
      const idSplitted = element.id.split("_");
      if (element.id.split('_')[0] == "consent") {
        delete entries['replace'];
        delete entries['append.append-task'];
        delete entries['append.end-event'];
        delete entries['append.gateway'];
        delete entries['append.intermediate-event'];

        entries['open.new-page'] = {
          group: 'connect',
          className: 'bpmn-icon-subprocess-collapsed',
          title: translate('Open the related called process'),
          action: {
            click: openNewPage
          }
        };
        
      }
      else if (element.id.split('_')[0] == "right" && element.type!="bpmn:SequenceFlow") {
        delete entries['replace'];
        delete entries['append.append-task'];
        delete entries['append.end-event'];
        delete entries['append.gateway'];
        delete entries['append.intermediate-event'];
        delete entries['connect'];

        if(idSplitted[idSplitted.length -1 ] != "start" && idSplitted[idSplitted.length -1]!="end"){
          entries['open.new-page'] = {
            group: 'connect',
            className: 'bpmn-icon-subprocess-collapsed', // Sostituisci con l'icona desiderata
            title: translate('Open the related called process'),
            action: {
              click: openNewPage
            }
          };
        }

        
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
  
      return entries;
    };
  };