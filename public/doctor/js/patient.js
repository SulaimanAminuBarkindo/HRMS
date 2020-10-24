const state = document.querySelector('#state');
const lga = document.querySelector('#lga');
const addPatient = document.querySelector('#addPatient');
const searchParam = document.querySelector('#search');
const deleteBtns = document.querySelectorAll('#deleteBtn');
const form = document.querySelector('form');
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

//date display
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

//add patient
async function register(e){
  e.preventDefault();
  const data = new FormData(form);
  const res = await fetch('/doctor/patient',{
    method:'post',
    body:data
  });
  const result = await res.json();

  if(result.success) {
    window.location.href = `/doctor/print?id=${result.patient._id}`;  
}
//do something with error
  console.log(result);

}

// async function update(e){
//   e.preventDefault();
//   const data = new FormData(form);
//   const res = await fetch(`/receptionist/patient/update?id=---`,{
//     method:'put',
//     body: data
//   });
//   const result = await res.json();
//   console.log(result);
//   //update the DOM if(success) 
//   //else display error msg
  
// }

// search for patient
async function search(e){
  if(e.key==='Enter'){
  e.preventDefault();
  const res = await fetch(`/doctor/patient/search?searchParam=${searchParam.value}`,{
    method:'get',
  });
const result = await res.json();
console.log(result);
//update the DOM if(success) 
//else display error msg
}
}

//delete function
async function deletePatient(e){
  e.preventDefault();
  if(confirm('do you want to proceed and Delete this patient?')){
  
  const res = await fetch(e.currentTarget.href, {
    method:'delete',
  });
  const result = await res.json();
  console.log(result);
  //update the DOM if(success) 
  //else display error msg
  
}
}

// function for fetching LGA of a particular state
async function getLocals() {
  const res = await fetch(`/state/${state.value}`, {
    method: 'get'
  });
  const result = await res.json();
  if(result.success){
    let dom=`<option value="#">Select LGA</option>`;
    const lgaOptions = result.state[0].locals.forEach(local => {
      dom +=`<option>${local.name}</option>`;
    });
    lga.innerHTML = dom;
  }
  else {
    //do something with error
    console.log(result);
  }

}

state.addEventListener('input', getLocals);
deleteBtns.forEach(deleteBtn => deleteBtn.addEventListener('click', deletePatient));
addPatient.addEventListener('click', register);
searchParam.addEventListener('keypress', search);