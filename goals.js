"use strict"


let goalsContainer = document.getElementById("goals");
let btnAdd = document.getElementById("add");

export {btnAdd}

const header = document.getElementById("header");
const btnRestart = document.getElementById("restart");
const containerAdd = document.getElementById("add-container")

const goalsCompletedContainer = document.getElementById("goals-completed-container");
const goalsCount = document.getElementById("goals-count");
const goalsCompleted = document.getElementById("goals-completed");
const expWin = document.getElementById("exp");

const music = new Audio("sounds/music.mp3");
music.volume = 0.2;
const goalAddSound = new Audio("sounds/add-goal.mp3");
const goalRemoveSound = new Audio("sounds/remove-goal.mp3");
goalRemoveSound.volume = 0.2;
const goalCompleteSound = new Audio("sounds/complete-goal.mp3");


addEventListener("load", ()=>{
    music.play();
    music.loop = true;
    music.volume = 0.2;

    if(document.querySelector(".goal")){
        music.loop = false;
    }
})


const formatNum = (num) =>{

    let newNum = num.toString();

    if (newNum.length < 2){
        newNum = "0" + newNum;
        return newNum;
    }
    return newNum;
}

const newHour = () =>{
    const hour = document.querySelectorAll(".hour");
    const currentHour = document.getElementById("current-hour").textContent
    let newHour = parseInt(currentHour) + 1;

    if(hour.length > 0){
        newHour = parseInt(hour[hour.length - 1].value) + 1
    }

    return formatNum(newHour);
}

const getHourTemp = (goalsNode) =>{
    let lastHour = document.querySelectorAll(".time .hour")
    if(goalsNode.length > 0){
        return formatNum(parseInt(lastHour[goalsNode.length - 1].value) + 1)
    }else{
        return formatNum(parseInt(document.getElementById("current-hour").textContent) + 1);
    }
}

btnRestart.addEventListener("click", ()=>{
    document.querySelector("main").classList.remove("active");
    window.indexedDB.deleteDatabase("objetivosBase");
    header.classList.remove("active");
    containerAdd.classList.remove("active");
    goalsContainer.classList.add("out");
    setTimeout(() => location.reload(), 600)
})



btnAdd.addEventListener("click", ()=>{

    goalAddSound.play();
    music.loop = false;

    containerAdd.classList.remove("inactive");
    containerAdd.classList.remove("active");
    setTimeout(()=>containerAdd.classList.add("active"), 100)
    

    if(goalsContainer.childElementCount == 0){
        header.classList.add("active");
    }
    
    createObject({objetivo:{
        hour: newHour(),
        min: "00",
        title: "",
        completed: false
    }});

});

const goalsCompletedUpdate = () =>{
    goalsCompleted.textContent = document.querySelectorAll(".completed").length;

    if(goalsCompleted.textContent == goalsCount.textContent){
        setTimeout(()=>{
            music.play();
        }, 1000)

        goalsCompletedContainer.classList.add("anim-scale");
        setTimeout(()=>{
            goalsCompletedContainer.classList.remove("anim-scale");
        }, 9000)
        
    }
}

let expCont = 0;
let expInitial = true;

const experienceWined = () =>{
    

    const total = document.querySelectorAll(".completed").length * 100;

    if(expInitial){
        expWin.textContent = total;
        expCont = total;
        expInitial = false;
    }else{

        if(expCont < total){

            const interval = setInterval(()=>{
                expWin.textContent = "";
                expWin.textContent = expCont;
                expCont ++;
                goalsContainer.classList.add("no-interaction")
                if(expCont > total){
                    clearInterval(interval);
                    goalsContainer.classList.remove("no-interaction")
                }
                
            }, 5
            )
        }else{
            const interval = setInterval(()=>{
                expWin.textContent = "";
                expWin.textContent = expCont;
                expCont--;
                goalsContainer.classList.add("no-interaction")
                if(expCont < total){
                    clearInterval(interval);
                    goalsContainer.classList.remove("no-interaction");
                }
            }, 5
            )
        }
    }
    
              
}

const createGoal = (id, index, newHour, newMin, newTitle, newExp, completed) =>{
    let goal = document.createElement("DIV");
    let info = document.createElement("DIV");
    let num = document.createElement("P");
    let time = document.createElement("P");
    let hour = document.createElement("INPUT");
    let min = document.createElement("INPUT");
    let title = document.createElement("INPUT");
    let exp = document.createElement("SPAN");
    let options = document.createElement("DIV");
    let deleteBtn = document.createElement("A");
    let completeBtn = document.createElement("A");
    let moveBtn = document.createElement("A");

    goal.classList.add("goal");
    info.classList.add("info");
    num.classList.add("num");
    time.classList.add("time");
    hour.classList.add("hour");
    min.classList.add("min");
    title.classList.add("title");
    exp.classList.add("exp");
    options.classList.add("options");
    deleteBtn.classList.add("delete");
    completeBtn.classList.add("complete");
    moveBtn.classList.add("move");

    title.placeholder = "Escribe tu objetivo...";
    title.value = newTitle;
    hour.type = "number";
    hour.max = 24;
    hour.min = 1;
    min.type = "number";
    min.max = 59;
    min.min = 0;
    min.step = 15;

    goal.appendChild(info);
    info.appendChild(num);
    info.appendChild(time);
    time.appendChild(hour);
    time.append(":");
    time.appendChild(min);
    info.appendChild(title);
    info.appendChild(exp);
    goal.appendChild(options);
    

    if(completed){
        goal.classList.add("completed")
    }



    num.textContent = index;
    hour.value = newHour;
    min.value = newMin;
    exp.textContent = newExp;

    

    completeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22">
                                <title>Completar</title>
                                <path
                                    d="M4 11H6V12H7V13H8V14H10V13H11V12H12V11H13V10H14V9H15V8H16V7H17V6H19V8H18V9H17V10H16V11H15V12H14V13H13V14H12V15H11V16H10V17H8V16H7V15H6V14H5V13H4V11Z" />
                            </svg>`

    deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22">
                                <title>Borrar</title>
                                <path d="M15 1V2H17V3H18V4H19V5H20V7H21V15H20V17H19V18H18V19H17V20H15V21H7V20H5V19H4V18H3V17H2V15H1V7H2V5H3V4H4V3H5V2H7V1H15M14 3H8V4H6V5H5V6H4V8H3V14H4V16H5V17H6V18H8V19H14V18H16V17H17V16H18V14H19V8H18V6H17V5H16V4H14V3M13 16V14H12V13H10V14H9V16H7V13H8V12H9V10H8V9H7V6H9V8H10V9H12V8H13V6H15V9H14V10H13V12H14V13H15V16H13Z" />
                            </svg>`

    exp.innerHTML +=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22">
                        <title>Exp</title>
                        <path d="M15 21H7V20H6V19H5V18H4V17H3V16H2V15H1V7H2V6H3V5H4V4H5V3H6V2H7V1H15V2H16V3H17V4H18V5H19V6H20V7H21V15H20V16H19V17H18V18H17V19H16V20H15M12 13V12H13V10H12V9H10V10H9V12H10V13Z" />
                    </svg>`;

    options.appendChild(completeBtn);

    

    createSpanComplete(completed, completeBtn);
    
    options.appendChild(moveBtn);
    options.appendChild(deleteBtn);
        
    hour.addEventListener("change", ()=>{
        newObject();
    });

    min.addEventListener("change", ()=>{
        newObject();
    });

    title.addEventListener("change", ()=>{
        newObject();
    });

    const newObject = () =>{

        hour.value = formatNum(hour.value)
        min.value = formatNum(min.value)

        updateObject(id, {objetivo:{
            hour: hour.value,
            min: min.value,
            title: title.value,
            completed: false
        }})
    }

    

    deleteBtn.addEventListener("click", () =>{
        deleteObjetive(id, goal);
    })

    completeBtn.addEventListener("click", () =>{
        if(!goal.classList.contains("completed")){
            completeObjetive(id, goal, completed, completeBtn, hour, min, title);
        }else{
            updateCompleteState(id, goal, completeBtn, completed, hour, min, title);
        }
        
    })
        

    return goal;

}

const createSpanComplete = (isCompleted, completeBtn) =>{

    const completeText = document.createElement("SPAN");
    completeText.innerText = "Completo";

    if(isCompleted){
        completeBtn.appendChild(completeText);  
    }else if(completeBtn.childElementCount > 1){
        completeBtn.removeChild(completeBtn.lastChild) 
    }    
}

const updateCompleteState = (id, goal, completeBtn, completed, hour, min, title) =>{
    goal.classList.toggle("completed");
        createSpanComplete(goal.classList.contains("completed"), completeBtn);

        experienceWined();
        goalsCompletedUpdate();

        
        let isComplete = completed;

        if(completed){
            isComplete = false;
        }else{
            isComplete = true;
        } 
        

        updateObject(id, {objetivo:{
            hour: hour.value,
            min: min.value,
            title: title.value,
            completed: isComplete
        }})
}

const completeObjetive = (id, goal, completed, completeBtn, hour, min, title) =>{
    const completeContainer = document.createElement("DIV");
    const completeOptions = document.createElement("DIV");
    const completeText = document.createElement("P");
    const completeCancel = document.createElement("BUTTON");
    const completeConfirm = document.createElement("BUTTON");

    completeText.textContent = "¿Completaste este objetivo?";
    completeCancel.textContent = "Aún no";
    completeConfirm.textContent = "Sí";

    completeContainer.classList.add("complete-container");
    completeOptions.classList.add("complete-options");

    completeContainer.appendChild(completeText);
    completeContainer.appendChild(completeOptions);
    completeOptions.appendChild(completeCancel);
    completeOptions.appendChild(completeConfirm);

    goal.appendChild(completeContainer);
    
    setTimeout( () =>{
        completeContainer.classList.add("open");
    }, 0)
    

    completeCancel.addEventListener("click", ()=>{
        completeContainer.classList.remove("open");
        setTimeout( () => completeContainer.remove(), 600);
    })

    completeConfirm.addEventListener("click", ()=>{

        completeContainer.classList.remove("open");

        goalCompleteSound.pause();
        goalCompleteSound.currentTime = 0;
        goalCompleteSound.play();

        updateCompleteState(id, goal, completeBtn, completed, hour, min, title);
    })
    
}

const deleteObjetive = (id, goal) =>{
    const deleteContainer = document.createElement("DIV");
    const deleteOptions = document.createElement("DIV");
    const deleteText = document.createElement("P");
    const deleteCancel = document.createElement("BUTTON");
    const deleteConfirm = document.createElement("BUTTON");

    deleteText.textContent = "¿Borrar este objetivo?";
    deleteCancel.textContent = "Cancelar";
    deleteConfirm.textContent = "Sí, borrar";

    deleteContainer.classList.add("delete-container");
    deleteOptions.classList.add("delete-options");

    deleteContainer.appendChild(deleteText);
    deleteContainer.appendChild(deleteOptions);
    deleteOptions.appendChild(deleteCancel);
    deleteOptions.appendChild(deleteConfirm);

    goal.appendChild(deleteContainer);
    
    setTimeout( () =>{
        deleteContainer.classList.add("open");
    }, 0)
    

    deleteCancel.addEventListener("click", ()=>{
        deleteContainer.classList.remove("open");
        setTimeout( () => deleteContainer.remove(), 600);
    })

    deleteConfirm.addEventListener("click", ()=>{

        if(document.querySelectorAll(".goal").length == 1){
            const allElements = document.querySelectorAll('.active')
            allElements.forEach(el => el.classList.remove('active'))
            containerAdd.classList.add("inactive");
        }

        deleteObject(id);
        goalRemoveSound.play();

        
    })
    
}


// -----------------------------------
// IndexedDB

const idbRequest = indexedDB.open("objetivosBase", 1);

idbRequest.addEventListener("upgradeneeded", () => {
    console.log("Base de datos creada correctamente");
    const db = idbRequest.result;
    db.createObjectStore("objetivosTable", { autoIncrement: true })
})

idbRequest.addEventListener("success", () => {
    console.log("Base de datos correcta");
    readObjects();
    
})

idbRequest.addEventListener("error", () => {
    console.log("Ha ocurrido un error al abrir la base de datos");
})


const createObject = (objeto) => {
    transationIDB("readwrite", "Objeto creado correctamente").add(objeto);
    readObjects();
}

const readObjects = () => {
    const cursor = transationIDB("readonly", "").openCursor();
    const fragment = document.createDocumentFragment();

    document.querySelector(".goals").innerHTML = "";

    let index = 1;
    let newExp = 100;
    let goalsCompletedCount = 0;

    cursor.addEventListener("success", () => {
        
        if (cursor.result) {
            document.querySelector("main").classList.add("active");
            let element = createGoal(
                cursor.result.key, 
                index, 
                cursor.result.value.objetivo.hour, 
                cursor.result.value.objetivo.min, 
                cursor.result.value.objetivo.title, 
                newExp, 
                cursor.result.value.objetivo.completed)

                if (cursor.result.value.objetivo.completed){
                    goalsCompletedCount++;
                }
            
            fragment.appendChild(element);
            cursor.result.continue();
            
            

            index++;
        } else {
            document.querySelector(".goals").appendChild(fragment);
            console.log("Objetos leidos correctamente");
            if(goalsContainer.childElementCount > 0){
                experienceWined();
                header.classList.add("active");
                containerAdd.classList.remove("inactive");
                setTimeout(()=>containerAdd.classList.add("active"), 100)
            }else if(goalsContainer.childElementCount < 1){

                setTimeout(()=>{
                    music.play();
                    music.loop = true;
                }, 1000)

                console.log("no hay elementos")
                
            }

            
        }

        
        goalsCount.textContent = index - 1;
        goalsCompleted.textContent = goalsCompletedCount;
        
    })

    
}



const updateObject = (key, objeto) => {
    transationIDB("readwrite", "Objeto actualizado correctamente").put(objeto, key);
}

const deleteObject = (key) => {
    transationIDB("readwrite", "Objeto eliminado correctamente").delete(key);
    readObjects();
}

const transationIDB = (mode, msg) => {
    const db = idbRequest.result;
    const IDBTransation = db.transaction("objetivosTable", mode);
    const objStore = IDBTransation.objectStore("objetivosTable");

    IDBTransation.addEventListener("complete", () => {
        console.log(msg)
    })

    return objStore;
}


// ----------------------------------------------->

