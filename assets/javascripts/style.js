"use strict"

const titleContainer = document.getElementById("title-container");
const back = document.getElementById("back");


titleContainer.addEventListener("mousemove", (e)=>{

        back.style.maskPosition = (e.clientX - 150) + "px" + " " + (e.clientY - 150) + "px";    
})

titleContainer.addEventListener("mouseleave", (e)=>{
    back.classList.remove("active")
})

titleContainer.addEventListener("mouseenter", (e)=>{
    back.classList.add("active")
})