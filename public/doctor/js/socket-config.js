import { clearNotifications } from '../../custom-functions.js'
const socket = io.connect('http://localhost:3000');
const receptionistNum = document.querySelector('#fromReceptionist');
const ntfs = document.querySelectorAll('#contents');
const labNum = document.querySelector('#fromLab');
const labNotification = document.querySelector('#lab-notification');
const receptionistNotification = document.querySelector('#receptionist-notification');


socket.on('new-appointment', () => {
    //modify the num of notifications 
    const numOfNotifications = parseInt(receptionistNum.textContent) >= 1 ? parseInt(receptionistNum.textContent) + 1 : 1;
    receptionistNum.textContent = numOfNotifications; 
});

socket.on('lab-result', (data) => {
    //modify the num of notifications 
    console.log('lab result is here');
    const numOfNotifications = parseInt(labNum.textContent) >= 1 ? parseInt(labNum.textContent) + 1 : 1;
    labNum.textContent = numOfNotifications; 
});

labNotification.addEventListener('click', clearNotifications(labNum));
receptionistNotification.addEventListener('click',clearNotifications(receptionistNum));

ntfs.forEach(ntf => {
    ntf.addEventListener('click', e => {
        e.preventDefault();
        const data = ntf.href.split('id=');
        socket.emit('appointment-approved', data[1]);
        window.location.href = ntf.href;
        console.log('clicked', data[1]);
    });
});
