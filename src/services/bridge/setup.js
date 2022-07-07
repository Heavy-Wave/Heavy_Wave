export default function (callback) {
  if (window.WebViewJavascriptBridge) {
    callback(window.WebViewJavascriptBridge)
    return
  }
  if (window.WKWebViewJavascriptBridge) {
    callback(window.WKWebViewJavascriptBridge)
    return
  }

  if (window.WVJBCallbacks) {
    window.WVJBCallbacks.push(callback)
    return
  }
  if (window.WKWVJBCallbacks) {
    window.WKWVJBCallbacks.push(callback)
    return
  }

  window.WVJBCallbacks = window.WKWVJBCallbacks = [callback]

  if (window.WKWebViewJavascriptBridge) {
    window.webkit.messageHandlers.iOS_Native_InjectJavascript.postMessage(null)
  } else {
    const WVJBIframe = window.document.createElement('iframe')
    WVJBIframe.style.display = 'none'
    WVJBIframe.src = 'https://__bridge_loaded__'
    window.document.documentElement.appendChild(WVJBIframe)
    setImmediate(function () {
      window.document.documentElement.removeChild(WVJBIframe)
    })
  }
}
