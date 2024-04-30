import { isAny } from "bpmn-js/lib/features/modeling/util/ModelingUtil";

export default class ConfirmForGDPRPath {
  constructor(popupMenu, bpmnReplace) {
    popupMenu.registerProvider("bpmn-replace", this);
    this.replaceElement = bpmnReplace.replaceElement;
  }

  getPopupMenuHeaderEntries(element) {
    return function (entries) {
      return entries;
    };
  }

  getPopupMenuEntries(element) {
    const self = this;
    const gdprPrefix=["consent"];

    return function (entries) {
      const confirmEntries = Object.entries(entries).reduce(
        (acc, [key, value]) => {
          console.log("key",key,"value",value,"action type",value.actionType,"acc",acc,"entries");
          const actionType = value.actionType;
          const requiresConfirmation = ["replace", "delete", "connect"].includes(actionType);
          const prefixId = element.id.split("_")[0]; 
          const isPrefixGdpr = gdprPrefix.includes(prefixId);

          console.log("isPrefixGdpr: " + isPrefixGdpr, "requiresConfirmation",requiresConfirmation)
          acc[key] = {
            ...value,
            action: () => {
              if(isPrefixGdpr && requiresConfirmation) {
              const confirmed = confirm("Proceed?");
              if (confirmed) {
                //value.action();
                window.alert("OKKKK")
              }
            }
            else{
              value.action();
            }
            },
          };

          return acc;
        },
        {}
      );
      console.log(entries, confirmEntries);
      return confirmEntries;
    };
  }
}

ConfirmForGDPRPath.$inject = ["popupMenu", "bpmnReplace"];

