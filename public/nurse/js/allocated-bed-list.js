const search = document.querySelector('#search');
const deActivateBtns = document.querySelectorAll('#deActivateBtn');

async function searchAllocatedBed(e) {
    if(e.key==='Enter') {
    e.preventDefault();
    const data = search.value;
    const res = await fetch(`/nurse/allocated-bed-list/search?searchParam=${data}`, {
      method: 'get',
    });
  
    const result = await res.json();
    console.log(result);
    // update the DOM on success 
    // else show error message
  }
  }

  async function deActivateBed(e) {
    console.log('got it')
    e.preventDefault();
    if(confirm('do you want to proceed and Delete this patient?')){
      data = new FormData();
      data.append('bedNumber', e.currentTarget.getAttribute('bedNumber'));
      data.append('roomNumber', e.currentTarget.getAttribute('roomNumber'));
      data.append('wardNumber', e.currentTarget.getAttribute('wardNumber'));
      const res = await fetch(e.currentTarget.href, {
        method:'delete',
        body: data
      });
      const result = await res.json();
      console.log(result);
      //update the DOM if(success) 
      //else display error msg     
    }
  }

async function updateBed(e){
  e.preventDefault();
  const data = new FormData(form);
  const res = await fetch(`/receptionist/patient/update?id=---`,{
    method:'put',
    body: data
  });
  const result = await res.json();
  console.log(result);
  //update the DOM if(success) 
  //else display error msg 
}


   
  search.addEventListener('keypress', searchAllocatedBed);
  deActivateBtns.forEach( deActivateBtn => deActivateBtn.addEventListener('click', deActivateBed));