const tabs = document.querySelector('.tabs');
const tabButtons = tabs.querySelectorAll('[role="tab"]');
console.log(tabButtons);

const tabPanel = tabs.querySelectorAll('[role="tabpanel"]');
console.log(tabPanel);

function handleTabClick(event){
//  hide all tabpanel
    tabPanel.forEach(function(panel){
   panel.hidden = true;
    });
// mark all tabs as unselected
    tabButtons.forEach(tab =>{
        tab.setAttribute('aria-selected', 'false')
    });
   //mark the clicked tab as Selected
    event.currentTarget.setAttribute('aria-slected', true);
    //find associated tabpanel and show it
    const {id} = event.currentTarget;
    const tabPanels = tabs.querySelector(`[aria-labelledby="${id}"]`);
    console.log(tabPanels);
    tabPanels.hidden = false;
}


tabButtons.forEach(button => button.addEventListener('click', handleTabClick));

//drop down
 var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
} 

//time display
function displayTime(){
  const refresh = 1000;
  const mytime = setTimeout('display()', refresh)
}
function display(){
const date = new Date();
const dateFormat = date.toUTCString();
document.getElementById('date').innerHTML = dateFormat;
tt = displayTime();
}






