const electron = require('electron');
const { OUTLOOK_MSG_API } = require('./providers/constants');

function setProvider() {
  const cards = document.querySelectorAll('.card');
  cards.forEach((item) => {
    item.addEventListener('click', () => electron.ipcRenderer.send('set:provider', item.textContent));
  });
}
const promises = [];
const mailList = [];
async function handleResponse(data, provider, token) {
  const { body } = document;
  const tbl = document.createElement('table');
  const thead = document.createElement('thead');
  const orderArrayHeader = ['From', 'Date', 'Subject', 'Message'];
  tbl.appendChild(thead);
  for (let i = 0; i < orderArrayHeader.length; i++) {
    thead.appendChild(document.createElement('th'))
      .appendChild(document.createTextNode(orderArrayHeader[i]));
  }
  tbl.style.width = '900px';
  tbl.style.border = '1px solid black';
  const fields = ['From', 'Date', 'Subject', 'bodyPreview'];
  switch (provider) {
    case 'Google':
      data.messages.forEach((i) => {
        promises.push(fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${i.id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((response) => response.json()).then((data) => {
          mailList.push(data);
        }));
      });
      await Promise.all(promises);
      for (let i = 0; i < mailList.length; i++) {
        const tr = tbl.insertRow();
        for (let j = 0; j < fields.length; j++) {
          const td = tr.insertCell();
          td.style.border = '1px solid black';
          if (fields[j] === 'bodyPreview') {
            td.appendChild(document.createTextNode('Not available'));
          } else if (mailList[j].payload.headers[i]) {
            td.appendChild(document.createTextNode(mailList[j].payload.headers[i].name[fields[j]]));
          }
        }
      }
      document.querySelector('.container').appendChild(tbl);

    default: break;
  }
}

electron.ipcRenderer.on('login', (e, {
  token, endpoint, host, provider,
}) => {
  fetch(endpoint, {
    method: 'GET',
    headers: {
      // Host: 'https://graph.microsoft.com',
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => response.json()).then((data) => {
    // const res = handleResponse(data, provider, token);
    const { body } = document;
    const tbl = document.createElement('table');
    const thead = document.createElement('thead');
    const orderArrayHeader = ['From', 'Date', 'Subject', 'Message'];
    tbl.appendChild(thead);
    for (let i = 0; i < orderArrayHeader.length; i++) {
      thead.appendChild(document.createElement('th'))
        .appendChild(document.createTextNode(orderArrayHeader[i]));
    }
    tbl.style.width = '900px';
    tbl.style.border = '1px solid black';
    const fields = ['From', 'Date', 'Subject', 'bodyPreview'];
    for (let i = 0; i < data.value.length; i++) {
      const tr = tbl.insertRow();
      for (let j = 0; j < fields.length; j++) {
        const td = tr.insertCell();
        td.style.border = '1px solid black';
        if (fields[j] === 'from') {
          td.appendChild(document.createTextNode(data.value[j][fields[j]].emailAddress.name));
        } else td.appendChild(document.createTextNode(data.value[j][fields[j]]));
      }
    }
    document.querySelector('.container').appendChild(tbl);
  });
});

setProvider();
