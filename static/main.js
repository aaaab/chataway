/*global io*/
/*global Notification*/
(function(window) {
  window.app = window.app || {};
  
  /**
   * Handle connection.
   */
  window.app.onConnect = function() {
    // Join the room.
    window.app.socket.emit('room', window.app.roomId);
    
    // Send Hello, world! messages.
    if(!window.app.helloWorld) {
      window.app.sendMessage('Hello, world!', true);
      window.app.sendMessage('Chats are disposable. You can share them with ' + 
        'anyone and make a new one anytime!', true);
      window.app.helloWorld = true;
    } else {
      window.app.sendMessage('Connected to server.', true);
    }
    
    if (!('Notification' in window)) {
      // Browser doesn't support notifications.
    } else if (Notification.permission !== 'denied' && 
        Notification.permission !== 'granted') {
      Notification.requestPermission(function(permission) {
        if (permission === 'granted') {
          new Notification('Yay, notifications are on!', {
            body: 'They will only work if chataway is open and only for your ' + 
              'current chat.'
          });
          window.app.onMessage({
            message: 'Notifications are now enabled, however they will only ' + 
              'work if chataway is open and only for your current chat.',
            foobar: true
          });
        }
      });
    }
    
    // Bind username box to window.app.sender.
    var usernameBox = document.getElementById('username');
    function updateUsername() {
      var sender = usernameBox.value;
      
      // If the username is blank.
      if(!sender || sender.length === 0 || !sender.trim()) {
        return;
      }
      
      // If nothing has changed at all.
      if(sender == window.app.sender) {
        return;
      }
      
      window.app.onMessage({
        message: `You changed your username to ${sender}.`,
        foobar: true
      });
      window.app.sender = sender;
    }
    updateUsername();
    usernameBox.addEventListener('blur', updateUsername, false);
    
    // Message box events.
    var messageBox = document.getElementById('message');
    function sendMessage() {
      var message = messageBox.value;
      if(message === '') {
        console.warn('message box empty');
        return;
      }
      messageBox.value = '';
      window.app.sendMessage(message, false);
    }
    document.getElementById('submit').addEventListener('click', sendMessage, 
      false);
    messageBox.addEventListener('keydown', function(event) {
      // If enter key is pressed.
      if(event.keyCode == 13) {
        sendMessage();
      }
    }, false);
  };
  
  /**
   * Get a timestamp for right now.
   * 
   * @returns {string}
   */
  window.app.getTimestamp = function() {
    var timestamp = new Date().toTimeString();
    return timestamp;
  };
  
  /**
   * Handle a message.
   * 
   * @param {Object} event
   */
  window.app.onMessage = function(event) {
    var messageList = document.getElementById('message-list');
    var root = document.createElement('li');
    
    // Special foobar handling and styles.
    if(event.foobar) {
      event.sender = 'foobar';
      root.classList = 'foobar';
    }
    
    if(event.error) {
      root.classList = 'foobar error';
    }
    
    // Create the DOM node to represent the message.
    var messageInfo = document.createElement('span');
    messageInfo.classList = 'message-info';
    messageInfo.innerHTML = `<span class='sender'>${event.sender}</span>@` + 
      `<span class='timestamp'>${window.app.getTimestamp()}:</span>`;
    
    var messageText = document.createElement('span');
    messageText.classList = 'message-text';
    messageText.innerHTML = `${event.message}`;
    
    root.appendChild(messageInfo);
    root.appendChild(messageText);
    messageList.appendChild(root);
    
    // Finally, broadcast a notification, but only if the sender isn't foobar.
    if (Notification.permission === 'granted' && !event.foobar && 
      event.sender != window.app.sender) {
      new Notification(event.sender, {
        body: event.message
      });
    }
  };
  
  /**
   * Handle disconnect.
   */
  window.app.onDisconnect = function() {
    window.app.sendMessage('Disconnected from server.', true);
  };
  
  /**
   * Send a message.
   * 
   * @param {string} message - The message to send.
   * @param {boolean} foobar - true to only show to local user as foobar.
   */
  window.app.sendMessage = function(message, foobar) {
    if(foobar) {
      window.app.onMessage({
        message: message,
        foobar: true
      });
      return;
    }
    
    var sender = window.app.sender;
    if(!sender || sender.length === 0 || !sender.trim()) {
      window.app.onMessage({
        message: 'You need to set a username before you can send messages.',
        foobar: true,
        error: true
      });
      return;
    }
    
    window.app.socket.emit('message', {
      message: message,
      sender: sender,
      roomId: window.app.roomId
    });
  };
  
  /**
   * The username of the current user.
   * 
   * @type {string}
   */
  window.app.sender = null;
  
  /**
   * True if Hello, World! messages have been displayed to the user.
   * 
   * @type {boolean}
   */
  window.app.helloWorld = false;
  
  /**
   * The ID of the current room (/<roomId>).
   * 
   * @type {string}
   */
  window.app.roomId = window.location.pathname;
  
  /**
   * Initialise the app.
   */
  window.app.init = function() {
    console.log('Hello, world!');
    
    // Connect to server and bind events.
    var socket = io(`https://chataway-thinkallabout.c9users.io`);
    socket.on('connect', window.app.onConnect);
    socket.on('message', window.app.onMessage);
    socket.on('disconnect', window.app.onDisconnect);
    window.app.socket = socket;
  }
  
  window.onload = window.app.init;
})(window);