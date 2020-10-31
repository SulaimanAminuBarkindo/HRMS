function displayTime() {
    const refresh = 1000;
    const mytime = setTimeout('display()', refresh)
}
function display() {
    const date = new Date();
    const dateFormat = date.toUTCString();
    document.getElementById('date').innerHTML = dateFormat;
    tt = displayTime();
}
const tabs = document.querySelector('.tabs');
const tabButtons = tabs.querySelectorAll('[role="tab"]');
const tabpanels = document.querySelectorAll('[role="tabpanel"]');


function HandleClickButton(event) {
    // 
    tabpanels.forEach(pannel => {
        pannel.hidden = true;
    });
    //  

    tabButtons.forEach(tab => {
        tab.setAttribute('aria-selected', false);
    });
    event.currentTarget.setAttribute('aria-selected', true);
    const id = event.currentTarget.id;
    const tabpanel = tabs.querySelector(`[aria-labelledby = "${id}"]`);
    tabpanel.hidden = false;
}

tabButtons.forEach(button => button.addEventListener('click', HandleClickButton));