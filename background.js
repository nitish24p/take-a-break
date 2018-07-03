function Background() {
  this.timeInterval = null;
  this.storage = chrome.storage.local;
  this.navigation = chrome.webNavigation;
  this.config = {};
}

Background.prototype.init = function () {
  console.log(chrome.storage);
  chrome.runtime.onMessage.addListener(this.messageListener.bind(this));
  this.startTimer = this.startTimer.bind(this);
  this.navigation.onCommitted.addListener(this.navigationCallback.bind(this));
}

Background.prototype.navigationCallback = function(data) {
  if (this.timeInterval === null) {
    if (data.config) {
      const config = JSON.parse(data.config);
      this.startTimer(config.timer * 1000);
    }
  }
}

Background.prototype.startTimer = function (delay) {
  return setTimeout(() => {
    const messageContent = 'SHOW_POP_UP'
    this.sendMessageToTabs({ message: messageContent });
  }, delay);
}

Background.prototype.messageListener = function (messageObj, sender) {
  console.log(messageObj, sender);
  const { message } = messageObj;
  let messageContent = '';
  switch (message) {
    case 'START_REMOVING_POPUP':
      console.log('getting config', this.config);
      this.timeInterval = this.startTimer(this.config.timer * 1000);
      break;

    case 'SET_TIME_INTERVAL':
      this.config = JSON.parse(messageObj.config);
      this.storage.set({ config: messageObj.config}, (data) => {
        this.timeInterval = this.startTimer(messageObj.timeInterval);
      })
      break;

    case 'STOP_TIMER_CLIENT':
      clearTimeout(this.timeInterval);
      messageContent = 'REMOVE_POP_UP'
      this.sendMessageToTabs({ message: messageContent });
      break;

    case 'STOP_TIMER':
      clearTimeout(this.timeInterval);
      break;

    default:
      break;
  }
}

Background.prototype.sendMessageToTabs = function (message, onlyToActiveTab) {
  console.log("come here", message);
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

window.onload = function (params) {
  const backgroundScript = new Background();
  backgroundScript.init();
}