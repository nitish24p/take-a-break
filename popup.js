
function Timer() {
  this.button = document.querySelector('.button');
  this.toggle = document.querySelector('.toggle-switch');
  this.storage = chrome.storage.local;
  this.inputField = document.querySelector('.inputfield');
  this.actions = document.querySelector('.actions');
  this.body = document.querySelector('body');
  this.error = document.querySelector('.error');
  this.config = {};
}

Timer.prototype.init = function () {
  this.button.addEventListener('click', this.handleButtonClick.bind(this));
  this.toggle.addEventListener('click', this.handleToggleSwitch.bind(this));
  chrome.runtime.onMessage.addListener(this.messageListener.bind(this))
  this.sendMessageToTab = this.sendMessageToTab.bind(this);
  this.storageCallback = this.storageCallback.bind(this);
  this.storage.get('config', this.storageCallback);
}

Timer.prototype.storageCallback = function(data) {
  if (data.config) {
    const config = JSON.parse(data.config);
    if (config.status) {
      this.toggle.checked = config.status
      this.inputField.value = config.timer;
      this.actions.classList.add('show-item');
    }
  }
}

Timer.prototype.handleToggleSwitch = function (event) {
  const isChecked = event.target.checked;

  if (isChecked) {
    this.actions.classList.add('show-item');
  } else {
    this.storage.get('config', (data) => {
      if (data.config) {
        this.storage.remove('config');
      }
    })
    this.actions.classList.remove('show-item');
  }
  console.log(event.target.checked);
};

Timer.prototype.handleButtonClick = function () {
  let value = document.querySelector('.inputfield').value;
  if (!value) {
    this.error.innerHTML = 'Enter correct value';
    return;
  }
  const message = 'SET_TIME_INTERVAL';
  value = parseInt(this.inputField.value, 10);
  this.config.status = this.toggle.checked;
  this.config.timer = this.convertMinutesToMs(value);
  this.sendMessage(
    { message,
      timeInterval: this.convertMinutesToMs(value),
      config: JSON.stringify(this.config) 
    }
  );
};

Timer.prototype.convertMinutesToMs = function(val) {
  return val * 1 * 1000
}

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