import { formatDate } from '../../custom-functions.js'
const socket = io.connect('http://localhost:3000');
const form = document.querySelector('form');
const addAppointment = document.querySelector('#addAppointment');
const appointmentsTable = document.querySelector('#appointments-table');
const appointmentsList = appointmentsTable.querySelectorAll('tr'); 

addAppointment.addEventListener('click', async function(e){
    e.preventDefault();
    const doc = document.querySelector('#doctor');
    const selected = doc.options[doc.selectedIndex];
    const toId = selected.getAttribute('data-id');
    const formData = new FormData(form);
    formData.append('toId', toId);
    
    const res = await fetch('/receptionist/appointment',{
        method: 'post',
        body: formData
    });
    const result = await res.json();
    console.log(result);
    if(result.success) {
        // notify the Doctor
        socket.emit('new-appointment', result.appointment);
        // update DOM
        const { y, m, dy, h, min, s } = formatDate(result.appointment.createdAt);
        const newAppointment = `
        <tr><td>${ appointmentsList.length }</td>
        <td>${ result.appointment.cardNumber }</td>
        <td>${ result.appointment.name }</td>
        <td>${ result.appointment.doctorSpecialization }</td>
        <td>${ result.appointment.to }</td>
        <td>${ `${dy}/${m}/${y}`}</td>
        <td>${ `${h}:${min}:${s}`}</td>
        <td>${ result.appointment.status2 }</td>
        </tr>`;
        appointmentsTable.insertAdjacentHTML('beforeEnd', newAppointment);

    }
});

// listen for chat
socket.on('appointment-approved', id => {
    //modify the DOM with the data
    document.getElementById(id).textContent = 'approved';
    console.log(id);
});
 
// document.getElementById('date').innerHTML =  Date();
// document.querySelector('#name').innerHTML =  'Dorathy';
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
      // const date = new Date();
      // const dateFormat = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
      // dateFormats = dateFormat  + " Time is " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
      // document.getElementById('date').innerHTML = dateFormats;
      // displayTime();

  const tabs = document.querySelector('.tabs');
  const tabButtons = tabs.querySelectorAll('[role="tab"]');
  const tabpanels = document.querySelectorAll('[role="tabpanel"]');

  function HandleTabClick(event){
      // hiding tabs
      tabpanels.forEach(panel => {
          panel.hidden = true;
      });
      //
      tabButtons.forEach(tab => {
          tab.setAttribute('aria-selected', false)
      });
      //Tab Selected 
      event.currentTarget.setAttribute('aria-selected', true);
      const id = event.currentTarget.id;
      const tabpanel = tabs.querySelector(`[aria-labelledby = "${id}"]`);
      tabpanel.hidden = false;
  }
  tabButtons.forEach(button => button.addEventListener('click', HandleTabClick));