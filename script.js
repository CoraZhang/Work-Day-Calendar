//Creat timeblock object for hours and todo
class TimeblockObj {
    constructor(hour, todo) {
        this.hour = hour;
        this.todo = todo;
    }
}
// Load the webpage
window.onload = function() {
    const currentTimeblocks = getCurrentTimeblocks();
    const currentTime = moment();
    // use moment
    displayCurrentDate(currentTime);
    displayTimeblockRows(currentTime);
    // Add event listener for clicking the blocks in container
    document.querySelector('.container')
        .addEventListener('click', function(event) {
            containerClicked(event, currentTimeblocks);
        });
    setTimeblockText(currentTimeblocks);
};
//Display current date and time in lead class
function displayCurrentDate(currentTime) {
    document.getElementById('currentDay')
        .textContent = currentTime.format('dddd, MMMM Do');
    realtime();
}
//function to display real time on screen
function realtime() {
    let currentTime = moment().format('h:mm:ss a');
    document.getElementById('currentTime').innerHTML = currentTime;
    setInterval(() => {
        currentTime = moment().format('h:mm:ss a');
        document.getElementById('currentTime').innerHTML = currentTime;
    }, 1000)
}

function getCurrentTimeblocks() {
    const currentTimeblocks = localStorage.getItem('timeblockObjects');
    return currentTimeblocks ? JSON.parse(currentTimeblocks) : [];
}

//functions for displaying all timeblock rows 
function displayTimeblockRows(currentTime) {
    const currentHour = currentTime.hour();
    //working hours are 9-5 
    for (let i = 9; i <= 17; i++) {
        const timeblock = createTimeblockRow(i);
        const hourCol = createCol(createHourDiv(i), 1);
        const textArea = createCol(createTextArea(i, currentHour), 10);
        const saveBtn = createCol(createSaveBtn(i), 1);
        //create blockrow, hour row (1), text row(10) and save role(1)
        appendTimeblockColumns(timeblock, hourCol, textArea, saveBtn);
        //append columns to timeblock row
        document.querySelector('.container').appendChild(timeblock);
        //append time block to container
    }
}
// function to create time block div rows
function createTimeblockRow(hourIdex) {
    const timeblock = document.createElement('div');
    timeblock.classList.add('row');
    timeblock.id = `timeblock-${hourIdex}`;
    return timeblock;
}
// funnction to create time block columns
function createCol(element, colSize) {
    const col = document.createElement('div');
    col.classList.add(`col-${colSize}`, 'p-0');
    col.appendChild(element);
    return col;
}
// function to create every hour div
function createHourDiv(hour) {
    const hourCol = document.createElement('div');
    hourCol.classList.add('hour');
    hourCol.textContent = moment(String(hour), 'h').format('hA');
    return hourCol;
}

// create text areas to enter the events
function createTextArea(hour, currentHour) {
    const textArea = document.createElement('textarea');
    textArea.classList.add(getTextAreaBackgroundClass(hour, currentHour));
    return textArea;
}
// function to determine past, future and present state wrt current time
function getTextAreaBackgroundClass(hour, currentHour) {
    return hour < currentHour ? 'past' :
        hour === currentHour ? 'present' :
        'future';
}
//create save button for every hour
function createSaveBtn(hour) {
    const saveBtn = document.createElement('button');
    saveBtn.classList.add('saveBtn');
    // add saveBtn to class list
    saveBtn.innerHTML = '<i class="fas fa-save"></i>';
    //add to html
    saveBtn.setAttribute('data-hour', hour);
    return saveBtn;
}
//function to append columns
function appendTimeblockColumns(timeblockRow, hourCol, textAreaCol, saveBtnCol) {
    const innerCols = [hourCol, textAreaCol, saveBtnCol];
    for (let col of innerCols) {
        timeblockRow.appendChild(col);
    }
}

//functions for saving to local storage
function containerClicked(event, timeblockList) {
    // condition when button clicked
    if (event.target.matches('button') || event.target.matches('.fa-save')) {
        // get the hour of clicked time block
        const timeblockHour = event.target.matches('.fa-save') ? event.target.parentElement.dataset.hour : event.target.dataset.hour;
        // get the text of current text block
        const textAreaValue = document.querySelector(`#timeblock-${timeblockHour} textarea`).value;
        //get text from time blocks pressed
        placeTimeblockInList(new TimeblockObj(timeblockHour, textAreaValue), timeblockList);
        //push to new obj
        localStorage.setItem('timeblockObjects', JSON.stringify(timeblockList));
        //save and push to time block list in local storage
    }
}
//parse new created object to the timeblock list
function placeTimeblockInList(newTimeblockObj, timeblockList) {
    if (timeblockList.length > 0) {
        for (let savedTimeblock of timeblockList) {
            if (savedTimeblock.hour === newTimeblockObj.hour) {
                savedTimeblock.todo = newTimeblockObj.todo;
                return;
            }
        }
    }
    timeblockList.push(newTimeblockObj);
    return;
}
// set entered text to the time block
function setTimeblockText(timeblockList) {
    if (timeblockList.length === 0) {
        return;
    } else {
        for (let timeblock of timeblockList) {
            document.querySelector(`#timeblock-${timeblock.hour} textarea`)
                .value = timeblock.todo;
        }
    }
}

$("#clearDay").on("click", function() {
    localStorage.clear();
    //clear all stored values
})