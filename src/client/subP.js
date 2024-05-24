
    import BpmnJS from "bpmn-js/dist/bpmn-modeler.production.min.js";
    import "bpmn-js/dist/assets/diagram-js.css";
    import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
    import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
    import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

    import BpmnModdle from "bpmn-moddle";
    import BpmnModeler from "bpmn-js/lib/Modeler";
    import { getNewShapePosition } from "bpmn-js/lib/features/auto-place/BpmnAutoPlaceUtil.js";
    import camundaModdle from "camunda-bpmn-moddle/resources/camunda.json";

    import "bootstrap/dist/css/bootstrap.min.css";
    import "bootstrap/dist/js/bootstrap.bundle.min.js";

    import diagram from "../../resources/diagram.bpmn";
    import right_to_access from "../../resources/right_to_be_consent.bpmn";
    import right_to_portability from "../../resources/right_of_portability.bpmn";
    import right_to_rectify from "../../resources/right_to_rectify.bpmn";
    import right_to_object from "../../resources/right_to_object.bpmn";
    import right_to_object_to_automated_processing from "../../resources/right_to_object_to_automated_processing.bpmn";
    import right_to_restrict_processing from "../../resources/right_to_restrict_processing.bpmn";
    import right_to_be_forgotten from "../../resources/right_to_be_forgotten.bpmn";
    import right_to_be_informed_of_data_breaches from "../../resources/data_breach.bpmn";
    import consent_to_use_the_data from "../../resources/consent_to_use_the_data.bpmn";

    import BpmnViewer from "bpmn-js/dist/bpmn-viewer.production.min.js";

 
document.addEventListener("DOMContentLoaded", async () => {
    var SubProcessViewer = new BpmnViewer({
        container: '#subProcessCanvas',
    });

    var urlParams = new URLSearchParams(window.location.search);
    var id = urlParams.get('id');
    var title = id.replace(/_/g, ' ');
    title = title.charAt(0).toUpperCase() + title.slice(1);
    if (title == "Consent") title = "Consent to use the data";
    document.getElementById("typeDiagram").innerHTML = title;

    var diagramToPass = diagram;
    switch (id) {
        case "right_to_access":
            diagramToPass = right_to_access;
            break;
        case "right_to_portability":
            diagramToPass = right_to_portability;
            break;
        case "right_to_rectify":
            diagramToPass = right_to_rectify;
            break;
        case "right_to_object":
            diagramToPass = right_to_object;
            break;
        case "right_to_object_to_automated_processing":
            diagramToPass = right_to_object_to_automated_processing;
            break;
        case "right_to_restrict_processing":
            diagramToPass = right_to_restrict_processing;
            break;
        case "right_to_be_forgotten":
            diagramToPass = right_to_be_forgotten;
            break;
        case "right_to_be_informed_of_data_breaches":
            diagramToPass = right_to_be_informed_of_data_breaches;
            break;
        case "consent":
            diagramToPass = consent_to_use_the_data;
            break;
        default:
            break;
    }

    try {
        await SubProcessViewer.importXML(diagramToPass);
        SubProcessViewer.get('canvas').zoom('fit-viewport');

        // Enable zoom and panning
        var canvas = SubProcessViewer.get('canvas');
        console.log("canvas: " ,canvas)
        
        canvas._container.addEventListener('wheel', handleMouseWheel);


    } catch (err) {
        console.error('something went wrong:', err);
    }
});