=//alert('I Am content');
//chrome.runtime.onMessage.addListener()

console.log('loading cs');

chrome.runtime.onMessage.addListener(msgObj => {
  const { message } = msgObj;
  console.log(msgObj);
  switch (message) {
    case 'SHOW_POP_UP':
      document.querySelector('body').insertAdjacentHTML('beforeend', modalString);
      const buttons = document.querySelectorAll('.timer-button');
      buttons.forEach(button => button.addEventListener('click', closePopModal));
      //button.onclick = closePopModal;
      break;

    case 'REMOVE_POP_UP':
      console.log('come over here')
      const modal = document.querySelector('.white-opaque');
      document.body.removeChild(modal);
      break;

    default:
      break;
  }
});

function closePopModal() {
  chrome.runtime.sendMessage({ message: "START_REMOVING_POPUP" });
}

function injectStyles(url) {
  var elem = document.createElement('link');
  elem.rel = 'stylesheet';
  elem.setAttribute('href', url);
  document.body.appendChild(elem);
}

injectStyles(chrome.extension.getURL('content.css'));

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
        <h2 class="heading">Hey you!!</h2>
        <p class="text">Maybe it's time to do something different. Take a break...</p>
        <button class='timer-button'>Okay, Got It</button>
        <button class='timer-button secondary'>Don't Remind me again</button>
      </div>
    </div>
  </div>
`
