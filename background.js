function Background() {
  this.timeInterval = null;
}

Background.prototype.init = function () {
  chrome.runtime.onMessage.addListener(this.messageListener.bind(this));
}

Background.prototype.messageListener = function (messageObj, sender) {
  console.log(messageObj, sender);
  const { message } = messageObj;
  let messageContent = '';
  switch (message) {
    case 'START_REMOVING_POPUP':
      messageContent = 'REMOVE_POP_UP'
      this.sendMessageToTabs({ message: messageContent });
      break;

    case 'SET_TIME_INTERVAL':
      this.timeInterval = setTimeout(() => {
        messageContent = 'SHOW_POP_UP'
        this.sendMessageToTabs({ message: messageContent });
      }, messageObj.timeInterval);
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