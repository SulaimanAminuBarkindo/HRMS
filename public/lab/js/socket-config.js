const socket = io.connect('http://localhost:3000');
const doctorNum = document.querySelector('#fromDoctor');
const submit = document.querySelector('.btn5');
const form = document.querySelector('form');

socket.on('lab-request', () => {
    //modify the num of notifications 
    const numOfNotifications = parseInt(doctorNum.textContent) >= 1 ? parseInt(doctorNum.textContent) + 1 : 1;
    doctorNum.textContent = numOfNotifications; 
});

doctorNum.addEventListener('click', () => {
    doctorNum.textContent = '0'; 
});

async function submitTest(e) {
    e.preventDefault();
    const formData = new FormData(form);

    const res = await fetch('lab-test', {
        method: 'post',
        body: formData
    });
    const result = await res.json();
    console.log(result)
    if (result.success) {
        socket.emit('lab-result', result);
    }
}

submit.addEventListener('click', submitTest);