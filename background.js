
function sendMessage(message) {
  chrome.runtime.sendMessage(message);
}

let timeInterval;

function sendMessageToTabs(message, onlyToActiveTab) {
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

chrome.runtime.onMessage.addListener((messageObj, sender) => {
  console.log(messageObj);
  const { message } = messageObj;
  let messageContent = '';
  switch (message) {
    case 'SHOW_POP_UP':
      messageContent = 'SHOW_POP_UP'
      sendMessageToTabs({ message: messageContent});
      break;

    case 'START_REMOVING_POPUP':
      messageContent = 'REMOVE_POP_UP'
      sendMessageToTabs({ message: messageContent });
      break;

    case 'SET_TIME_INTERVAL':
      timeInterval = setInterval(() => {
        messageContent = 'SHOW_POP_UP'
        sendMessageToTabs({ message: messageContent});
        clearInterval(timeInterval);
      }, messageObj.timeInterval);

    case 'RESET_TIMER':
      timeInterval = setInterval(() => {
        messageContent = 'SHOW_POP_UP'
        sendMessageToTabs({ message: messageContent});
        clearInterval(timeInterval);
      }, messageObj.timeInterval);
  
    default:
      break;
  }
})


function Background() {

}

Background.prototype.init = function() {

}