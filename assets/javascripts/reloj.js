const hour = document.getElementById("clock__hour");
const min = document.getElementById("clock__min");

let time = new Date();

const formatTime = num =>{
    if(num < 10){
        num = "0" + num;
    }
    return num;
}

const getTime = () =>{
    time = new Date();
    hour.innerHTML = formatTime(time.getHours());
    min.innerHTML = formatTime(time.getMinutes());
}

getTime();

setInterval(
    getTime, 1000
)