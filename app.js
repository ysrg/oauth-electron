const electron = require('electron');

function setProvider() {
  const cards = document.querySelectorAll('.card');
  cards.forEach((item) => {
    item.addEventListener('click', () => electron.ipcRenderer.send('set:provider', item.textContent))
  })
}

electron.ipcRenderer.on('login', (e, data) => {
  fetch('https://graph.microsoft.com/v1.0/me/messages', {
    method: 'GET',
    headers: {
      Host: 'https://graph.microsoft.com',
      Authorization: `Bearer ${data}`,
    },
  }).then((response) => response.json()).then((data) => {
    console.log('res_renderer', data);
    const body = document.body,
    tbl = document.createElement('table');
    const thead = document.createElement('thead');
    const orderArrayHeader = ["From","Date","Subject","Message"];
    tbl.appendChild(thead)
    for(let i=0;i<orderArrayHeader.length;i++){
      thead.appendChild(document.createElement("th")).
      appendChild(document.createTextNode(orderArrayHeader[i]));
    }
    tbl.style.width  = '900px';
    tbl.style.border = '1px solid black';
    const fields = ['from', 'receivedDateTime', 'subject', 'bodyPreview'];

    for(let i = 0; i < data.value.length; i++){
      const tr = tbl.insertRow();
      for(let j = 0; j < fields.length; j++){
        const td = tr.insertCell();
        td.style.border = '1px solid black';
        if(fields[j] === 'from') {
          td.appendChild(document.createTextNode(data.value[j][fields[j]].emailAddress.name));
        } else td.appendChild(document.createTextNode(data.value[j][fields[j]]));
      }
    }
    document.querySelector('.container').appendChild(tbl);
    // win.webContents.send('login', data.access_token);
  });
});

setProvider()