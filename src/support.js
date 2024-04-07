//-----------------------------SUPPORTS FUNCTIONS-----------------------------------
import {yesdropDownA, nodropDownA,yesdropDownB,nodropDownB} from './questions.js';
import {getDiagram} from './app.js';


//close sideBarSurvey 
function closeSideBarSurvey(){
    const mainColumn = document.querySelector('.main-column');
    const sidebarColumn = document.querySelector('.sidebar-column');
    const canvasRaw = document.querySelector('#canvas-raw');
    const spaceBetween=document.querySelector('.space-between');
    const survey_col=document.getElementById('survey_col');

    survey_col.removeChild(document.getElementById("survey_area"));
    mainColumn.style.width = '100%';
    sidebarColumn.style.width = '0%';
    sidebarColumn.style.height = '0%';
    sidebarColumn.style.marginTop = '0vh';
}

//


//function to create a drop down
function createDropDown(id,isExpanded,textContent,questionText){
    //the row that will contain the drop down
    const space = document.querySelector("#areaDropDowns");
    const row= document.createElement("div");
    row.className="row";
    //
  
    const dropDown= document.createElement("div");
    dropDown.className="dropdown";
    dropDown.style.width="100%";
    dropDown.id=id;
  
    const button= document.createElement("button");
    button.className="btn btn-secodary dropdown-toggle";
    button.setAttribute('type', 'button');
    button.setAttribute('data-bs-toggle', 'dropdown');
    button.style.width="100%";
  
    button.setAttribute('ariaExpanded', isExpanded);
    button.textContent=textContent;
    dropDown.appendChild(button);
  
    const ul = document.createElement("ul");
    ul.style.width="94%";
    ul.className="dropdown-menu";
  
    const divQuestion= document.createElement("div");
    divQuestion.className="container-centered";
    const question=questionText;
    const questionNode = document.createTextNode(question);
  
    divQuestion.appendChild(questionNode);
  
    const divButtons= document.createElement("div");
    divButtons.className="row";
    divButtons.style.marginTop="2vh";
  
    const yescol = document.createElement("div");
    yescol.className="col  text-center";
  
    const nocol = document.createElement("div");
    nocol.className="col  text-center";
  
    divButtons.appendChild(yescol);
    divButtons.appendChild(nocol);
  
    const YesButton= document.createElement("button");
    YesButton.className="btn btn-primary";
    YesButton.textContent="Yes"
    YesButton.id="yes_"+id;
  
    const NoButton= document.createElement("button")
    NoButton.className="btn btn-primary";
    NoButton.textContent="No"
    NoButton.id="no_"+id;
  
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
          event.stopPropagation();
          break;
      }
    });
  
    NoButton.addEventListener("click", (event) => {
        switch (id) {
            case "dropDownA":
              nodropDownA();
              break;
            case "dropDownB":
                nodropDownB();
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
              event.stopPropagation();
              break;
          }
    });
  
    yescol.appendChild(YesButton);
    nocol.appendChild(NoButton);
  
  
    ul.appendChild(divQuestion);
    ul.appendChild(divButtons);
  
    dropDown.appendChild(ul);
  
    
    row.appendChild(dropDown);//add the dropDown in the raw 
    space.appendChild(row); //add the raw in the container
    return dropDown;
  }
//end function create the dropDown


//function to remove ul from drop down and sign it as passed
function removeUlFromDropDown(dropDown){
    const dropDownA = document.querySelector(dropDown);
    if (dropDownA) {
      const child= dropDownA.querySelector(".dropdown-menu");
      if(child) {
        dropDownA.removeChild(child);
        const button= dropDownA.querySelector(".btn");
        if(button){
          button.className="btn";
          button.style.boxShadow = "0 0 0 2px #2CA912"
          button.style.borderRadius="1vh"
          button.style.marginTop="0.3vh"
        }
        else{
          console.error("error in finding the button")
        }
  
      }
      else{
        console.log("Not possible to remove the child ul from the dropdownA");
      }
      dropDownA.removeAttribute("data-bs-toggle");
  
    } else {
      console.error("Elemento #dropDownA non trovato.");
    }
  }
//end function to remove ul

//function to create ul and handle activity selection
async function createUlandSelectActivities(dropDownID,titleText){
    const dropDown = document.querySelector(dropDownID);
    const space = document.querySelector("#areaDropDowns");

    const ulDropDown = dropDown.querySelector(".dropdown-menu");
    if(ulDropDown){
        ulDropDown.style.display = "block";

    while(ulDropDown.firstChild){
        ulDropDown.removeChild(ulDropDown.firstChild);
    }
    
    const Title = document.createTextNode(titleText);

    const divTitle = document.createElement("div");
    divTitle.className = "container-centered";
    divTitle.style.marginLeft = "1vh";
    divTitle.appendChild(Title);

    const divActivities = document.createElement("div");
    divActivities.style.height="10vh"
    divActivities.style.overflowY = "auto";
    divActivities.style.marginLeft = "1vh";
    divActivities.style.marginTop="1.5vh";

    ulDropDown.appendChild(divTitle);
    ulDropDown.appendChild(divActivities);

    try{ 
        const activities = await getActivities();
        if(activities.length == 0){
            divActivities.style.display = "flex";
            divActivities.style.justifyContent = "center";
            divActivities.style.fontWeight = "bold";
            divActivities.textContent = "No activities available";
            
        } else{

        const form = document.createElement("form");

        activities.forEach(activity => {
            const row = document.createElement("div");
            row.className = "row";
        
            const c1 = document.createElement("div");
            c1.className = "col-1";
        
            const c2 = document.createElement("div");
            c2.className = "col-9";
        
            const label = document.createElement("label");
            label.textContent = activity.name;
        
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.name = "activity";
            checkbox.value = activity.id;
        
            c1.appendChild(checkbox);
            c2.appendChild(label);
        
            row.appendChild(c1);
            row.appendChild(c2);
        
            form.appendChild(row);
        
        });

        const subDiv=document.createElement("div");
        subDiv.className = "row";
        subDiv.style.display = "flex";
        subDiv.style.justifyContent = "center";

        const submitButton = document.createElement("button");
        submitButton.className = "btn btn-light btn-sm";
        submitButton.style.width="30%";
        submitButton.textContent = "Submit";
        submitButton.type = "submit";
     
        subDiv.appendChild(submitButton);
        ulDropDown.appendChild(subDiv);
    
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const selectedActivities = Array.from(form.querySelectorAll("input[name='activity']:checked"))
                .map(checkbox => activities.find(activity => activity.id === checkbox.value));
    
            if (selectedActivities.length > 0) {
                console.log("Attività selezionate:", selectedActivities);
            } else {
                console.error("Nessuna attività selezionata");
            }
        });
    
        divActivities.appendChild(form);
        

    }
    
    }
    catch(e){
        console.error("error in getting activities",e);
    }


}
    
}
//end function to create ul and handle activity selection


//function to extract the set of activities
async function getActivities() {
    try {
        const xml = await getDiagram();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, "application/xml");
        const taskElements = xmlDoc.querySelectorAll(`bpmn\\:task, task`);
        const tasks = Array.from(taskElements).map(task => {
            const id = task.getAttribute("id");
            const name = task.getAttribute("name");
            return { id, name };
        });
        
        return tasks;
    } catch (error) {
        console.error("An error occurred in getActivities:", error);
        throw error; 
    }
}
//


export {removeUlFromDropDown, createDropDown,createUlandSelectActivities,closeSideBarSurvey}