const loginBtn = document.querySelector('#login');
const form = document.querySelector('form');

async function login(e){
    e.preventDefault();
    const data = new FormData(form);
    const res = await fetch('login', {
        method: 'post',
        body: data
    });
    const result = await res.json();
    if(result.success) {
        switch(result.user.role) {
            case 'doctor':
                window.location.href = '/doctor';
            break;
            case 'nurse':
                window.location.href = '/nurse';
            break;
            case 'lab':
                window.location.href = '/lab';
            break;
            case 'pharmacist':
                window.location.href = '/pharmacy';
            break;
            case 'receptionist':
                window.location.href = '/receptionist';
            break;
            default:
                window.location.href = '/auth/login';
        }
    }
    //print the error message for user
    console.log(result);

}

loginBtn.addEventListener('click', login);