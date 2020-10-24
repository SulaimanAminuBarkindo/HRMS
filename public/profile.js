const form = document.querySelector('form');
const uploadBtn = document.querySelector('#uploadBtn');

async function upload(e) {
    e.preventDefault();
    const data = new FormData(form);
    for(const p of data) console.log(p[0], p[1]);
    const res = await fetch('/auth/edit-profile', {
        method: 'post',
        body: data
    });
    const result = await res.json();
    console.log(result);
}

uploadBtn.addEventListener('click', upload);
form.addEventListener('submit', upload);