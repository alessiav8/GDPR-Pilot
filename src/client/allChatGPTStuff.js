//Non è il file che uso nel programma, questo racchiude tutto il codice dedicato a ChatGPT
const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios");
const OpenAI = require("openai");

app.use(
  cors({
    origin: "http://localhost:8080",
    methods: ["GET"],
    allowedHeaders: ["Content-Type"],
  })
);

const PORT = process.env.PORT || 3000;

const API_KEY = process.env.API_KEY;

const openai = new OpenAI({
  apiKey: API_KEY,
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  next();
});

app.get("/api/sensitive-data", async (req, res) => {
  const userMessage = req.query.message || "Hello!";
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: userMessage }],
      model: "gpt-3.5-turbo-16k",
    });

    res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
    res.json(completion.choices[0].message);
  } catch (error) {
    console.error(
      "Errore durante la richiesta di informazioni sensibili:",
      error
    );
    res.status(500).json({
      error: "Errore durante il recupero delle informazioni sensibili",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Il server è in esecuzione sulla porta ${PORT}`);
});

export async function callChatGpt(message) {
  const url = "http://localhost:3000/api/sensitive-data";
  try {
    const response = await axios.get(url, {
      params: {
        message:
          "Consider to be a GDPR(General Data Protection Regulation) expert that have to analyze how much a process is GDPR compliant. When I talk about different participant, you have to find in the xml different tags '<bpmn:Participant>' that communicates with message flow between them-self. The activities named 'Right to be Informed and to consent' must be taken into account just for the right to consent analysis, if i provide some other definition, like 'Right to access' or 'Right to Object' ecc.. please ignore those activities. " +
          message,
      },
    });
    return response.data;
  } catch (error) {
    console.error("There was a problem with the request:", error);
    throw error;
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
          "Given the description of a bpmn process that i will provide to you, are you able to say if the process handle some personal data? Definition of personal data: Personal data refers to any information that relates to an identified or identifiable individual. This encompasses a wide range of details that can be used to distinguish or trace an individual’s identity, either directly or indirectly. According to the General Data Protection Regulation (GDPR) in the European Union, personal data includes, but is not limited to:Name: This could be a full name or even initials, depending on the context and the ability to identify someone with those initials. Identification numbers: These include social security numbers, passport numbers, driver’s license numbers, or any other unique identifier. Location data: Any data that indicates the geographic location of an individual, such as GPS data, addresses, or even metadata from electronic devices.Online identifiers: These include IP addresses, cookie identifiers, and other digital footprints that can be linked to an individual.Physical, physiological, genetic, mental, economic, cultural, or social identity: This broad category includes biometric data, health records, economic status, cultural background, social status, and any other characteristic that can be used to identify an individual.The GDPR emphasizes that personal data includes any information that can potentially identify a person when combined with other data, which means that even seemingly innocuous information can be considered personal data if it contributes to identifying an individual. You have to answer just Yes or No, nothing more and if you are not sure answer no. The description you have to analyze" +
            description +
            " and the xml",
          +currentXML,
          "an example of activities that involves personal data are: Request personal data, request name and surname, request phone number ecc... "
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
            ".\n\nDefinition of Consent to Use the Data: When retrieving personal data, the Data Controller needs to ask the Data Subject for consent. If consent has already been obtained for a certain set of data, it is not necessary to ask for consent again. Consent is required only for handling personal data. Definition of personal data: Personal data refers to any information that relates to an identified or identifiable individual. This encompasses a wide range of details that can be used to distinguish or trace an individual’s identity, either directly or indirectly. According to the General Data Protection Regulation (GDPR) in the European Union, personal data includes, but is not limited to:Name: This could be a full name or even initials, depending on the context and the ability to identify someone with those initials. Identification numbers: These include social security numbers, passport numbers, driver’s license numbers, or any other unique identifier. Location data: Any data that indicates the geographic location of an individual, such as GPS data, addresses, or even metadata from electronic devices.Online identifiers: These include IP addresses, cookie identifiers, and other digital footprints that can be linked to an individual.Physical, physiological, genetic, mental, economic, cultural, or social identity: This broad category includes biometric data, health records, economic status, cultural background, social status, and any other characteristic that can be used to identify an individual.The GDPR emphasizes that personal data includes any information that can potentially identify a person when combined with other data, which means that even seemingly innocuous information can be considered personal data if it contributes to identifying an individual. \n\nTask: Identify which activities require consent before being executed based on the provided list of activities. Ensure that the consent is not already present in the process.\n" +
            activitiesSet +
            ".\n1. Determine which activities handle personal data and require consent. This analysis should be based on the name given to the activities and their descriptions. You can find the name in the XML in the businessObject or in the list provided. To consider an activity, the name of the activity must clearly suggest that the activity handles personal data from the data subject.\n2. Ensure that the consent for these activities has not been requested previously in the process.\n3. If multiple activities require consent, only include the first one that appears for each unique set of personal data.\n4. Print an array with the IDs of activities that require consent and for which consent is not already present. Only include IDs from the provided list.\n5. If no activities require consent, print an empty array [].\n\nAdditional Instructions:\n- Analyze the names and descriptions of the activities carefully to understand their purpose. Ensure that the activities indeed handle personal data as defined above.\n- Consider the entire process to ensure accuracy.\n\nOutput: Provide a precise answer based on the analysis of the BPMN process and the list of activities. The answer must be or an array with the activities or an empty array [], nothing more" +
            "\n\n example that could be considered activity that handles personal data from the data subject is like: 'Request Personal Data', 'Request Name and Surname','Request City of provenience, City of Birth' ecc... the name must indicates the request of some personal data directly, you don't have to suppose it, if is not clearly indicated in the name ignore that activity, and before the activity, must miss a consent request in the process. The request of data should be considered if and only if is about PERSONAL DATA, portability, right to access, objection, and other stuff must not be taken in consideration "
        );

        const hasConsent = hasConsentReq.content;
        console.log("Has Consent?", hasConsent);
        addTextBelowButton(id, hasConsent);
        break;
      case "dropDownC":
        const hasRightToAccessReq = await callChatGpt(
          "Analyzing the provided BPMN process described below: " +
            description +
            ". This is the XML of the process: " +
            currentXML +
            ".\n\nDefinition of Right to Access: At any moment, the Data Subject (the person the data is about) can request access and rectification to their personal data from the Data Controller (the entity that collects and processes the data). The Data Controller must satisfy these requests.\n\nTask: Check if there is an activity where the Data Subject requests access to her personal data from the Data Controller. This request must be initiated by the Data Subject and addressed to the Data Controller, not the other way around.\n\nInstructions:\n1. Identify if there is an activity where the Data Subject requests her personal data from the Data Controller.\n2. Check if this activity involves two different participants: the Data Subject and the Data Controller. They must be different participants in the BPMN model (tagged as 'bpmn:Participant').\n3. Ensure that the sequence flow indicates the request originates from the Data Subject to the Data Controller, not the opposite.\n4. If you find such an activity, reply 'Yes'.\n5. If you do not find such an activity or if the process does not contain participants or if a request to access stored data of some user is not welcomed, reply 'No'.\n\nMotivation: Briefly explain your answer. Ensure that the activity you identify clearly shows a request from the Data Subject to the Data Controller and involves separate participants."
        );

        const hasRightToAccess = hasRightToAccessReq.content;
        console.log("Has Right To access?", hasRightToAccess);
        addTextBelowButton(id, hasRightToAccess);
        break;
      case "dropDownD":
        const hasRightOfPortabilityReq = await callChatGpt(
          "Analyzing the provided BPMN process described below: " +
            description +
            ". This is the XML of the process: " +
            currentXML +
            ".\n\nDefinition of Right of Portability: At any moment, the Data Subject (the person the data is about) can request the portability of the data associated with her to third parties, and the Data Controller (the entity that collects the data of the subject) has the obligation to satisfy this request.\n\nTask: Check if there is a clear separation between the data controller and the data subject, they should be impersonated by two different participants (XML tag: 'bpmn:Participant').\n\nInstructions:\n1. Identify if there is an activity where the Data Subject requests the portability of her personal data to the Data Controller. The request must be initiated by the Data Subject and must arrive at the Data Controller. Check the Message Flow in the XML. If this is the case, print just 'Yes' as the answer. If there aren't two different participants that can impersonate Data Subject and Data Controller, search for an activity which, from the name, suggests that it handles the user's right of portability, like 'Right to Portability handler'. If you find it, print just 'Yes' as the answer; otherwise, print just 'No'. Another case in which you can print 'Yes' as the answer is when there is an activity requesting permission to port the data (data portability), and the process has a gateway where data portability proceeds if and only if the permission is granted.\n2. In every other case, or in case of insecurity, print 'No' as the answer. Provide a brief motivation for your answer."
        );

        const hasRightOfPortability = hasRightOfPortabilityReq.content;
        console.log("hasRightOfPortabilityReq?", hasRightOfPortability);
        addTextBelowButton(id, hasRightOfPortability);
        break;
      case "dropDownE":
        const hasRightToRectifyReq = await callChatGpt(
          "Analyzing the provided BPMN process described below: " +
            description +
            ". This is the XML of the process: " +
            currentXML +
            ".\n\nDefinition of Right to Rectify: At any moment, the Data Subject (the person the data is about) can request to rectify her personal data to the Data Controller (the entity that collects and processes the data). The Data Controller must satisfy these requests.\n\nTask: Check if there is an activity where the Data Subject requests a modification of her personal data to the Data Controller. This request must be initiated by the Data Subject and addressed to the Data Controller, not the other way around. Check the Message Flow in the XML.\n\nInstructions:\n1. Identify if there is a clear separation between the data subject and the data controller. They must be two different participants (XML tags 'bpmn:Participant' or 'bpmnio:Participant'). If such participants exist and there is an activity where the Data Subject requests her personal data from the Data Controller, print 'Yes' as the answer.\n2. If you do not find such an activity or if the process does not contain participants, check if in the XML there exists an event in which a request for rectification arrives and if it is satisfied. If so, print 'Yes'; otherwise, in case of insecurity, just print 'No'.\n\nMotivation: Briefly explain your answer. Ensure that the activity you identify clearly shows a request from the Data Subject to the Data Controller and involves separate participants."
        );

        const hasRightToRectify = hasRightToRectifyReq.content;
        console.log("Has Right To access?", hasRightToRectify);
        addTextBelowButton(id, hasRightToRectify);
        break;
      case "dropDownF":
        const hasRightToObjectReq = await callChatGpt(
          "Analyzing the provided BPMN process described below: " +
            description +
            ". This is the XML of the process, where you can analyze every connection and activity. Perform the analysis of the process by considering the names of the activities and the logic behind the process itself: " +
            currentXML +
            ".\n\nDefinition of Right to Object: At any moment, the Data Subject (the person the data is about) has the right to object to certain types of data processing, such as direct marketing. The Data Controller (the entity that collects the data of the subject) shall no longer process the personal data unless she demonstrates compelling legitimate grounds for the processing that override the interests and rights of the Data Subject.\n\nTask: Check if there is a clear separation between the data controller and the data subject, represented by two different participants (XML tag: 'bpmn:Participant').\n\nInstructions:\n1. Identify if there is an activity where the Data Subject communicates her will to object to a certain data processing. Also, check if the data controller acknowledges the request of the data subject and stops that processing. If you find this behavior, print 'Yes' as the answer. If the Data Controller does not acknowledge the request of the data subject, print 'No' as the answer. If there aren't two different participants in the XML, check if there is a request for consent, if there is some activity whose name indicates some kind of data processing, and check if the behavior depends on the answer received. If there is a gateway that indicates whether the data processing is allowed, the activity in which it is executed is run; otherwise, it is stopped. If you find this condition, you can print 'Yes' as the answer. In every other case, including cases of insecurity, print 'No' as the answer."
        );

        const hasRightToObject = hasRightToObjectReq.content;
        console.log("hasRightToObject?", hasRightToObject);
        addTextBelowButton(id, hasRightToObject);
        break;
      case "dropDownG":
        const hasRightToObjectAutomatedProcessingReq = await callChatGpt(
          "Analyzing the provided BPMN process described below: " +
            description +
            ". This is the XML of the process, where you can analyze every connection and activity. Perform the analysis of the process by considering the names of the activities and the logic behind the process itself: " +
            currentXML +
            ".\n\nDefinition of Right to Object to Automated Processing: At any moment, the Data Subject (the person the data is about) has the right to object to a decision based solely on automated processing, and that may significantly affect the Data Subject's freedoms, such as profiling. The Data Controller (the entity that collects the data of the subject) should implement suitable measures to safeguard the data subject's right and, if needed, stop the automated processing of personal data.\n\nTask: Check if there is a clear separation between the data controller and the data subject, represented by two different participants (XML tag: 'bpmn:Participant').\n\nInstructions:\n1. Identify if there is an activity where the Data Subject communicates her will to object to automated processing. Also, check if the data controller acknowledges the request of the data subject and stops the automated processing or implements suitable measures to safeguard the data subject. If you find this behavior, print 'Yes' as the answer. If the Data Controller does not acknowledge the request of the data subject or if it takes no action after receiving the request, print 'No' as the answer. If there aren't two different participants in the XML, check if there is an event that reports a request to stop/object the automated processing, and if there is a gateway that indicates whether the automated processing request was acknowledged, the activity in which it is executed is run; otherwise, it is stopped. If you find this condition, you can print 'Yes' as the answer. You can also print 'Yes' if you find some activity whose name indicates some kind of right to object to automated processing handling. In every other case, including cases of insecurity, print 'No' as the answer."
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
            ". This is the XML of the process, where you can analyze every connection and activity. Conduct the analysis of the process by considering the names of the activities and the logic behind the process itself: " +
            currentXML +
            ".\n\nDefinition of Right to Restrict Processing: It gives a Data Subject (the person the data is about) the right to limit the way an organization (data controller) uses their personal data, rather than requesting erasure.\n\nTask: Check if there is a clear separation between the data controller and the data subject, represented by two different participants (XML tag: 'bpmn:Participant').\n\nInstructions:\n1. Identify if there is an activity where the Data Subject communicates their will to restrict the processing of their data. Also, check if the data controller acknowledges the request of the data subject and restricts the processing of the data accordingly. If you find this behavior, print 'Yes' as the answer. If the Data Controller does not acknowledge the request of the data subject or if it takes no action after receiving the request, print 'No' as the answer. If there aren't two different participants in the XML, check if there is an event that reports a request to restrict the processing of the data, and if there is a gateway that indicates whether the restrict processing request was acknowledged, and if there is an activity whose name indicates some restriction being executed on the data of the subject processed. If you find this condition, you can print 'Yes' as the answer. You can also print 'Yes' if you find some activity whose name indicates some kind of right to restrict processing handling. In every other case, including cases of insecurity, print 'No' as the answer."
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
            ". This is the XML of the process, where you can analyze every connection and activity. Conduct the analysis of the process by considering the names of the activities and the logic behind the process itself: " +
            currentXML +
            ".\n\nDefinition of Right to be Forgotten: If the Data Subject (the person the data is about) wants their data to be deleted, the Data Controller has the obligation to satisfy this request.\n\nTask: Check if there is a clear separation between the data controller and the data subject, represented by two different participants (XML tag: 'bpmn:Participant').\n\nInstructions:\n1. Identify if there is an activity where the Data Subject communicates their desire to be forgotten or requests the deletion of their data. Also, check if the data controller acknowledges the request of the data subject and deletes the data accordingly. If you find this behavior, print 'Yes' as the answer. If the Data Controller does not acknowledge the request of the data subject or if it takes no action upon receiving the request, print 'No' as the answer. If there aren't two different participants in the XML, check if there is an event that reports a request from the data subject to delete/remove their data, and if there is a gateway that indicates whether the deletion data request was acknowledged, and if there is an activity whose name indicates that the deletion of the data was executed. If you find this condition, you can print 'Yes' as the answer. You can also print 'Yes' if you find some activity whose name indicates some kind of right to be forgotten handling. In every other case, including cases of insecurity, print 'No' as the answer."
        );

        const hasRightToBeForgotten = hasRightToBeForgottenReq.content;
        console.log("hasRightToBeForgotten?", hasRightToBeForgotten);
        addTextBelowButton(id, hasRightToBeForgotten);
        break;
      case "dropDownL":
        const hasRightToBeInformedAboutDataBreachesReq = await callChatGpt(
          "Analyze the provided BPMN process described below: " +
            description +
            ". This is the XML of the process, where you can analyze every connection and activity. Conduct the analysis of the process by considering the names of the activities and the logic behind the process itself: " +
            currentXML +
            ".\n\nDefinition of Right to be Informed about Data Breaches: In the event of a data breach, the Data Controller is required to communicate it within 72 hours to the National Authority as well as to the Data Subject. This constraint is not subject to any de minimis standard; thus, any data breach, regardless of its magnitude, must always be communicated along with the actions that will be taken to limit the damage. The only exception is if the stolen data is not usable (e.g., encrypted). However, even in this case, the National Authority can compel the Data Controller to communicate the breach to the Data Subject.\n\nTask: Check if there is a clear separation between the data controller, the national authority, and the data subject. They should be represented by three different participants (XML tag: 'bpmn:Participant').\n\nInstructions:\n1. Identify if there is an activity where the Data Controller communicates the data breaches to the national authority and to the data subject. If you find this behavior, print 'Yes' as the answer. If there aren't three different participants in the XML, check if there are any events that trigger the sending of a message to the national authority and to the data subject to inform them about the data breaches. In that case, you can print 'Yes' as the response. You can also print 'Yes' if you find some activity that, by its name, indicates some kind of data breach handling. In every other case, including cases of insecurity, print 'No' as the answer."
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
