const searchP = document.querySelector('#searchPatient');

async function searchPatient(e) {
    if(e.key==='Enter') {
    e.preventDefault();
    const p = searchP.value;
    console.log(p)
    const res = await fetch(`/nurse/patient/${p}`, {
      method: 'get',
    });
  
    const result = await res.json();
    console.log(result);
  }
  }

searchP.addEventListener('keypress', searchPatient);