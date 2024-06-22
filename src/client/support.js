//-----------------------------SUPPORTS FUNCTIONS-----------------------------------
import {
  yesdropDownA,
  nodropDownA,
  nodropDownB,
  addBPath,
  openDropDown,
  removeChatGPTTip,
  yesHandler,
  noHandler,
} from "./questions.js";
import {
  getDiagram,
  removeConsentFromActivity,
  getActivities,
  reorderDiagram,
  cleanSelection,
  decolorEverySelected,
  colorActivity,
  decolorActivity,
  getAnswerQuestionX,
  callChatGpt,
  getXMLOfTheCurrentBpmn,
  fromXMLToText,
} from "./app.js";

import consent_to_use_the_data from "../../resources/consent_to_use_the_data.bpmn";
import right_to_access from "../../resources/right_to_be_consent.bpmn";
import right_to_portability from "../../resources/right_of_portability.bpmn";
import right_to_rectify from "../../resources/right_to_rectify.bpmn";
import right_to_object from "../../resources/right_to_object.bpmn";
import right_to_object_to_automated_processing from "../../resources/right_to_object_to_automated_processing.bpmn";
import right_to_restrict_processing from "../../resources/right_to_restrict_processing.bpmn";
import right_to_be_forgotten from "../../resources/right_to_be_forgotten.bpmn";
import right_to_be_informed_of_data_breaches from "../../resources/data_breach.bpmn";

import loading from "../../resources/loading.gif";
//close sideBarSurvey
function closeSideBarSurvey() {
  const mainColumn = document.querySelector(".main-column");
  const sidebarColumn = document.querySelector(".sidebar-column");
  const canvasRaw = document.querySelector("#canvas-raw");
  const spaceBetween = document.querySelector(".space-between");
  const survey_col = document.getElementById("survey_col");
  const survey_area = document.getElementById("survey_area");

  if (survey_col && survey_area) {
    survey_col.removeChild(document.getElementById("survey_area"));
    mainColumn.style.width = "100%";
    sidebarColumn.style.width = "0%";
    sidebarColumn.style.height = "0%";
    sidebarColumn.style.marginTop = "0vh";
  }
}
//

//function to open and close drop down
//drop: id of the current question
//type: button clicked yes/no
export async function openDrop(drop, type, open) {
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "L"];
  const letter = drop.split("dropDown")[1];
  const dropDownCurrent = "#ulCollapsedropDown" + letter;
  const CurrentLetterButton = document.querySelector(dropDownCurrent);
  CurrentLetterButton.setAttribute("class", "collapse");
  const index = letters.indexOf(letter);
  if (open) {
    if (
      (letter != "L" && letter != "B" && letter != "A") ||
      (letter == "A" && type == "yes") ||
      (letter == "B" && type == "yes")
    ) {
      const nextLetter = letters[index + 1];
      const dropDownNext = "#ulCollapsedropDown" + nextLetter;
      const NextLetterButton = document.querySelector(dropDownNext);
      NextLetterButton.setAttribute("class", "collapse show");
    }
  }
}
//

//function to add the text "Suggested by" under the right button
//ID: id of the dropDown in which the button is located
//answer: the result of the prediction
function addTextBelowButton(Id, answer) {
  var buttonId;
  var otherP;

  var yesButton = document.getElementById("yes_" + Id)
    ? document.getElementById("yes_" + Id)
    : true;
  var noButton = document.getElementById("no_" + Id)
    ? document.getElementById("no_" + Id)
    : true;
  if (yesButton) {
    var HasBorderY =
      yesButton.style &&
      !yesButton.style.border == "0.3vh solid rgb(16, 173, 116)"
        ? true
        : false;
  }
  if (noButton) {
    var HasBorderN =
      noButton.style &&
      !noButton.style.border == "0.3vh solid rgb(16, 173, 116)"
        ? true
        : false;
  }
  if (yesButton && noButton && !HasBorderY && !HasBorderN) {
    //if the answer contains an array --> answer related to question B
    if (answer.match(/\[.*?\]/)) {
      buttonId = "no_" + Id;
      const arrayMatch = answer.match(/\[.*?\]/);
      console.log("arrayMatch", arrayMatch);
      if (answer.match(/\[.*?\]/)) {
        buttonId = "no_" + Id;
        const arrayMatch = answer.match(/\[.*?\]/);
        if (arrayMatch) {
          try {
            const jsonString = arrayMatch[0];
            const cleanedJsonString = jsonString.replace(/\\/g, "");
            const array = JSON.parse(cleanedJsonString);
            if (array) {
              localStorage.setItem(
                "activities_suggested",
                JSON.stringify(array)
              );
            }
          } catch (e) {
            console.log("Errore nel parsing dell'array:", e);
          }
        }
      }
    } else if (answer.includes("yes") || answer.includes("Yes")) {
      buttonId = "yes_" + Id;
      otherP = "no_" + Id;
    } else {
      buttonId = "no_" + Id;
      otherP = "p_yes_" + Id;
    }
    //in case there is something missing
    const p1 = document.getElementById("p_" + buttonId);
    if (p1) p1.remove();
    const p2 = document.getElementById("p_" + otherP);
    if (p2) p2.remove();

    const button = document.getElementById(buttonId);

    if (button) {
      const myEvent = new CustomEvent("removeGif", { detail: { id: Id } });
      document.dispatchEvent(myEvent);
      button.style.backgroundColor = "rgba(16, 173, 116, 0.3)";
      const textElement = document.createElement("p");
      textElement.innerHTML = "AI Suggestion";
      textElement.style.marginTop = "5px";
      textElement.style.fontSize = "1.5vh";
      textElement.style.color = "rgba(16, 173, 116)";
      textElement.id = "p_" + buttonId;
      button.parentNode.insertBefore(textElement, button.nextSibling);
    }
  }
}
//

//function that send the right message to chatGPT in order to get the prediction about the question
//id: the id of the drop down related to the question ex. dropDownA
async function predictionChatGPT(id) {
  try {
    const currentXML = localStorage.getItem("currentXml");
    const description = localStorage.getItem("description");

    if (currentXML != "") {
      const activitiesSet = await getActivities();
      switch (id) {
        case "dropDownA":
          const hasPersonalDataReq = await callChatGpt(
            "Given the description of a bpmn process" +
              description +
              ", are you able to say if the process handle some personal data? Definition of personal data: Personal data refers to any information that relates to an identified or identifiable individual. This encompasses a wide range of details that can be used to distinguish or trace an individual’s identity, either directly or indirectly. According to the General Data Protection Regulation (GDPR) in the European Union, personal data includes, but is not limited to:Name: This could be a full name or even initials, depending on the context and the ability to identify someone with those initials. Identification numbers: These include social security numbers, passport numbers, driver’s license numbers, or any other unique identifier. Location data: Any data that indicates the geographic location of an individual, such as GPS data, addresses, or even metadata from electronic devices.Online identifiers: These include IP addresses, cookie identifiers, and other digital footprints that can be linked to an individual.Physical, physiological, genetic, mental, economic, cultural, or social identity: This broad category includes biometric data, health records, economic status, cultural background, social status, and any other characteristic that can be used to identify an individual.The GDPR emphasizes that personal data includes any information that can potentially identify a person when combined with other data, which means that even seemingly innocuous information can be considered personal data if it contributes to identifying an individual. You have to answer just Yes or No, nothing more and if you are not sure answer no." +
              " the textual description of the process is" +
              currentXML,
            "Check if there are activities that handle personal data. Some examples of activities that involves personal data are: Request personal data, request name and surname, request phone number, request cap of residence ecc... "
          );
          const hasPersonalData = hasPersonalDataReq.content;
          console.log("Personal data", hasPersonalData);
          addTextBelowButton(id, hasPersonalData);

          break;
        case "dropDownB":
          const hasConsentReq = await callChatGpt(
            "Analyze the given BPMN process described below:" +
              description +
              "and the provided text description of its XML " +
              currentXML +
              ".\n\nDefinition of Consent to Use the Data: When retrieving personal data, the Data Controller needs to ask the Data Subject for consent. If consent has already been obtained for a certain set of data, it is not necessary to ask for consent again. Consent is required only for handling personal data. Definition of personal data: Personal data refers to any information that relates to an identified or identifiable individual. This encompasses a wide range of details that can be used to distinguish or trace an individual’s identity, either directly or indirectly. According to the General Data Protection Regulation (GDPR) in the European Union, personal data includes, but is not limited to:Name: This could be a full name or even initials, depending on the context and the ability to identify someone with those initials. Identification numbers: These include social security numbers, passport numbers, driver’s license numbers, or any other unique identifier. Location data: Any data that indicates the geographic location of an individual, such as GPS data, addresses, or even metadata from electronic devices.Online identifiers: These include IP addresses, cookie identifiers, and other digital footprints that can be linked to an individual.Physical, physiological, genetic, mental, economic, cultural, or social identity: This broad category includes biometric data, health records, economic status, cultural background, social status, and any other characteristic that can be used to identify an individual.The GDPR emphasizes that personal data includes any information that can potentially identify a person when combined with other data, which means that even seemingly innocuous information can be considered personal data if it contributes to identifying an individual." +
              " \n\n General Task: Identify which activities require consent before being executed based on the provided text description of the process. Ensure that the consent is not already present in the process (Ex. already exists an activity that request the consent before requesting the personal data).\n" +
              ".\n1. Determine which activities handle personal data and require consent. This analysis should be based on the name given to the activities and their meaning (use the description to understand their scope). You can find the names and the ids  in the textual description i provided to you. To consider an activity, the name of the activity must clearly suggest that the activity handles personal data from the data subject." +
              "\n2. Ensure that the consent for these activities has not been requested previously in the process." +
              "\n3. If multiple activities require consent, only include the first one that appears for each unique set of personal data." +
              "\n4. Print an array with the IDs of the activities that require consent before being executed and for which the consent is not already present. Only include IDs of the activities (check the textual description). I must be able to call const arrayMatch = answer.match(/[.*?]/); const array = JSON.parse(arrayMatch); on it" +
              "+\n5. If no activities require consent, print an empty array []." +
              +"\n\nAdditional Instructions:\n- Ensure that the activities indeed handle personal data as defined above.\n- Consider the entire process to ensure accuracy.\n\nOutput: Provide a precise answer based on the analysis of the textual description of the process process. The answer must be or an array with the ids of the activities or an empty array [], nothing more" +
              "\n\n example that could be considered activity that handles personal data from the data subject is like: 'Request Personal Data', 'Request Name and Surname','Request City of provenience, City of Birth' ecc... the name must indicates the request of some personal data directly, you don't have to suppose it, if is not clearly indicated in the name ignore that activity, and before the activity, must miss a consent request in the process." +
              " The request of data should be considered if and only if is about PERSONAL DATA. The activities you choose should not be about data portability, right to access data, data breaches and the others gdpr requirements must not be taken in consideration " +
              'An Activity in the textual description is like this one: "<Activity name: 30 Days Type: StartEvent ID: Event_0x64qzk Exchange with other partecipations: no exchanges /> linked to:" so you can find the name, the type of the activity and its ID that is what you have to print if the activity handles personal data like this: ["Event_0x64qzk"]'
          );

          const hasConsent = hasConsentReq.content;
          console.log("Has Consent?", hasConsent);
          addTextBelowButton(id, hasConsent);
          break;
        case "dropDownC":
          const hasRightToAccessReq = await callChatGpt(
            "Analyzing the provided BPMN process described below: " +
              description +
              ".\nThis is the provided text description of its XML: \n" +
              currentXML +
              ".\n\nDefinition of Right to Access: At any moment, the Data Subject (the person the data is about) can request access and rectification to their personal data from the Data Controller (the entity that collects and processes the data). The Data Controller must satisfy these requests.\n\nTask: Check if there is an activity where the Data Subject requests access to her personal data from the Data Controller." +
              " This request must be initiated by the Data Subject and addressed to the Data Controller, not the other way around." +
              "\n\nInstructions:\nn1 Identify if there are two or more different Participant " +
              "\n If the answer is yes" +
              ".Identify who is the data subject  (the person the data is about) and who is the data controller (the person who handle the datas) if there is an activity where the Data Subject (is a participant) requests her personal data from the Data Controller (is another partcipant different from the participant of the data subject). check if there is an activity in the Participant of the data controller where in the field 'Exchange with participant' you find the name of the participant of the Subject. If you find the viceversa is not valid" +
              "\n. Ensure that the sequence flow indicates the request originates from the Data Subject to the Data Controller, not the opposite." +
              "An example of this behavior could be: {Participant: Phone Company <Activity name: Request of the user to access its private data Type: StartEvent ID: Event_1n5smga Exchange with other partecipations: Receive a message from User /> linked to: <Activity name: Check Validity of the request Type: Task ID: Activity_170m1gv Exchange with other partecipations: no exchanges /> linked to: [Start Exclusive Gateway Gateway_0iyfbzs (only one of the path can be taken) condition to check in order to proceed with the right path 'is valid?' different paths: Path of Gateway_0iyfbzs taken if: 'yes' linked to <Activity name: allow the user to access their data Type: SendTask ID: Activity_02s2a6z Exchange with other partecipations: Send a message to User /> linked to Gateway_0lujbik Path of Gateway_0iyfbzs taken if: 'no' linked to Gateway_0lujbik End paths of ExclusiveGateway Gateway_0iyfbzs ] [Closure Exclusive Gateway Gateway_0lujbik] linked to: <Activity name: Request fullfield Type: EndEvent ID: Event_1ntbs1m Exchange with other partecipations: no exchanges /> End Participant: Phone Company} { Participant: User (empty pool) }" +
              "\n. If you find such a behavior, reply 'Yes'." +
              "\n. If you do not find such an activity or if a request to access stored data of some user is not welcomed without a reason, reply 'No'." +
              "\nn2 If there aren't two different partecipations, but ONLY IN THIS CASE, if you find two participants that can act Data Subject and data Controller, you have to find the Message Flow between them to consider a request of accessing data as it is, check if still exists this behavior without the two partecipation, taking in consideration the previous case, it could be:" +
              "{Participant: Phone Company <Activity name: Request of the user to access its private data Type: StartEvent ID: Event_1n5smga Exchange with other partecipations: no exchanges /> linked to: <Activity name: Check Validity of the request Type: Task ID: Activity_170m1gv Exchange with other partecipations: no exchanges /> linked to: [Start Exclusive Gateway Gateway_0iyfbzs (only one of the path can be taken) condition to check in order to proceed with the right path 'is valid?' different paths: Path of Gateway_0iyfbzs taken if: 'yes' linked to <Activity name: allow the user to access their data Type: SendTask ID: Activity_02s2a6z Exchange with other partecipations:no exchanges /> linked to Gateway_0lujbik Path of Gateway_0iyfbzs taken if: 'no' linked to Gateway_0lujbik End paths of ExclusiveGateway Gateway_0iyfbzs ] [Closure Exclusive Gateway Gateway_0lujbik] linked to: <Activity name: Request fullfield Type: EndEvent ID: Event_1ntbs1m Exchange with other partecipations: no exchanges /> End Participant: Phone Company}" +
              "\n\nMotivation: Briefly explain your answer. If you are not sure about the answer, please answer 'No'" +
              "The access to portability does not regard this requirement, don't take it in consideration"
          );

          const hasRightToAccess = hasRightToAccessReq.content;
          console.log("Has Right To access?", hasRightToAccess);
          addTextBelowButton(id, hasRightToAccess);
          break;
        case "dropDownD":
          const hasRightOfPortabilityReq = await callChatGpt(
            "Analyzing the provided BPMN process described below: " +
              description +
              ". This is the textual description of the process: " +
              currentXML +
              ".\n\nDefinition of Right of Portability: At any moment, the Data Subject (the person the data is about) can request the portability of the data associated with her to third parties, and the Data Controller (the entity that collects the data of the subject) has the obligation to satisfy this request." +
              "\n\nTask: \nn1 Check if there is a clear separation between the data controller and the data subject, they should be impersonated by two different participants ({Participant } in the textual representation)." +
              "\n\nInstructions:\n2. Identify if there is an activity where the Data Subject(a participant different from the participant of the data controller) requests the portability of her personal data to the Data Controller. The request must be initiated by the Data Subject and must arrive at the Data Controller check the exchanges of messages indicated in the textual description." +
              "If this is the case, print just 'Yes' as the answer. " +
              "an example of this behavior is " +
              "{Participant: Data Controller <Activity name: Start process Type: StartEvent ID: Event_099wcs6 Exchange with other partecipations: no exchanges /> linked to: <Activity name: Ask for portability Type: IntermediateThrowEvent ID: Event_1mblmkr Exchange with other partecipations: Send a message to bpmn:ParticipantParticipant_1kasvod /> linked to: <Activity name: Answer received Type: IntermediateCatchEvent ID: Event_1788d8h Exchange with other partecipations: Receive a message from bpmn:ParticipantParticipant_1kasvod /> linked to: [Start Exclusive Gateway Gateway_1p0aatu (only one of the path can be taken) condition to check in order to proceed with the right path 'Was portability allowed?' different paths: Path of Gateway_1p0aatu taken if: 'yes' linked to <Activity name: Port data to a third party Type: SendTask ID: Activity_0pxfr9m Exchange with other partecipations: no exchanges /> linked to Gateway_0yoku9o Path of Gateway_1p0aatu taken if: 'no' linked to Gateway_0yoku9o End paths of ExclusiveGateway Gateway_1p0aatu ] [Closure Exclusive Gateway Gateway_0yoku9o] linked to: <Activity name: End process Type: EndEvent ID: Event_073kzrc Exchange with other partecipations: no exchanges /> End Participant: Data Controller} { Participant: Participant_1kasvod (empty pool) }" +
              "\nn2 If there aren't two different participants that can impersonate Data Subject and Data Controller, search for an activity which, from the name, suggests that it handles the user's right of portability, like 'Right to Portability handler'. If you find it, print just 'Yes' as the answer; otherwise, print just 'No'. " +
              "Another case in which you can print 'Yes' as the answer is when there is an activity requesting permission to port the data (data portability), and the process has a gateway where data portability proceeds if and only if the permission is granted.\n2. In every other case, or in case of insecurity, print 'No' as the answer. Provide a brief motivation for your answer."
          );

          const hasRightOfPortability = hasRightOfPortabilityReq.content;
          console.log("hasRightOfPortabilityReq?", hasRightOfPortability);
          addTextBelowButton(id, hasRightOfPortability);
          break;
        case "dropDownE":
          const hasRightToRectifyReq = await callChatGpt(
            "Analyzing the provided BPMN process described below: " +
              description +
              ". This is the textual description of the XML of the process: " +
              currentXML +
              ".\n\nDefinition of Right to Rectify: At any moment, the Data Subject (the person the data is about) can request to rectify her personal data to the Data Controller (the entity that collects and processes the data). The Data Controller must satisfy these requests." +
              "\n\nTask: n1 check if there are two different participant, one must impersonate the data subject and one must impersonate the data controller." +
              " if there are two participant Check if there is an activity where the Data Subject requests a modification of her personal data to the Data Controller. there must be an exchanges of messages starting by the data subject and the data controller must allows the rectification" +
              "an example could be: " +
              "{ Participant: Participant_0t4txcj (empty pool) } {Participant: Participant_0wfkdnl <Activity name: Request of data rectification Type: StartEvent ID: Event_0c4vuea Exchange with other partecipations: Receive a message from bpmn:ParticipantParticipant_0t4txcj /> linked to: <Activity name: UNllow data rectification Type: SendTask ID: Activity_1jivsdy Exchange with other partecipations: Send a message to bpmn:ParticipantParticipant_0t4txcj /> linked to: <Activity name: bpmn:EndEvent Type: EndEvent ID: Event_06k7hmz Exchange with other partecipations: no exchanges /> End Participant: Participant_0wfkdnl}" +
              " This request must be initiated by the Data Subject and addressed to the Data Controller, not the other way around. Check the Message Flow in the textual description." +
              "If you find such a behavior print 'Yes' as the answer." +
              "\n2. If you do not find such an activity or if the process does not contain participants, check if in the textual description there exists an event in which a request for rectification arrives and if it is satisfied. If so, print 'Yes'; Or check if exists some kind of 'Right of rectification handler' if exists something that by the name suggested some kind of handling of this right, please print 'Yes'" +
              "The request of rectification must be satisfy, the case in which is denied, like this \n{ Participant: Participant_0t4txcj (empty pool) } {Participant: Participant_0wfkdnl <Activity name: Request of data rectification Type: StartEvent ID: Event_0c4vuea Exchange with other partecipations: Receive a message from bpmn:ParticipantParticipant_0t4txcj /> linked to: <Activity name: Deny the data rectification Type: SendTask ID: Activity_1jivsdy Exchange with other partecipations: Send a message to bpmn:ParticipantParticipant_0t4txcj /> linked to: <Activity name: bpmn:EndEvent Type: EndEvent ID: Event_06k7hmz Exchange with other partecipations: no exchanges /> End Participant: Participant_0wfkdnl} must not be taken in consideration, in this case the answer is 'No'" +
              "\nin case of insecurity, just print 'No'.\n\nMotivation: Briefly explain your answer. Ensure that the activity you identify clearly shows a request from the Data Subject to the Data Controller and involves separate participants." +
              "\nBe careful the right of access the data is not equal to the right of rectify them, you have to find a clear activity in which there is a request of rectification/modification. Also the deletion of the data must not be taken in consideration"
          );
          const hasRightToRectify = hasRightToRectifyReq.content;
          console.log("has Right To Rectify ", hasRightToRectify);
          addTextBelowButton(id, hasRightToRectify);
          break;
        case "dropDownF":
          const hasRightToObjectReq = await callChatGpt(
            "Analyzing the provided BPMN process described below: " +
              description +
              ". This is the textual description of the process, where you can analyze every connection and activity." +
              currentXML +
              " Perform the analysis of the process by considering the names of the activities and the logic behind the process itself: " +
              ".\n\nDefinition of Right to Object: At any moment, the Data Subject (the person the data is about) has the right to object to certain types of data processing, such as direct marketing. The Data Controller (the entity that collects the data of the subject) shall no longer process the personal data unless she demonstrates compelling legitimate grounds for the processing that override the interests and rights of the Data Subject." +
              "\n\nTask: Check if there is a clear separation between the data controller and the data subject, represented by two different participants (you must find two different {Participant} in the textual representation)." +
              "\n\nInstructions:\n1. Identify if there is an activity where the Data Subject communicates her will to object to a certain data processing. (ex Request of stop data processing) Also, check if the data controller acknowledges the request of the data subject and stops that processing. If you find this behavior, print 'Yes' as the answer." +
              " If the Data Controller does not acknowledge the request of the data subject, print 'No' as the answer." +
              " If there aren't two different participants in the textual description, check if there is a request from the data subject where her request to stop a certain type of data processing, or if there is some activity whose name indicates some kind of request like that, check if the request is welcomed by the data controller." +
              " If you find this behavior, you can print 'Yes' as the answer." +
              " In every other case, including cases of insecurity, print 'No' as the answer." +
              "Example of case in which you have to respond 'Yes'" +
              "{ Participant: user (empty pool) } {Participant: Company <Activity name: Request of stop data processing from the user Type: StartEvent ID: Event_0c4vuea Exchange with other partecipations: Receive a message from user /> linked to: <Activity name: Stop data processing Type: Task ID: Activity_1jivsdy Exchange with other partecipations: no exchanges /> linked to: <Activity name: End process Type: EndEvent ID: Event_06k7hmz Exchange with other partecipations: no exchanges /> End Participant: Company}" +
              ""
          );

          const hasRightToObject = hasRightToObjectReq.content;
          console.log("hasRightToObject?", hasRightToObject);
          addTextBelowButton(id, hasRightToObject);
          break;
        case "dropDownG":
          const hasRightToObjectAutomatedProcessingReq = await callChatGpt(
            "Analyzing the provided BPMN process described below: " +
              description +
              ". This is the textual description of the XML of the process, where you can analyze every connection and activity." +
              currentXML +
              " Perform the analysis of the process by considering the names of the activities and the logic behind the process itself: " +
              ".\n\nDefinition of Right to Object to Automated Processing: At any moment, the Data Subject (the person the data is about) has the right to object to a decision based solely on automated processing, and that may significantly affect the Data Subject's freedoms, such as profiling. The Data Controller (the entity that collects the data of the subject) should implement suitable measures to safeguard the data subject's right and, if needed, stop the automated processing of personal data." +
              "\n\nTask: Check if there is a clear separation between the data controller and the data subject, represented by two different participants (search for {Participant} in the textual representation')." +
              "\n\nInstructions:\n1. If there is a clear separation Identify if there is an activity where the Data Subject communicates her will to object to automated processing to the data controller (check if there is 'exchange with participants' from the data subject to the data controller in the textual representation ). Also, check if the data controller acknowledges the request of the data subject check if he  stops the automated processing or implements suitable measures to safeguard the data subject." +
              " If you find this behavior, print 'Yes' as the answer. If the Data Controller does not acknowledge the request of the data subject or if it takes no action after receiving the request, print 'No' as the answer." +
              " If there aren't two different participants in the textual description, check if there is an event that reports a request to stop/object the automated processing, and if there is a gateway that indicates whether the automated processing request was acknowledged, the activity in which it is executed is run; otherwise, it is stopped. If you find this condition, you can print 'Yes' as the answer." +
              " You can also print 'Yes' if you find some activity whose name indicates some kind of right to object to automated processing handling. In every other case, including cases of insecurity, print 'No' as the answer." +
              "Example of case you can answer 'Yes': \n { Participant: User (empty pool) } {Participant: Company <Activity name: Request to interrupt automated data processing Type: StartEvent ID: Event_0c4vuea Exchange with other partecipations: Receive a message from User /> linked to: <Activity name: Interrupt automated data processing Type: SendTask ID: Activity_1jivsdy Exchange with other partecipations: Send a message to User /> linked to: <Activity name: end Type: EndEvent ID: Event_06k7hmz Exchange with other partecipations: no exchanges /> End Participant: Company}" +
              "Process: <Activity name: bpmn:StartEvent Type: StartEvent ID: Event_03lz4i3 Exchange with other partecipations: no exchanges /> linked to: <Activity name: bpmn:Task Type: Task ID: Activity_1f7gg9f Exchange with other partecipations: no exchanges /> linked to: <Activity name: bpmn:Task Type: Task ID: Activity_0xq7izg Exchange with other partecipations: no exchanges /> linked to: <Activity name: bpmn:EndEvent Type: EndEvent ID: Event_0gma890 Exchange with other partecipations: no exchanges /> <Activity name: bpmn:StartEvent Type: StartEvent ID: Event_159sevf Exchange with other partecipations: no exchanges /> linked to: <Activity name: Handle Automated Processing Objection Type: Task ID: Activity_1u27rt4 Exchange with other partecipations: no exchanges /> linked to: <Activity name: bpmn:EndEvent Type: EndEvent ID: Event_0vkkept Exchange with other partecipations: no exchanges /> End Process" +
              "Process: <Activity name: bpmn:StartEvent Type: StartEvent ID: Event_03lz4i3 Exchange with other partecipations: no exchanges /> linked to: <Activity name: bpmn:Task Type: Task ID: Activity_1f7gg9f Exchange with other partecipations: no exchanges /> linked to: <Activity name: bpmn:Task Type: Task ID: Activity_0xq7izg Exchange with other partecipations: no exchanges /> linked to: <Activity name: bpmn:EndEvent Type: EndEvent ID: Event_0gma890 Exchange with other partecipations: no exchanges /> <Activity name: bpmn:StartEvent Type: StartEvent ID: Event_159sevf Exchange with other partecipations: no exchanges /> linked to: <Activity name: Right to Object to automated Processing Type: Task ID: Activity_1u27rt4 Exchange with other partecipations: no exchanges /> linked to: <Activity name: bpmn:EndEvent Type: EndEvent ID: Event_0vkkept Exchange with other partecipations: no exchanges /> End Process"
          );
          const hasRightToObjectAutomatedProcessing =
            hasRightToObjectAutomatedProcessingReq.content;
          console.log(
            "hasRightToObjectAutomatedProcessing?",
            hasRightToObjectAutomatedProcessing
          );
          addTextBelowButton(id, hasRightToObjectAutomatedProcessing);
          break;
        case "dropDownH":
          const hasRightToRestrictProcessingReq = await callChatGpt(
            "Analyze the provided BPMN process described below: " +
              description +
              ". This is the textual description of the xml of the process, where you can analyze every connection and activity." +
              currentXML +
              " Conduct the analysis of the process by considering the names of the activities and the logic behind the process itself: " +
              ".\n\nDefinition of Right to Restrict Processing: It gives a Data Subject (the person the data is about) the right to limit the way an organization (data controller) uses their personal data, rather than requesting erasure." +
              "\n\nTask: Check if there is a clear separation between the data controller and the data subject, represented by two different participants ({Participant} in the textual description')" +
              ".\n\nInstructions:\n1. If there is a separation between the participants, Identify if there is an activity where the Data Subject communicates her will to restrict the processing of their data. Also, check if the data controller acknowledges the request of the data subject and restricts the processing of the data accordingly." +
              "\nIf you find this behavior, print 'Yes' as the answer. " +
              "\nIf the Data Controller does not acknowledge the request of the data subject or if it takes no action after receiving the request, print 'No' as the answer." +
              "\n2If there aren't two different participants in the process, check if there is an event that reports a request to restrict the processing of the data, and if there is a gateway that indicates whether the restrict processing request was acknowledged, and if there is an activity whose name indicates some restriction being executed on the data of the subject processed. " +
              "\nIf you find this condition, you can print 'Yes' as the answer. You can also print 'Yes' if you find some activity whose name indicates some kind of right to restrict processing handling. In every other case, including cases of insecurity, print 'No' as the answer." +
              "Example of textual description that handle the right and for which you can answer 'Yes'\n { Participant: user (empty pool) } {Participant: Company <Activity name: Request to restrict data processing Type: StartEvent ID: Event_0c4vuea Exchange with other partecipations: Receive a message from user /> linked to: <Activity name: Restrict Processing Type: Task ID: Activity_1jivsdy Exchange with other partecipations: no exchanges /> linked to: <Activity name: End process Type: EndEvent ID: Event_06k7hmz Exchange with other partecipations: no exchanges /> End Participant: Company}" +
              "Example of textual description that handle the right and for which you can answer 'Yes'\n Process: <Activity name: bpmn:StartEvent Type: StartEvent ID: Event_080scd0 Exchange with other partecipations: no exchanges /> linked to: <Activity name: Handle right to restrict processing Type: Task ID: Activity_0dz581c Exchange with other partecipations: no exchanges /> linked to: <Activity name: bpmn:EndEvent Type: EndEvent ID: Event_0t2gigi Exchange with other partecipations: no exchanges />"
          );

          const hasRightToRestrictProcessing =
            hasRightToRestrictProcessingReq.content;
          console.log(
            "hasRightToRestrictProcessing?",
            hasRightToRestrictProcessing
          );
          addTextBelowButton(id, hasRightToRestrictProcessing);
          break;
        case "dropDownI":
          const hasRightToBeForgottenReq = await callChatGpt(
            "Analyze the provided BPMN process described below: " +
              description +
              ". This is the textual representation of the XML of the process, where you can analyze every connection and activity. Conduct the analysis of the process by considering the names of the activities and the logic behind the process itself: " +
              currentXML +
              ".\n\nDefinition of Right to be Forgotten: If the Data Subject (the person the data is about) wants their data to be deleted, the Data Controller has the obligation to satisfy this request." +
              "\n\nTask: Check if there is a clear separation between the data controller and the data subject, represented by two different participants ({Participant in the textual representation})." +
              "\n\nInstructions:\n1. Identify if there is an activity where the Data Subject communicates their desire to be forgotten or requests the deletion of het data. Also, check if the data controller acknowledges the request of the data subject and deletes the data accordingly." +
              "\nIf you find this behavior, print 'Yes' as the answer." +
              "\nIf the Data Controller does not acknowledge the request of the data subject or if it takes no action upon receiving the request, print 'No' as the answer. " +
              "\nn2If there aren't two different participants in the XML, check if there is an event that reports a request from the data subject to delete/remove her data, and if there is a gateway that indicates whether the deletion data request was acknowledged, and if there is an activity whose name indicates that the deletion of the data was executed." +
              "\n If you find this condition, you can print 'Yes' as the answer. You can also print 'Yes' if you find some activity whose name indicates some kind of right to be forgotten handling. In every other case, including cases of insecurity, print 'No' as the answer." +
              "Example of textual representation in which there is everything to replay 'Yes' to the question: \n { Participant: User (empty pool) } {Participant: Controller <Activity name: Request of data data deletion Type: StartEvent ID: Event_0c4vuea Exchange with other partecipations: Receive a message from User /> linked to: <Activity name: Delete data and inform the user Type: SendTask ID: Activity_1jivsdy Exchange with other partecipations: Send a message to User /> linked to: <Activity name: end Type: EndEvent ID: Event_06k7hmz Exchange with other partecipations: no exchanges /> End Participant: Controller}" +
              "Example of textual representation in which there is everything to replay 'Yes' to the question:\n Process: <Activity name: bpmn:StartEvent Type: StartEvent ID: Event_1wz4lq0 Exchange with other partecipations: no exchanges /> linked to: <Activity name: Handle Data deletion Type: Task ID: Activity_1qy0fyz Exchange with other partecipations: no exchanges /> linked to: <Activity name: bpmn:EndEvent Type: EndEvent ID: Event_0itlnkb Exchange with other partecipations: no exchanges /> End Process: "
          );

          const hasRightToBeForgotten = hasRightToBeForgottenReq.content;
          console.log("hasRightToBeForgotten?", hasRightToBeForgotten);
          addTextBelowButton(id, hasRightToBeForgotten);
          break;
        case "dropDownL":
          const hasRightToBeInformedAboutDataBreachesReq = await callChatGpt(
            "Analyze the provided BPMN process described below: " +
              description +
              ". This is the textual description of the process, where you can analyze every connection and activity. Conduct the analysis of the process by considering the names of the activities and the logic behind the process itself: " +
              currentXML +
              ".\n\nDefinition of Right to be Informed about Data Breaches: In the event of a data breach, the Data Controller is required to communicate it within 72 hours to the National Authority as well as to the Data Subject. This constraint is not subject to any de minimis standard; thus, any data breach, regardless of its magnitude, must always be communicated along with the actions that will be taken to limit the damage. The only exception is if the stolen data is not usable (e.g., encrypted). However, even in this case, the National Authority can compel the Data Controller to communicate the breach to the Data Subject." +
              "\n\nTask: Check if there is a clear separation between the data controller, the national authority, and the data subject. They should be represented by three different participants ({Participant } in the textual description)." +
              "\n\nInstructions:\n1. Identify if there is an activity where the Data Controller communicates the data breaches to the national authority and to the data subject. " +
              "\nIf you find this behavior, print 'Yes' as the answer." +
              "\n If there aren't three different participants in the XML, check if there are any events that trigger the sending of a message to the national authority and to the data subject to inform them about the data breaches." +
              "\n In that case, you can print 'Yes' as the response. You can also print 'Yes' if you find some activity that, by its name, indicates some kind of data breach handling. In every other case, including cases of insecurity, print 'No' as the answer." +
              "Example of correct process where you have to reply yes: \n { Participant: user (empty pool) } {Participant: Company <Activity name: Check if there are data breaches Type: Task ID: Activity_1jivsdy Exchange with other partecipations: no exchanges /> linked to: [Start Exclusive Gateway Gateway_0p619nk (only one of the path can be taken) condition to check in order to proceed with the right path 'Data breaches?' different paths: Path of Gateway_0p619nk taken if: 'Yes' linked to <Activity name: Inform the subject and the data authority Type: IntermediateThrowEvent ID: Event_0hpdw9n Exchange with other partecipations: Send a message to user National Authority /> linked to Gateway_1dwsutx Path of Gateway_0p619nk taken if: 'no' linked to Gateway_1dwsutx End paths of ExclusiveGateway Gateway_0p619nk ] [Closure Exclusive Gateway Gateway_1dwsutx] linked to: <Activity name: End Type: EndEvent ID: Event_12ew51e Exchange with other partecipations: no exchanges /> <Activity name: start Type: StartEvent ID: Event_0c4vuea Exchange with other partecipations: Receive a message from user /> linked to: End Participant: Company} { Participant: National Authority (empty pool) } "
          );

          const hasRightToBeInformedAboutDataBreaches =
            hasRightToBeInformedAboutDataBreachesReq.content;
          console.log(
            "hasRightToBeForgotten?",
            hasRightToBeInformedAboutDataBreaches
          );
          addTextBelowButton(id, hasRightToBeInformedAboutDataBreaches);
          break;
      }
    }
  } catch (e) {
    console.error("Error in prediction chatGPT", e);
  }
}

//function to create a drop down
//id:id to use for the dropdown ex "dropDownA"
//isExpanded: whether the dropdown must be expanded
//text Content: the macro title of the drop down
//questionText: the question itself
//isDisabled: is disabled or can me clicked?
//valueButton: if the question was answered with was the answer Yes or No
async function createDropDown(
  id,
  isExpanded,
  textContent,
  questionText,
  isDisabled,
  valueButton
) {
  //the row that will contain the drop down
  const space = document.querySelector("#areaDropDowns");
  const row = document.createElement("div");
  var addLoader = true;
  row.className = "row";
  //
  const dropDown = document.createElement("div");
  dropDown.className = "dropdown";
  dropDown.style.width = "100%";
  dropDown.id = id;

  if (valueButton == null) {
    predictionChatGPT(id);
  } else {
    removeChatGPTTip(id);
  }

  const button = document.createElement("button");
  button.className = "btn";
  button.setAttribute("type", "button");
  button.setAttribute("data-bs-toggle", "collapse");
  if (!isDisabled) {
    button.style.border = "0.00002vh solid";
    button.style.backgroundColor = "white";
  } else {
    button.removeAttribute("data-bs-toggle");
    button.style.border = "0.00002vh solid gray";
  }

  button.setAttribute("href", "#ulCollapse" + id);

  button.style.width = "100%";
  button.setAttribute("ariaExpanded", isExpanded);
  button.textContent = textContent;
  dropDown.appendChild(button);

  const ulContainer = document.createElement("div");
  ulContainer.id = "ulCollapse" + id;
  ulContainer.style.width = "100%";
  ulContainer.className = "collapse";

  const ul = document.createElement("div");
  ul.style.width = "100%";
  ul.className = "card card-body";

  ulContainer.appendChild(ul);

  const divQuestion = document.createElement("div");
  divQuestion.className = "container-centered";
  const question = questionText;
  const questionNode = document.createTextNode(question);

  divQuestion.appendChild(questionNode);

  const divButtons = document.createElement("div");
  divButtons.className = "row";
  divButtons.style.marginTop = "2vh";

  const yescol = document.createElement("div");
  yescol.className = "col  text-center";

  const nocol = document.createElement("div");
  nocol.className = "col  text-center";

  divButtons.appendChild(yescol);
  divButtons.appendChild(nocol);

  const YesButton = document.createElement("button");
  YesButton.className = "btn btn-light";
  YesButton.style.border = "0.01vh solid black";
  YesButton.textContent = "Yes";
  YesButton.id = "yes_" + id;

  const NoButton = document.createElement("button");
  NoButton.className = "btn btn-light";
  NoButton.style.border = "0.01vh solid black";
  NoButton.textContent = "No";
  NoButton.id = "no_" + id;

  if (valueButton == "Yes") {
    YesButton.style.border = "0.3 solid #10ad74";
    addLoader = false;
  } else if (valueButton == "No") {
    NoButton.style.border = "0.3 solid #10ad74";
    addLoader = false;
  }

  YesButton.addEventListener("click", async function (event) {
    switch (id) {
      case "dropDownA":
        yesdropDownA();
        break;
      case "dropDownB":
        yesHandler("B", "C");
        break;
      case "dropDownC":
        yesHandler("C", "D");
        break;
      case "dropDownD":
        yesHandler("D", "E");
        break;
      case "dropDownE":
        yesHandler("E", "F");
        break;
      case "dropDownF":
        yesHandler("F", "G");
        break;
      case "dropDownG":
        yesHandler("G", "H");
        break;
      case "dropDownH":
        yesHandler("H", "I");
        break;
      case "dropDownI":
        yesHandler("I", "L");
        break;
      case "dropDownL":
        yesHandler("L", null);
        break;
      default:
        break;
    }

    var comp = await checkCompleteness();
    if (comp) {
      setGdprButtonCompleted(true);
    }
    if (valueButton == null) {
      openDrop(id, "yes", true);
    } else {
      openDrop(id, "yes", false);
    }
  });

  NoButton.addEventListener("click", async function (event) {
    switch (id) {
      case "dropDownA":
        nodropDownA();
        break;
      case "dropDownB":
        nodropDownB(false);
        break;
      case "dropDownC":
        noHandler(
          right_to_access,
          "Access Request Received",
          "Access Request fulfilled",
          "right_to_access",
          "bpmn:MessageEventDefinition",
          "C",
          "D"
        );
        break;
      case "dropDownD":
        noHandler(
          right_to_portability,
          "Portability Request Received",
          "Portability Request fulfilled",
          "right_to_portability",
          "bpmn:MessageEventDefinition",
          "D",
          "E"
        );
        break;
      case "dropDownE":
        noHandler(
          right_to_rectify,
          "Rectification Request Received",
          "Rectification Request fulfilled",
          "right_to_rectify",
          "bpmn:MessageEventDefinition",
          "E",
          "F"
        );
        break;
      case "dropDownF":
        noHandler(
          right_to_object,
          "Objection Request Received",
          "Objection Request fulfilled",
          "right_to_object",
          "bpmn:MessageEventDefinition",
          "F",
          "G"
        );
        break;
      case "dropDownG":
        noHandler(
          right_to_object_to_automated_processing,
          "Objection to Automated Processing Request Received",
          "Objection to Automated Processing Request fulfilled",
          "right_to_object_to_automated_processing",
          "bpmn:MessageEventDefinition",
          "G",
          "H"
        );
        break;
      case "dropDownH":
        noHandler(
          right_to_restrict_processing,
          "Processing Restriction Request Received",
          "Processing Restrict Request fulfilled",
          "right_to_restrict_processing",
          "bpmn:MessageEventDefinition",
          "H",
          "I"
        );
        break;
      case "dropDownI":
        noHandler(
          right_to_be_forgotten,
          "Request to be Forgotten Received",
          "Request to be Forgotten fulfilled",
          "right_to_be_forgotten",
          "bpmn:MessageEventDefinition",
          "I",
          "L"
        );
        break;
      case "dropDownL":
        noHandler(
          right_to_be_informed_of_data_breaches,
          "Data Breach occurred",
          "Data Breach Managed",
          "right_to_be_informed_of_data_breaches",
          "bpmn:MessageEventDefinition",
          "L",
          null
        );
        break;
      default:
        break;
    }
    var comp2 = await checkCompleteness();
    if (comp2) {
      setGdprButtonCompleted(true);
    }
    if (valueButton == null && id != "dropDownB") {
      openDrop(id, "no", true);
    } else if (id != "dropDownB") {
      openDrop(id, "no", false);
    }
  });

  yescol.appendChild(YesButton);
  nocol.appendChild(NoButton);

  ul.appendChild(divQuestion);
  ul.appendChild(divButtons);
  if (addLoader) {
    questionDone(id);

    const divLoading = document.createElement("div");
    divLoading.style.justifyContent = "center";
    divLoading.style.alignItems = "center";
    //divLoading.style.marginLeft = "45%";
    divLoading.id = "imgLoader_" + id;

    const Loading = document.createElement("img");
    Loading.style.height = "4vh";
    Loading.style.width = "4vh";
    Loading.style.marginLeft = "45%";
    Loading.style.marginTop = "5%";

    Loading.src = loading;

    const textUnderLoading = document.createElement("div");
    textUnderLoading.innerHTML = "Loading AI suggestions";
    textUnderLoading.style.fontSize = "1.4vh";
    textUnderLoading.style.marginLeft = "29%";
    textUnderLoading.style.marginTop = "2%";
    textUnderLoading.style.color = "rgba(32, 170, 42, 1)";
    textUnderLoading.style.fontWeight = "bold";

    divLoading.appendChild(Loading);
    divLoading.appendChild(textUnderLoading);
    ul.appendChild(divLoading);
  }

  dropDown.appendChild(ulContainer);

  row.appendChild(dropDown);
  space.appendChild(row);

  return dropDown;
}
//end function create the dropDown

//funtion to set the gdpr button as completed or remove the complete button
export function setGdprButtonCompleted(isCompleted) {
  const gdpr_button = document.querySelector("#gdpr_compliant_button");
  if (gdpr_button.style.backgroundColor != "rgb(44, 169, 18)" && isCompleted) {
    gdpr_button.style.backgroundColor = "#2CA912";
    gdpr_button.textContent = "GDPR compliance";
  } else {
    gdpr_button.style.border = "0.3vh solid #10ad74";
    gdpr_button.textContent = "Ensure GDPR compliance";
    gdpr_button.style.backgroundColor = "white";
  }
}
//

//function to remove ul from drop down and sign it as passed
function removeUlFromDropDown(dropDown) {
  const dropDownA = document.querySelector(dropDown);

  if (dropDownA) {
    const child = dropDownA.querySelector(".collapse");
    if (child) {
      while (child.firstChild) {
        child.removeChild(child.firstChild);
      }
      //dropDownA.removeChild(child);
      dropDownA.click();
      const button = dropDownA.querySelector(".btn");
      if (button) {
        button.setAttribute("data-bs-toggle", "");

        if (dropDown == "#dropDownA") button.className = "btn";
        button.style.border = "0.0002vh solid #2CA912";
        //button.style.borderRadius = "1vh";
        //button.style.marginTop = "0.3vh";
      } else {
        console.error("error in finding the button");
      }
    } else {
      console.log("Not possible to remove the child ul from the dropdownA");
    }
    dropDownA.removeAttribute("data-bs-toggle");
  } else {
    console.error("Elemento #dropDownA non trovato.");
  }
}
//end function to remove ul

//function to sign the question as done
export function questionDone(dD) {
  const dropDown = document.querySelector(dD);
  if (dropDown) {
    const button = dropDown.querySelector(".btn");
    if (button) {
      button.style.border = " 0.0002vh solid #2CA912";
      button.click();
    } else {
      console.error("error in finding the button");
    }
  }
}
//

function removeC3() {
  const c3Set = document.querySelectorAll(".checkbox-suggested");
  if (c3Set.length > 0) {
    c3Set.forEach((c3) => {
      c3.remove();
      c3 = null;
    });
  }
}

//function to create ul and handle activity selection
async function createUlandSelectActivities(
  dropDownID,
  titleText,
  activities_already_selected
) {
  cleanSelection();
  const dropDown = document.querySelector(dropDownID);
  const space = document.querySelector("#areaDropDowns");
  var activityFromMeta = [];
  const collapse = dropDown.querySelector(".collapse");

  if (collapse) {
    while (collapse.firstChild) {
      collapse.removeChild(collapse.firstChild);
    }

    const button = dropDown.querySelector(".btn");
    button.addEventListener("click", function (event) {
      const isOpen =
        button.className != "btn collapsed" || button.ariaExpanded == true;

      if (!isOpen) {
        decolorEverySelected();
      } else {
        //se il drop di C è aperto
        getAnswerQuestionX("questionB").then((result) => {
          if (result && result.length > 0) {
            activityFromMeta = result;
            result.forEach((act) => {
              colorActivity(act.id);
            });
          }
        });
        getActivities().then((result) => {
          if (result && result.length > 0) {
            result.forEach((act) => {
              const c = document.getElementById("checkbox_" + act.id);
              if (c && c.checked) {
                colorActivity(act.id);
              }
            });
          }
        });
      }
    });

    const ulDropDown = document.createElement("div");
    ulDropDown.className = "card card-body";
    collapse.appendChild(ulDropDown);

    const Title = document.createTextNode(titleText);
    const divTitle = document.createElement("div");
    divTitle.className = "container-centered";
    divTitle.appendChild(Title);

    const divActivities = document.createElement("div");
    divActivities.style.height = "15vh";
    divActivities.style.overflowY = "auto";
    divActivities.style.overflowX = "hidden";
    divActivities.style.marginLeft = "1vh";
    divActivities.style.marginTop = "1.5vh";

    ulDropDown.appendChild(divTitle);
    ulDropDown.appendChild(divActivities);

    try {
      const activities = await getActivities();
      if (activities.length === 0) {
        divActivities.style.display = "flex";
        divActivities.style.justifyContent = "center";
        divActivities.style.fontWeight = "bold";
        divActivities.textContent = "No activities available";
      } else {
        const form = document.createElement("form");

        activities.forEach((activity) => {
          const row = document.createElement("div");
          row.className = "row";
          row.id = "row_checkbox_" + activity.id;

          const c1 = document.createElement("div");
          c1.className = "col-1";
          c1.id = "col_checkbox_" + activity.id;

          const c2 = document.createElement("div");
          c2.className = "col-9";

          var c3 = null;

          const checkmark = document.createElement("span");
          checkmark.className = "checkmark";

          const label = document.createElement("label");
          label.textContent =
            activity.name != null &&
            activity.name != undefined &&
            activity.name != ""
              ? activity.name
              : activity.id;
          label.id = "label:" + activity.id;

          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.name = "activity";
          checkbox.value = activity.id;
          checkbox.id = "checkbox_" + activity.id;

          if (activities_already_selected) {
            if (
              activities_already_selected.some(
                (item) => item.id === activity.id
              )
            ) {
              checkbox.checked = true;
            } else {
              checkbox.checked = false;
            }
          }

          //if the activity is suggested by AI
          if (
            !activities_already_selected ||
            activities_already_selected.length == 0
          ) {
            const activitySuggested = JSON.parse(
              localStorage.getItem("activities_suggested")
            );
            if (
              activitySuggested &&
              activitySuggested.some((act) => act === activity.id) &&
              !document.getElementById("c3_checkbox_" + activity.id)
            ) {
              c2.className = "col-5";
              c3 = document.createElement("div");
              c3.id = "c3_checkbox_" + activity.id;
              c3.innerHTML = "AI Suggestion";
              c3.className = "col-4 checkbox-suggested";
              c3.style.marginTop = "2%";
              c3.style.fontSize = "1vh";
              checkbox.style.backgroundColor = "rgba(16, 173, 116, 0.3)";
              checkbox.style.border = "0.1em solid #2ca912";
            }
          }
          //

          checkbox.addEventListener("click", function (event) {
            if (event.target.checked == true) {
              colorActivity(event.target.value);
              checkbox.style.backgroundColor = "white";
              checkbox.style.border = " 0.1em solid black";
            } else {
              decolorActivity(event.target.value);
            }
          });

          label.addEventListener("click", function (event) {
            const id = label.id.split(":")[1];
            const checkbox = document.getElementById("checkbox_" + id);
            if (checkbox) {
              checkbox.checked = !checkbox.checked;
              if (checkbox.checked) {
                colorActivity(checkbox.value);
              } else {
                decolorActivity(checkbox.value);
              }
            }
          });

          c1.appendChild(checkbox);
          c2.appendChild(label);

          row.appendChild(c1);
          row.appendChild(c2);
          if (c3) row.appendChild(c3);

          form.appendChild(row);
        });

        const subDiv = document.createElement("div");
        subDiv.className = "row";
        subDiv.style.justifyContent = "center";

        const submitButton = document.createElement("button");
        submitButton.className = "btn btn-light btn-sm";
        submitButton.textContent = "Submit";
        submitButton.style.width = "30%";
        submitButton.type = "submit";
        submitButton.id = "submit_" + dropDownID;

        subDiv.appendChild(submitButton);
        ulDropDown.appendChild(form);
        ulDropDown.appendChild(subDiv);

        submitButton.addEventListener("click", async function (event) {
          // Prevent the default form submission behavior
          event.preventDefault();
          if (localStorage.getItem("activity_suggested")) {
            localStorage.remove("activities_suggested");
          }
          // Get the selected activities
          const selectedActivities = Array.from(
            form.querySelectorAll("input[name='activity']:checked")
          ).map((checkbox) =>
            activities.find((activity) => activity.id === checkbox.value)
          );

          // Update the button styles
          submitButton.style.border = "2px solid #2CA912";
          submitButton.style.backgroundColor = "white";

          // Call the questionDone function
          questionDone("#dropDownB");
          removeC3();

          removeChatGPTTip("dropDownB");

          try {
            // Get the setted activity
            const callSelected = await getSettedActivity("questionB");
            console.log("callSelected: ", callSelected);

            if (callSelected.length > 0) {
              // Remove consent from activities not selected
              callSelected.forEach((element) => {
                if (!selectedActivities.some((item) => item.id == element.id)) {
                  removeConsentFromActivity(element, "consent_");
                }
              });

              // Reorder the diagram

              reorderDiagram();
            }
            // Add the selected activities to the path
            addBPath(selectedActivities, activities_already_selected);
            // Open the dropdown
            openDrop("dropDownB", "yes", true);
            // Decolor every selected element
            decolorEverySelected();
          } catch (error) {
            console.error("Error during the process:", error);
          }
        });

        divActivities.appendChild(form);
      }
    } catch (e) {
      console.error("error in getting activities", e);
    }
  }
}
//end function to create ul and handle activity selection

//function to mark as completed some question
//metainfo structure
//{"MetaInfo1": "Value"}
//xml passed not parsed
async function addMetaInformation(metaInfo) {
  const xmlString = await getDiagram();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  // Verifica se il namespace `meta:` è già presente nel documento
  const existingMetaNamespace = xmlDoc.lookupNamespaceURI("meta");
  if (!existingMetaNamespace) {
    xmlDoc.documentElement.setAttributeNS(
      "http://www.w3.org/2000/xmlns/",
      "xmlns:meta",
      "http://example.com/metaInfo"
    );
  }

  const bpmnDocumentation = xmlDoc.createElementNS(
    "http://www.omg.org/spec/BPMN/20100524/MODEL",
    "bpmn:documentation"
  );
  bpmnDocumentation.setAttribute("id", "MetaInformation_gdpr");

  const bpmnMetaInfo = xmlDoc.createElementNS(
    "http://www.omg.org/spec/BPMN/20100524/MODEL",
    "bpmn:metaInfo"
  );

  Object.keys(metaInfo).forEach((key) => {
    const metaQuestionA = xmlDoc.createElementNS(
      existingMetaNamespace || "http://example.com/metaInfo",
      "meta:" + key
    );
    metaQuestionA.textContent = metaInfo[key];
    bpmnMetaInfo.appendChild(metaQuestionA);
  });

  bpmnDocumentation.appendChild(bpmnMetaInfo);

  const existingDocumentation = xmlDoc.querySelector(
    "bpmn\\:documentation[id='MetaInformation_gdpr']"
  );
  if (!existingDocumentation) {
    xmlDoc.documentElement.appendChild(bpmnDocumentation);
  } else {
    existingDocumentation.appendChild(bpmnMetaInfo);
  }

  const serializer = new XMLSerializer();
  const updatedXmlString = serializer.serializeToString(xmlDoc);
  return updatedXmlString;
}
//

//function to get metadata information
async function getMetaInformationResponse() {
  try {
    const xml = await getDiagram();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "application/xml");
    const questionElements = xmlDoc.querySelectorAll("modelMetaData")[0];
    const setOfQuestions = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "L"];
    var questions = {};
    setOfQuestions.forEach((letter) => {
      const valore =
        questionElements != undefined
          ? questionElements.getAttribute("question" + letter)
          : null;
      const res = valore != null ? JSON.parse(valore) : null;
      questions["question" + letter] = res;
    });
    questions["gdpr_compliant"] =
      questionElements != undefined
        ? questionElements.getAttribute("gdpr_compliant")
        : "false";
    return questions;
  } catch (error) {
    console.error("An error occurred in getMetaInformationResponse:", error);
    throw error;
  }
}
//

//function to check if is already gdpr compliant
async function isGdprCompliant() {
  try {
    const xml = await getDiagram();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "application/xml");
    const questionElements = xmlDoc.querySelectorAll("modelMetaData");

    if (questionElements.length > 0) {
      questionElements.forEach((element) => {
        const compliance = element.getAttribute("gdpr_compliant");
        if (compliance != null) {
          return compliance === true ? true : false;
        } else {
          return false;
        }
      });
    } else {
      return false;
    }
  } catch (error) {
    console.error("An error occurred in isGdprCompliant:", error);
    throw error;
  }
}
//

//function to get the set of activities ids from the set returned by the form submission
export function getActivitiesID(activities) {
  var setIds = new Set();
  activities.forEach((activity) => {
    setIds.add(activity.id);
  });
  return setIds;
}
//

//TODO: here miss the part were i add the already added activity maybe
//function to set the questions answers in json format
export function setJsonData(response, activities) {
  var setJson = new Set();
  setJson.add({ id: "response", value: response });
  if (activities) {
    activities.forEach((activity) => {
      setJson.add({ id: activity.id, value: activity.name });
    });
  }
  let arrayOggetti = Array.from(setJson);
  return JSON.stringify(arrayOggetti);
}
//end function

//function to get the set activities of a question
export async function getSettedActivity(question) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await getMetaInformationResponse();
      const questions = response;
      const requested_question = questions[question];
      var result = new Array();
      if (requested_question) {
        result = requested_question.filter((item) => item.id != "response");
      }
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}
//

export function displayDynamicAlert(message, type, time) {
  const alertContainer = document.getElementById("alertContainer");
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
  alertDiv.setAttribute("role", "alert");

  alertDiv.innerHTML = `
        <strong>Important!</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
  const closeButton = alertDiv.querySelector(".btn-close");
  closeButton.addEventListener("click", () => {
    alertDiv.remove();
  });
  alertContainer.appendChild(alertDiv);
  setTimeout(() => {
    alertDiv.remove();
  }, time);
}

export function displayDynamicPopUp(message) {
  return new Promise((resolve) => {
    const alertContainer = document.getElementById("alertContainer");

    if (!alertContainer) {
      console.error("alertContainer element not found");
      resolve(false);
      return;
    }

    const alertDiv = document.createElement("div");
    alertDiv.className = "alert alert-warning alert-dismissible fade show";
    alertDiv.setAttribute("role", "alert");
    alertDiv.style.position = "fixed";
    alertDiv.style.right = "50vh";
    alertDiv.style.left = "50vh";
    alertDiv.style.width = "50%";
    alertDiv.style.bottom = "82%";
    alertDiv.style.zIndex = "1050";
    alertDiv.style.backgroundColor = "white";
    alertDiv.style.border = "white";

    alertDiv.innerHTML = `<center>
      <strong>${message}</strong>
      <hr>
      <button type="button" class="btn btn-success yes-btn">Yes</button>
      <button type="button" class="btn btn-danger no-btn">No</button>
    </center>`;

    alertContainer.appendChild(alertDiv);

    alertDiv.querySelector(".yes-btn").addEventListener("click", () => {
      alertDiv.remove();
      resolve(true);
    });

    alertDiv.querySelector(".no-btn").addEventListener("click", () => {
      alertDiv.remove();
      resolve(false);
    });
  });
}

function readBlob(blob) {
  const reader = new FileReader();

  reader.onload = function (event) {
    const fileContent = event.target.result;
    console.log("File content: ", fileContent);
  };
  reader.readAsText(blob);
}

//check if the user has responded to all the questions
//return true if the user has responded to all
//return false otherwise
async function checkCompleteness() {
  var result = true;
  try {
    const responseSet = await getMetaInformationResponse();
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "L"];
    for (var i = 0; i < letters.length; i++) {
      if (responseSet["question" + letters[i]] == null) {
        result = false;
        break;
      }
    }
  } catch (error) {
    console.error("Errore durante il recupero delle informazioni meta:", error);
    result = false;
  }
  return result;
}
//

export {
  removeUlFromDropDown,
  createDropDown,
  createUlandSelectActivities,
  closeSideBarSurvey,
  addMetaInformation,
  getMetaInformationResponse,
  isGdprCompliant,
};
