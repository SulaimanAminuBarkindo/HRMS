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