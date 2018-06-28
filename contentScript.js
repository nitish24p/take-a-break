//alert('I Am content');
//chrome.runtime.onMessage.addListener()

console.log('loading cs');

chrome.runtime.onMessage.addListener(msgObj => {
  const { message } = msgObj;
  switch (message) {
    case 'SHOW_POP_UP':
      document.querySelector('body').insertAdjacentHTML('beforeend', modalString);
      const button = document.querySelector('.timer-button');
      button.onclick = closePopModal;
      break;

    case 'REMOVE_POP_UP':
      const modal = document.querySelector('.white-opaque');
      document.body.removeChild(modal);
      break;
  
    default:
      break;
  }
  // do something with msgObj
  console.log(msgObj);
 
});

function closePopModal() {
  const count = 1;
  chrome.runtime.sendMessage({ type: "START_REMOVING_POPUP", count: count });
}

function injectStyles(url) {
  var elem = document.createElement('link');
  elem.rel = 'stylesheet';
  elem.setAttribute('href', url);
  document.body.appendChild(elem);
}

injectStyles(chrome.extension.getURL('content.css'));

console.log(chrome.runtime);

const modalString = `
  <div class="white-opaque">
    <div class="time-over-card">
      <div class="time-over-watch-container">
        <div class="contain-clock">
          <div class="face-1">
            <div class="hour"></div>
            <div class="minute"></div>
            <div class="second"></div>
            <div class="center"></div>
          </div> 

          <div class="face-2">
            
          </div>

          <div class="arm"></div>
          <div class="arm arm-2"></div>

          <div class="bell"></div>
          <div class="bell bell-2"></div>

          <div class="hammer"></div>

          <div class="handle"></div>
        </div>

      </div>
      <div class="time-over-message-container">
        <h2>Hey you!!</h2>
        <p>Quit staring at the screen</p>
        <button class='timer-button'>Stop This Shit</button>
      </div>
    </div>
  </div>
`
