
function Timer() {
  this.button = document.querySelector('.button');
  //this.toggle = document.querySelector('.toggle-switch');
  this.state = {}
}

Timer.prototype.init = function () {
  this.button.addEventListener('click', this.handleButtonClick.bind(this));
  //this.toggle.addEventListener('click', this.handleToggleSwitch.bind(this));
  chrome.runtime.onMessage.addListener(this.messageListener.bind(this))
  this.sendMessageToTab = this.sendMessageToTab.bind(this);
  this.state.showTimer = false;
}

// Timer.prototype.handleToggleSwitch = function (event) {
//   this.toggle.checked = event.target.checked;
//   console.log(event.target.checked);
// };

Timer.prototype.handleButtonClick = function () {
  const message = 'SET_TIME_INTERVAL';
  this.sendMessage({ message, timeInterval: 5000 });
};

Timer.prototype.sendMessageToTab = function (message, onlyToActiveTab) {
  const config = {};
  if (onlyToActiveTab) {
    config.active = true;
    config.currentWindow = true;
  }
  chrome.tabs.query(config, tabs => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, message);
    });
  });
}

Timer.prototype.sendMessage = function (message) {
  chrome.runtime.sendMessage(message);
}

Timer.prototype.messageListener = function (message, sender) {
  console.log(message, sender);
  const { type } = message;
  switch (type) {
    case 'START_REMOVING_POPUP':
      const message = 'REMOVE_POP_UP'
      this.sendMessageToTab({ message })
      break;

    default:
      break;
  }
}


window.onload = function (params) {
  const timer = new Timer();
  timer.init();
}