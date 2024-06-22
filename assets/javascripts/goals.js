"use strict"


let goalsContainer = document.getElementById("goal__list");
let btnAdd = document.getElementById("add-goal__btn");

const header = document.getElementById("app__header");
const footer = document.getElementById("app__footer");
const btnRestart = document.getElementById("footer__restart-btn");
const containerAdd = document.getElementById("add-goal")

const goalsCompletedContainer = document.getElementById("goal-progress");
const goalsCount = document.getElementById("goals__count");
const goalsCompleted = document.getElementById("goals__completed");
const expWin = document.getElementById("exp");

const music = new Audio("assets/sounds/music.mp3");
music.volume = 0.2;
const goalAddSound = new Audio("assets/sounds/add-goal.mp3");
const goalRemoveSound = new Audio("assets/sounds/remove-goal.mp3");
goalRemoveSound.volume = 0.2;
const goalCompleteSound = new Audio("assets/sounds/complete-goal.mp3");


addEventListener("load", ()=>{
    music.play();
    music.loop = true;
    music.volume = 0.2;

    if(document.querySelector(".goal__item")){
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
    const hour = document.querySelectorAll(".goal__info__hour");
    const currentHour = document.getElementById("clock__hour").textContent
    let newHour = parseInt(currentHour) + 1;

    if(hour.length > 0){
        newHour = parseInt(hour[hour.length - 1].value) + 1
    }

    return formatNum(newHour);
}


btnRestart.addEventListener("click", ()=>{
    if(!document.querySelector(".footer__confirm-restart")){
        confirmRestart();
    }
})

const confirmRestart = () =>{
    const restartContainer = document.createElement("DIV");
    const restartOptions = document.createElement("DIV");
    const restartText = document.createElement("P");
    const restartCancel = document.createElement("BUTTON");
    const restartConfirm = document.createElement("BUTTON");

    restartText.textContent = "¿Quieres reiniciar los objetivos de hoy?";
    restartCancel.textContent = "No";
    restartConfirm.textContent = "Sí";

    restartContainer.classList.add("footer__confirm-restart");
    restartOptions.classList.add("confirm-restart__options");
    restartCancel.classList.add("button");
    restartConfirm.classList.add("button");

    restartContainer.appendChild(restartText);
    restartContainer.appendChild(restartOptions);
    restartOptions.appendChild(restartCancel);
    restartOptions.appendChild(restartConfirm);

    footer.appendChild(restartContainer);
    
    setTimeout( () =>{
        restartContainer.classList.add("open");
    }, 0)

    restartCancel.addEventListener("click", ()=>{
        restartContainer.classList.remove("open");
        setTimeout( () => restartContainer.remove(), 600);
    })

    restartConfirm.addEventListener("click", ()=>{
        restartContainer.classList.remove("open");
        setTimeout(()=>{
            document.querySelector("main").classList.remove("active");
            window.indexedDB.deleteDatabase("objetivosBase");
            header.classList.remove("active");
            containerAdd.classList.remove("active");
            goalsContainer.classList.add("out");
            setTimeout(() => location.reload(), 600)
        }, 500)
        
    })
    
}



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
        index: document.querySelectorAll(".goal__item").length + 1,
        hour: newHour(),
        min: "00",
        title: "",
        completed: false
    }});

});

const goalsCompletedUpdate = () =>{
    goalsCompleted.textContent = document.querySelectorAll(".goal__item--completed").length;

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
    

    const total = document.querySelectorAll(".goal__item--completed").length * 100;

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

    goal.classList.add("goal__item");
    info.classList.add("goal__info");
    num.classList.add("goal__info__num");
    time.classList.add("goal__info__time");
    hour.classList.add("goal__info__hour");
    min.classList.add("goal__info__min");
    title.classList.add("goal__info__title");
    exp.classList.add("goal__info__exp");
    options.classList.add("goal__options");
    deleteBtn.classList.add("goal__options__delete");
    completeBtn.classList.add("goal__options__complete");
    moveBtn.classList.add("goal__options__move");

    title.placeholder = "Escribe tu objetivo...";
    title.value = newTitle;
    hour.type = "number";
    hour.max = 24;
    hour.min = 1;
    min.type = "number";
    min.max = 59;
    min.min = 0;
    min.step = 15;

    goal.setAttribute("draggable", true)

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
        goal.classList.add("goal__item--completed")
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
            index: index,
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
        if(!goal.classList.contains("goal__item--completed")){
            completeObjetive(id, index, goal, completed, completeBtn, hour, min, title);
        }else{
            updateCompleteState(id, index, goal, completeBtn, completed, hour, min, title);
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

const updateCompleteState = (id, index, goal, completeBtn, completed, hour, min, title) =>{
    goal.classList.toggle("goal__item--completed");
        createSpanComplete(goal.classList.contains("goal__item--completed"), completeBtn);

        experienceWined();
        goalsCompletedUpdate();

        
        let isComplete = completed;

        if(completed){
            isComplete = false;
        }else{
            isComplete = true;
        } 

        updateObject(id, {objetivo:{
            index: index,
            hour: hour.value,
            min: min.value,
            title: title.value,
            completed: isComplete
        }})
}

const completeObjetive = (id, index, goal, completed, completeBtn, hour, min, title) =>{
    const completeContainer = document.createElement("DIV");
    const completeOptions = document.createElement("DIV");
    const completeText = document.createElement("P");
    const completeCancel = document.createElement("BUTTON");
    const completeConfirm = document.createElement("BUTTON");

    completeText.textContent = "¿Completaste este objetivo?";
    completeCancel.textContent = "Aún no";
    completeConfirm.textContent = "Sí";

    completeContainer.classList.add("goal__item__complete-container");
    completeOptions.classList.add("complete-container__complete-options");

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

        updateCompleteState(id, index, goal, completeBtn, completed, hour, min, title);
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

    deleteContainer.classList.add("goal__item__delete-container");
    deleteOptions.classList.add("delete-container__delete-options");

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

        if(document.querySelectorAll(".goal__item").length == 1){
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
    // console.log("Base de datos creada correctamente");
    const db = idbRequest.result;
    db.createObjectStore("objetivosTable", { autoIncrement: true })
})

idbRequest.addEventListener("success", () => {
    // console.log("Base de datos correcta");
    readObjects();
    
})

idbRequest.addEventListener("error", () => {
    // console.log("Ha ocurrido un error al abrir la base de datos");
})


const createObject = (objeto) => {
    transationIDB("readwrite", "Objeto creado correctamente").add(objeto);
    readObjects();
}

const readObjects = () => {
    const cursor = transationIDB("readonly", "").openCursor();
    const fragment = document.createDocumentFragment();

    goalsContainer.innerHTML = "";

    let index = 1;
    let newExp = 100;
    let goalsCompletedCount = 0;

    cursor.addEventListener("success", () => {
        
        if (cursor.result) {
            document.querySelector("main").classList.add("active");

            if (cursor.result.value.objetivo.index != index || cursor.result.value.objetivo.index == ""){
                console.log("no iguales");
                updateObject(cursor.result.key, {objetivo:{
                    index: index,
                    hour: cursor.result.value.objetivo.hour,
                    min: cursor.result.value.objetivo.min,
                    title: cursor.result.value.objetivo.title,
                    completed: cursor.result.value.objetivo.completed
                }})
            }

            let element = createGoal(
                cursor.result.key, 
                cursor.result.value.objetivo.index, 
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
            document.querySelector(".goal__list").appendChild(fragment);
            // console.log("Objetos leidos correctamente");
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

                // console.log("no hay elementos")
                
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
        // console.log(msg)
    })

    return objStore;
}


// ----------------------------------------------->

