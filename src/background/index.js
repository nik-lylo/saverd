(() => {
  const emitMessage = (message) =>
    chrome.runtime.sendMessage(
      Object.assign(message, { _saverd: 1 }),
      (response) => chrome.runtime.lastError
    );

  chrome.runtime.onMessage.addListener((message, sender, respond) => {
    if (!message || !message._saverd) return;

    switch (true) {
      case !!message.getRequestJson:
        fetch(...message.getRequestJson)
          .then((r) => r.json())
          .then((data) =>
            emitMessage(Object.assign(message, { bgResponse: data }))
          )
          .catch((err) =>
            emitMessage(Object.assign(message, { bgResponse: undefined }))
          );
        break;
      default:
        return respond(), true;
    }
  });
})();
