console.log('is working here.');
const labButton = document.querySelector('.lab-btn');
const modalOuter = document.querySelector('.modal-outer');
const modalInner = document.querySelector('.modal-inner');
const closeButton = document.querySelector('.close-btn-modal');
console.log(labButton);

function handleLabButtonClick() {
    
    // show the modal
    modalOuter.classList.add('open');
  }
 
    labButton.addEventListener('click', handleLabButtonClick);
  
  
  function closeModal() {
    modalOuter.classList.remove('open');
  }
  
  closeButton.addEventListener('click', closeModal);
  modalOuter.addEventListener('click', function(event) {
    const isOutside = !event.target.closest('.modal-inner');
    if (isOutside) {
      closeModal();
    }
  });
  
  window.addEventListener('keydown', event => {
    console.log(event);
    if (event.key === 'Escape') {
      closeModal();
    }
  });

  //adding prescriptions 
  console.log('it works hereeeeee')

const addButton = document.querySelector('.add-button');
	
console.log(addButton);

function addButtonClick(e){
    const html=` 
    <td><input type="text" placeholder="Drug/ injection Name"></td>
    <td><input type="text" value='injection'></td>
    <td><input type="text" value="intra muscular" disabled></td>
    <td>
       5/7 bi<input type="checkbox" value="5/7ml" >             
                                            cds 2/7<input type="checkbox" value="5/7ml" >
                                            <input type="checkbox" value="5/7ml" >
                                            <input type="checkbox" value="5/7ml" >
                                            <input type="checkbox" value="5/7ml" >
                                            <input type="checkbox" value="5/7ml" >
                                        </td>
    <td><span class="fa fa-times del"> </span></td>
`;
    let dat=document.createElement('tr')
    dat.insertAdjacentHTML('afterbegin',html)
    
let el=e.currentTarget.parentElement.parentElement;
el.insertAdjacentElement('afterend',dat)
const cancel=document.querySelector('.fa-times');
function handleCancel(e) {
    let elDel=e.currentTarget.parentElement.parentElement;
    elDel.remove();
    console.log(elDel);
}
cancel.addEventListener('click',handleCancel)





	
	
}
addButton.addEventListener('click', addButtonClick);
  