const clockDisplay= document.querySelector(".clock");
const hourInput= document.querySelector("#hour");
const minInput=document.querySelector("#min");
const setAlarmBtn=document.querySelector("#add-btn");
const listContainer=document.querySelector(".list-container");
const activeAlarms=document.querySelector(".activeAlarms")
let alarmsArray=[];
let alarmSound= new Audio("./assets/alarm.mp3")


let initialHour=0;
let initialMinute=0;
let alarmIndex=0;

const appendZero=(value)=> (value<10?"0"+value:value);


const searchObject=(parameter, value)=>{
    let alarmObject,
    objIndex,
    exists=false;

    alarmsArray.forEach((alarm, index)=>{
        if(alarm[parameter]==value){
            exists=true;
            alarmObject=alarm;
            objIndex=index;
            return false;
        }
    })
    return[exists, alarmObject, objIndex];
}

function displayTimer(){
    let date=new Date();
    let[hours, minutes, seconds]=[
        appendZero(date.getHours()),
        appendZero(date.getMinutes()),
        appendZero(date.getSeconds())
    ];

    clockDisplay.innerHTML=`${hours}: ${minutes}: ${seconds}`;

    alarmsArray.forEach((alarm)=>{
        if(alarm.isActive){
            if(`${alarm.alarmHour}:${alarm.alarmMinute}`===`${hours}:${minutes}`){
                alarmSound.play();
                alarmSound.loop=true;                
            }
        }
    });
}


function inputCheck(inputValue){
    inputValue=parseInt(inputValue);
    if(inputValue<10){
        inputValue=appendZero(inputValue);
    }
    return inputValue;
}


hourInput.addEventListener("input", function(){
    hourInput.value=inputCheck(hourInput.value);
})

minInput.addEventListener("input", function(){
    minInput.value=inputCheck(minInput.value);
})

//create alarm div
const createAlarm=(alarmObj)=>{
    //keys from object
    const {id, alarmHour, alarmMinute}= alarmObj;
    //alarm div
    let alarmDiv=document.createElement("div");
    alarmDiv.classList.add("alarm");
    alarmDiv.setAttribute("data-id", id);
    alarmDiv.innerHTML=`<span>${alarmHour}: ${alarmMinute}</span>`

    //checkbox
    let checkbox=document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.addEventListener("click", (e)=>{
        if(e.target.checked){
            startAlarm(e);
        }else{
            stopAlarm(e)
        }
    });
    alarmDiv.appendChild(checkbox);

    //delete button
    let deleteButton=document.createElement("button");
    deleteButton.innerHTML=`<i class="fa-solid fa-trash-can"></i>`;
    deleteButton.classList.add("deleteButton");
    deleteButton.addEventListener("click", (e)=>deleteAlarm(e));
    alarmDiv.appendChild(deleteButton);
    activeAlarms.appendChild(alarmDiv);
}

const setAlarm=()=>{
    alarmIndex +=1;

    //alarmObject
    let alarmObject={};
    alarmObject.id= `${alarmIndex}_${hourInput.value}_${minInput.value}`;
    alarmObject.alarmHour=hourInput.value;
    alarmObject.alarmMinute=minInput.value;
    alarmObject.isActive=false;
    console.log(alarmObject);
    alarmsArray.push(alarmObject);
    createAlarm(alarmObject);
    hourInput.value=appendZero(initialHour)
    minInput.value=appendZero(initialMinute)
}

//start alarm
const startAlarm=(e)=>{
    let searchId =e.target.parentElement.getAttribute("data-id");
    let [exists, obj, index]= searchObject("id", searchId);
    if(exists){
        alarmsArray[index].isActive=true;
    }
}

//stop alarm
const stopAlarm=(e)=>{
    let searchId=e.target.parentElement.getAttribute("data-id");
    let[exists, obj, index]=searchObject("id", searchId);
    if(exists){
        alarmsArray[index].isActive=false;
        alarmSound.pause();
    }
}

const deleteAlarm = (e) => {
  let searchId = e.target.parentElement.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists) {
    e.target.parentElement.parentElement.remove();
    alarmsArray.splice(index, 1);
  }
};

setAlarmBtn.addEventListener("click",setAlarm);

window.onload = () => {
  setInterval(displayTimer);
  initialHour = 0;
  initialMinute = 0;
  alarmIndex = 0;
  alarmsArray = [];
  hourInput.value = appendZero(initialHour);
  minInput.value = appendZero(initialMinute);
};




// function updateClock(){
//     let now= new Date();
//     const currentTime = now.toLocaleTimeString();
//     clockDisplay.textContent=currentTime;
// }
// setInterval(updateClock, 1000);
// updateClock();

// function setAlarm(){
//     setHour= String(hourInput.value).padStart(2,"0");
//     setMin=String(minInput.value).padStart(2,"0");
//     console.log(`hour: ${setHour} min: ${setMin}`);
// }