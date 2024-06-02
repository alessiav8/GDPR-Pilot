//-----------------------------SUPPORTS FUNCTIONS-----------------------------------
import {
  yesdropDownA,
  yesdropDownB,
  yesdropDownC,
  yesdropDownD,
  yesdropDownE,
  yesdropDownF,
  yesdropDownG,
  yesdropDownH,
  yesdropDownI,
  yesdropDownL,
  nodropDownA,
  nodropDownB,
  nodropDownC,
  nodropDownD,
  nodropDownE,
  nodropDownF,
  nodropDownG,
  nodropDownH,
  nodropDownI,
  nodropDownL,
  addBPath,
  openDropDown,
  removeChatGPTTip,
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
} from "./app.js";

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

function addTextBelowButton(Id, answer) {
  var buttonId;
  if (answer.match(/\[.*?\]/)) {
    buttonId = "no_" + Id;
    const arrayMatch = answer.match(/\[.*?\]/);
    if (arrayMatch) {
      try {
        const array = JSON.parse(arrayMatch);
        if (array) {
          console.log("Array of activities", array);
          localStorage.setItem("activities_suggested", JSON.stringify(array));
        }
      } catch (e) {
        console.error("Errore nel parsing dell'array:", e);
      }
    }
  } else if (answer.includes("yes") || answer.includes("Yes")) {
    buttonId = "yes_" + Id;
  } else {
    buttonId = "no_" + Id;
  }
  const button = document.getElementById(buttonId);
  if (button && !document.getElementById("p_" + button)) {
    button.style.backgroundColor = "rgba(16, 173, 116, 0.3)";
    const textElement = document.createElement("p");
    textElement.innerHTML = "Suggested by <br>OpenAI";
    textElement.style.marginTop = "5px";
    textElement.style.fontSize = "10px";
    textElement.style.color = "rgba(16, 173, 116)";
    textElement.id = "p_" + buttonId;
    button.parentNode.insertBefore(textElement, button.nextSibling);
  }
}

async function predictionChatGPT(id) {
  try {
    const currentXML = await getXMLOfTheCurrentBpmn();
    const descriptionReq = await callChatGpt(
      "I give you the xml of a bpmn process, can you give me back the description of the objective of this process? No list or other stuff. Just a brief description of at most 30 lines." +
        currentXML
    );
    const description = descriptionReq.content;
    const activitiesSet = await getActivities();
    switch (id) {
      case "dropDownA":
        const hasPersonalDataReq = await callChatGpt(
          "Given the description of a bpmn process that i provide to you, are you able to say to me if the process handle some personal data? Definition of personal data: Personal data refers to any information that relates to an identified or identifiable individual. This encompasses a wide range of details that can be used to distinguish or trace an individual’s identity, either directly or indirectly. According to the General Data Protection Regulation (GDPR) in the European Union, personal data includes, but is not limited to:Name: This could be a full name or even initials, depending on the context and the ability to identify someone with those initials. Identification numbers: These include social security numbers, passport numbers, driver’s license numbers, or any other unique identifier. Location data: Any data that indicates the geographic location of an individual, such as GPS data, addresses, or even metadata from electronic devices.Online identifiers: These include IP addresses, cookie identifiers, and other digital footprints that can be linked to an individual.Physical, physiological, genetic, mental, economic, cultural, or social identity: This broad category includes biometric data, health records, economic status, cultural background, social status, and any other characteristic that can be used to identify an individual.The GDPR emphasizes that personal data includes any information that can potentially identify a person when combined with other data, which means that even seemingly innocuous information can be considered personal data if it contributes to identifying an individual. You have to answer just Yes or No, nothing more and if you are not sure answer no. The description you have to analyze" +
            description +
            " and the xml",
          +currentXML,
          " an example of activities that involves personal data are: Request personal data, request name and surname, request phone number ecc... the answer should be or ['Activity_id_1',...] or [] no one world more"
        );
        const hasPersonalData = hasPersonalDataReq.content;
        console.log("Prediction", hasPersonalData);
        addTextBelowButton(id, hasPersonalData);

        break;
      case "dropDownB":
        const hasConsentReq = await callChatGpt(
          "Analyze the given BPMN process described below:" +
            description +
            "and the provided XML of the process:" +
            currentXML +
            ".\n\nDefinition of Consent to Use the Data: When retrieving personal data, the Data Controller needs to ask the Data Subject for consent. If consent has already been obtained for a certain set of data, it is not necessary to ask for consent again. Consent is required only for handling personal data. Personal data includes:\n- Biographical data (e.g., first and last names, pictures)\n- Identification numbers (e.g., social security number, IP address, license plate number)\n- Sensitive data (e.g., racial or ethnic origin, religious beliefs, political opinions, trade union membership, health or sex life)\n- Genetic, biometric data, and data related to sexual orientation\n- Judicial data (e.g., criminal convictions and offenses)\n\nTask: Identify which activities require consent before execution based on the provided list of activities. Ensure that the consent is not already present in the process.\n\nInstructions:\n1. Review the provided list of activities:" +
            activitiesSet +
            ".\n2. Determine which activities handle personal data and require consent. This analysis should be based on the name given to the activities and their descriptions. You can find the name in the XML in the businessObject or in the list provided. To consider an activity, the name of the activity must clearly suggest that the activity handles personal data from the data subject.\n3. Ensure that the consent for these activities has not been requested previously in the process.\n4. If multiple activities require consent, only include the first one that appears for each unique set of personal data.\n5. Print an array with the IDs of activities that require consent and for which consent is not already present. Only include IDs from the provided list.\n6. If no activities require consent, print an empty array.\n\nAdditional Instructions:\n- Analyze the names and descriptions of the activities carefully to understand their purpose. Ensure that the activities indeed handle personal data as defined above.\n- Consider the entire process to ensure accuracy.\n\nOutput: Provide a precise answer based on the analysis of the BPMN process and the list of activities. The answer must be or an array with the activities or an empty array [], nothing more" +
            "\n\n example that could be considered activity that handles personal data from the data subject is like: 'Request Personal Data', 'Request Name and Surname','Request City of provenience, City of Birth' ecc... the name must indicates the request of some personal data directly, you don't have to suppose it, if is not clearly indicated in the name ignore that activity, and before the activity, must miss a consent request in the process. The request of data should be considered if and only if is about PERSONAL DATA, portability, right to access, objection, and other stuff must not be taken in consideration "
        );

        const hasConsent = hasConsentReq.content;
        console.log("Has Consent?", hasConsent);
        addTextBelowButton(id, hasConsent);
        break;
      case "dropDownC":
        const hasRightToAccessReq = await callChatGpt(
          "Analyze the given BPMN process described below:" +
            description +
            "and the provided XML of the process:" +
            currentXML +
            ".\n\nDefinition of Right to Access: At any moment, the Data Subject (the person the data is about) can request access and rectify to their personal data from the Data Controller (the entity that collects and processes the data). The Data Controller must satisfy these requests.\n\nTask: Check if there is an activity where the Data Subject requests access to their personal data from the Data Controller. This request must be initiated by the Data Subject and addressed to the Data Controller, not the other way around.\n\nInstructions:\n1. Identify if there is an activity where the Data Subject requests their personal data from the Data Controller.\n2. Check if this activity involves two different participants: the Data Subject and the Data Controller. They must be different participants in the BPMN model (tagged as 'bpmn:Participant').\n3. Ensure that the sequence flow indicates the request originates from the Data Subject to the Data Controller, not the reverse.\n4. If you find such an activity, reply 'Yes'.\n5. If you do not find such an activity or if the process does not contain participants, reply 'No'.\n\nMotivation: Explain your answer briefly. Ensure that the activity you identify clearly shows a request from the Data Subject to the Data Controller and involves separate participants."
        );
        const hasRightToAccess = hasRightToAccessReq.content;
        console.log("Has Right To access?", hasRightToAccess);
        addTextBelowButton(id, hasRightToAccess);
        break;
      case "dropDownD":
        const hasRightOfPortabilityReq = await callChatGpt(
          "Analyze the given BPMN process described below:" +
            description +
            "this is the XML of the process where you can analyze every connection and every activity. Make the analysis of the process considering the name of the activities you find in the process and by considering the logic behind the process itself." +
            currentXML +
            ".\n\nDefinition of Right of Portability: At any moment, the Data Subject (the person the data is about) can ask for the portability of the data associated with her to third parties and the Data Controller (the entity that collects the data of the subject) has the obligation to satisfy this request.\n\nTask: Check if there is a clearly separation between the data controller and the data subject, they should be impersonated by two different participant (xml tag: 'bpmn:Participant').\n\nInstructions:\n1. Identify if there is an activity where the Data Subject requests the portability of its personal data to the Data controller. The request must be started by the data subject and must arrive at the Data Controller, check the Message Flow in the xml. If this is the case, print just 'Yes' as answer. If this is not the case, search for an activity which from the name, makes you guess that it handles the user's right of portability. an example of a name might be 'Right of portability handler' or 'Right of Portability'. If there aren't two different participant that can impersonate Data Subject and Data controller, just search for an activity which from the name, makes you guess that it handles the user's right of portability,like in the previous case. If you find it print just 'Yes' as answer, otherwise, print just 'No' as answer.\n Another case in which you can print 'Yes' as answer is when there is an activity in which tis requested the permission to port the data (data portability) and the process has a gateway for which the data portability proceeds if and only if the permission is granted. \n2. In every other case, or in case of insecurity, print 'No' as answer, give a brief motivation for you answer "
        );
        const hasRightOfPortability = hasRightOfPortabilityReq.content;
        console.log("hasRightOfPortabilityReq?", hasRightOfPortability);
        addTextBelowButton(id, hasRightOfPortability);
        break;
      case "dropDownE":
        const hasRightToRectifyReq = await callChatGpt(
          "Analyze the given BPMN process described below:" +
            description +
            "and the provided XML of the process:" +
            currentXML +
            ".\n\nDefinition of Right to Rectify: At any moment, the Data Subject (the person the data is about) can request rectify her personal data to the Data Controller (the entity that collects and processes the data). The Data Controller must satisfy these requests.\n\nTask: Check if there is an activity where the Data Subject requests a modification of her personal data to the Data Controller. This request must be initiated by the Data Subject and addressed to the Data Controller, not the other way around, check the Message Flow in the xml.\n\nInstructions:\n1. Identify if there is a clearly separation between the data subject and the data controller, they must be two different participants (xml tag 'bpmn:Participant' or 'bpmnio:Participant')and if exists an activity where the Data Subject requests their personal data from the Data Controller. If there is, print 'Yes' as answer.\n2 If you do not find such an activity or if the process does not contain participants, check if in the xml exists an event in which arrive a request of rectification and if it is satisfied, you can print 'Yes' otherwise, also in case of insecurity, just print 'No' .\n\nMotivation: Explain your answer briefly. Ensure that the activity you identify clearly shows a request from the Data Subject to the Data Controller and involves separate participants."
        );
        const hasRightToRectify = hasRightToRectifyReq.content;
        console.log("Has Right To access?", hasRightToRectify);
        addTextBelowButton(id, hasRightToRectify);
        break;
      case "dropDownF":
        const hasRightToObjectReq = await callChatGpt(
          "Analyze the given BPMN process described below:" +
            description +
            "this is the XML of the process where you can analyze every connection and every activity. Make the analysis of the process considering the name of the activities you find in the process and by considering the logic behind the process itself." +
            currentXML +
            ".\n\nDefinition of Right to Object: At any moment, the Data Subject (the person the data is about) has the right to object to certain types of data processing such as direct marketing.The Data Controller (the entity that collects the data of the subject) shall no longer process the personal data unless she demonstrates compelling legitimate grounds for the processing that override the interests and rights of the Data Subject.\n\nTask: Check if there is a clearly separation between the data controller and the data subject, they should be impersonated by two different participant (xml tag: 'bpmn:Participant').\n\nInstructions:\n1. Identify if there is an activity where the Data Subject communicate her will to object to a certain data processing, also check if the data controller welcomes the request of the data subject and stop that processing. If you find this behavior print 'Yes' as answer. If the Data controller does not welcomes the request of the data subject print 'No' as answer.If there aren't two different participant in the xml, check if there is the request of consent if there is some activity that by the name indicates some kind of data processing and check if the behavior depends on the answer received and so, if there is a gateway, for which if the data processing is allowed, the activity in which is executed is runned, otherwise is stopped. If you find this condition, you can print 'Yes' as answer in every other case, also in case of insecurity, print 'No' as answer. "
        );
        const hasRightToObject = hasRightToObjectReq.content;
        console.log("hasRightToObject?", hasRightToObject);
        addTextBelowButton(id, hasRightToObject);
        break;
      case "dropDownG":
        const hasRightToObjectAutomatedProcessingReq = await callChatGpt(
          "Analyze the given BPMN process described below:" +
            description +
            "this is the XML of the process where you can analyze every connection and every activity. Make the analysis of the process considering the name of the activities you find in the process and by considering the logic behind the process itself." +
            currentXML +
            ".\n\nDefinition of Right to Object to Automated Processing: At any moment, the Data Subject (the person the data is about) has the right to a decision based solely on automated processing, and that may significantly affect the Data Subject's freedoms, such as profiling.The Data Controller (the entity that collects the data of the subject) should implement suitable measure to safeguard the data subject's right and, if needed, stop the automated processing of personal data.\n\nTask: Check if there is a clearly separation between the data controller and the data subject, they should be impersonated by two different participant (xml tag: 'bpmn:Participant').\n\nInstructions:\n1. Identify if there is an activity where the Data Subject communicate her will to object to automated processing, also check if the data controller welcomes the request of the data subject and stop that automated processing or if it implements suitable measures to safeguard the data subject. If you find this behavior print 'Yes' as answer. If the Data controller does not welcomes the request of the data subject or if it does nothing after the arrive of the request,print 'No' as answer.If there aren't two different participant in the xml, check if there is the some event that report a request to stop/object the automated processing and if there is a gateway, for which if the automated processing request was welcomed, the activity in which is executed is run, otherwise is stopped. If you find this condition, you can print 'Yes' as answer. You can also print 'Yes' if you fins some activity that by the name indicates some kind of right to object to automated processing handler. in every other case, also in case of insecurity, print 'No' as answer. "
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
          "Analyze the given BPMN process described below:" +
            description +
            "this is the XML of the process where you can analyze every connection and every activity. Make the analysis of the process considering the name of the activities you find in the process and by considering the logic behind the process itself." +
            currentXML +
            ".\n\nDefinition of Right to Restrict Processing:It gives a Data Subject (the person the data is about) the right to limit the way an organization(data controller) uses her personal data, rather than requesting erasure.\n\nTask: Check if there is a clearly separation between the data controller and the data subject, they should be impersonated by two different participant (xml tag: 'bpmn:Participant').\n\nInstructions:\n1. Identify if there is an activity where the Data Subject communicate her will to restrict the processing of her data, also check if the data controller welcomes the request of the data subject and restrict the data for which the processing is allowed. If you find this behavior print 'Yes' as answer. If the Data controller does not welcomes the request of the data subject or if it does nothing after the arrive of the request,print 'No' as answer. If there aren't two different participant in the xml, check if there is some event that report a request to restrict the processing of the data and if there is a gateway, for which if the restrict processing request was welcomed, there is some activity for which the name indicates some restriction begin executed on the data of the subject processed. If you find this condition, you can print 'Yes' as answer. You can also print 'Yes' if you fins some activity that by the name indicates some kind of right to restrict processing handler. in every other case, also in case of insecurity, print 'No' as answer. "
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
          "Analyze the given BPMN process described below:" +
            description +
            "this is the XML of the process where you can analyze every connection and every activity. Make the analysis of the process considering the name of the activities you find in the process and by considering the logic behind the process itself." +
            currentXML +
            ".\n\nDefinition of Right to be Forgotten:If the Data Subject (the person the data is about) wants her data to be deleted, the Data controller has the obligation to satisfy this request.\n\nTask: Check if there is a clearly separation between the data controller and the data subject, they should be impersonated by two different participant (xml tag: 'bpmn:Participant').\n\nInstructions:\n1. Identify if there is an activity where the Data Subject communicate her will to be forgotten or where requesting the deletion of its data, also check if the data controller welcomes the request of the data subject and delete the data of the data subject. If you find this behavior print 'Yes' as answer. If the Data controller does not welcomes the request of the data subject or if it don't do anything the arrive of the request,print 'No' as answer. If there aren't two different participant in the xml, check if there is some event that report a request of the data subject to delete/remove her data  and if there is a gateway, for which if the deletion data request was welcomed, there is some activity for which the name indicates the deletion of the data was executed . If you find this condition, you can print 'Yes' as answer. You can also print 'Yes' if you fins some activity that by the name indicates some kind of right to be forgotten handler. in every other case, also in case of insecurity, print 'No' as answer. "
        );
        const hasRightToBeForgotten = hasRightToBeForgottenReq.content;
        console.log("hasRightToBeForgotten?", hasRightToBeForgotten);
        addTextBelowButton(id, hasRightToBeForgotten);
        break;
      case "dropDownL":
        const hasRightToBeInformedAboutDataBreachesReq = await callChatGpt(
          "Analyze the given BPMN process described below:" +
            description +
            "this is the XML of the process where you can analyze every connection and every activity. Make the analysis of the process considering the name of the activities you find in the process and by considering the logic behind the process itself." +
            currentXML +
            ".\n\nDefinition of Right to be Informed about data breaches :In case of data breach the Data controller has to communicate it within 72 hours to the National Authority as well as to the Data Subject. This constraint is not subject to any de minimis standard ,thus any data breach,regardless of its magnitude, needs to be always communicated along with the actions that will be performed to limit the damage.The only exception is the case in which the stolen data is not usable (ex encrypted).However,also in this case, the National Authority can force the Data Controller to communicate the breach to the data Subject.\n\nTask: Check if there is a clearly separation between the data controller, the national authority and the data subject, they should be impersonated by three different participant (xml tag: 'bpmn:Participant').\n\nInstructions:\n1. Identify if there is an activity where the Data Controller communicate the data breaches to the national authority and to the data subject. If you find this behavior print 'Yes' as answer. If there aren't three different participant in the xml, check if there is some events that trigger the send of a message to the national authority and to the data subject, to inform them about the data breaches,in that case, you can print 'Yes' as response.  You can also print 'Yes' if you fins some activity that by the name indicates some kind of data breach handler. in every other case, also in case of insecurity, print 'No' as answer. "
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
  } else if (valueButton == "No") {
    NoButton.style.border = "0.3 solid #10ad74";
  }

  YesButton.addEventListener("click", (event) => {
    switch (id) {
      case "dropDownA":
        yesdropDownA();
        break;
      case "dropDownB":
        yesdropDownB();
        break;
      case "dropDownC":
        yesdropDownC();
        break;
      case "dropDownD":
        yesdropDownD();
        break;
      case "dropDownE":
        yesdropDownE();
        break;
      case "dropDownF":
        yesdropDownF();
        break;
      case "dropDownG":
        yesdropDownG();
        break;
      case "dropDownH":
        yesdropDownH();
        break;
      case "dropDownI":
        yesdropDownI();
        break;
      case "dropDownL":
        yesdropDownL();
        break;
      default:
        break;
    }

    if (valueButton == null) {
      openDrop(id, "yes", true);
    } else {
      openDrop(id, "yes", false);
    }
  });

  NoButton.addEventListener("click", (event) => {
    switch (id) {
      case "dropDownA":
        nodropDownA();
        break;
      case "dropDownB":
        nodropDownB(false);
        break;
      case "dropDownC":
        nodropDownC();
        break;
      case "dropDownD":
        nodropDownD();
        break;
      case "dropDownE":
        nodropDownE();
        break;
      case "dropDownF":
        nodropDownF();
        break;
      case "dropDownG":
        nodropDownG();
        break;
      case "dropDownH":
        nodropDownH();
        break;
      case "dropDownI":
        nodropDownI();
        break;
      case "dropDownL":
        nodropDownL();
        break;
      default:
        break;
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
  const button = dropDown.querySelector(".btn");
  button.click();
  if (button) {
    button.style.border = " 0.0002vh solid #2CA912";
  } else {
    console.error("error in finding the button");
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

          const c2 = document.createElement("div");
          c2.className = "col-7";

          var c3 = null;

          const label = document.createElement("label");
          label.textContent =
            activity.name != null &&
            activity.name != undefined &&
            activity.name != ""
              ? activity.name
              : activity.id;

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
              c3 = document.createElement("div");
              c3.id = "c3_checkbox_" + activity.id;
              c3.innerHTML = "Suggested by OpenAI";
              c3.className = "col-2 checkbox-suggested";
              c3.style.marginTop = "2%";
            }
          }
          //

          checkbox.addEventListener("click", function (event) {
            if (event.target.checked == true) {
              colorActivity(event.target.value);
            } else {
              decolorActivity(event.target.value);
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

export {
  removeUlFromDropDown,
  createDropDown,
  createUlandSelectActivities,
  closeSideBarSurvey,
  addMetaInformation,
  getMetaInformationResponse,
  isGdprCompliant,
};
