import { API_URL } from './config'

export const apiUrl = ( after='', dir='/' ) =>
  API_URL.replace(/\/{1,}$/, '').concat('/'.concat(dir, after).replace(/\/{1,}/g, '/'))

export const callBackground = (message) => new Promise(resolve =>
{
  message.__id = Math.random().toString(32)

  chrome.runtime.sendMessage(Object.assign(message, { _saverd: 1 }), response => chrome.runtime.lastError)

  const listen = +new Date, listener = (data) =>
  {
    if ( data && data.__id == message.__id ) {
      resolve(data.bgResponse)
      chrome.runtime.onMessage.removeListener(listener)
    } else if ( listen - +new Date > 60 * 1000 ) {
      resolve(undefined)
      chrome.runtime.onMessage.removeListener(listener)
    }
  }

  chrome.runtime.onMessage.addListener(listener)
})