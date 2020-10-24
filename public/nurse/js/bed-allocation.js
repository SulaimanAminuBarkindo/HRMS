const form = document.querySelector('form');
const ward = document.querySelector('#ward');
const roomNumber = document.querySelector('#rooms');
const bedSpaceOptions = document.querySelector('#bedSpace');
const allocateBedBtn = document.querySelector('#submit');

async function allocateBed(e) {
  e.preventDefault();
  const data = new FormData(form);
  const res = await fetch('/nurse/bed-allocation', {
    method: 'post',
    body: data
  });

  const result = await res.json();
  console.log(result);
}

async function getRooms() {
  const res = await fetch(`/nurse/ward/?number=${ward.value}`, {
    method: 'get'
  });
  const result = await res.json();

  if(result.success){

    let roomsDom =`<option value="#">Select Room</option>`;

    for(let i = 0; i < result.ward[0].rooms.length; ++i) {
      if(result.ward[0].rooms[i].status === 'occupied') continue;
      roomsDom +=`<option value=${result.ward[0].rooms[i].number}>
      Room ${result.ward[0].rooms[i].number}</option>`;
    };

  // store the data for usage when room number is choosed 
  // since it contains the whole data for the selected ward
  localStorage.setItem('rooms', JSON.stringify(result.ward[0].rooms));
  // modify Rooms Select option Dom
  roomNumber.innerHTML = roomsDom;

  }  else {
    //do something with error
    console.log(result);
  }

}

async function getBeds() {

    // get the rooms data that was stored in localStorage for reducing server request 
    const rooms = JSON.parse(localStorage.getItem('rooms'));
    const room = roomNumber.value; // the selected room Number
    let bedSpaceDom =`<option value="#">Select Bed Space</option>`;
    const roomArray = `<input type="hidden" name="roomArray" value=${room -1}>`;
    // get the selected room, navigate through the whole available bedspace and create option for it
    for(let i = 0; i < rooms[room -1].bedSpace.length; ++i) {
          if(rooms[room -1].bedSpace[i].status === 'occupied') continue;
          bedSpaceDom +=`<option value=${rooms[room -1].bedSpace[i].number}>
          Space ${rooms[room -1].bedSpace[i].number}</option>`;
    };
    // modify the options of the bedspace select dropdown
    bedSpaceOptions.innerHTML = bedSpaceDom;
    // roomNumber.insertAdjacentElement('afterend', roomArray);
}

ward.addEventListener('input', getRooms);
roomNumber.addEventListener('input', getBeds);
allocateBedBtn.addEventListener('click', allocateBed);