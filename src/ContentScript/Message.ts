const IDENTIFIER = 'liker-land-extension'

const ActionCallbacks: Map<string, Array<Function>> = new Map();

function onReceive (action: string, callback: (content: any) => any, once = false) {
    if (once) {
        const originCallback = callback;
        callback = function (content) {
            originCallback(content);
            const callbacks = ActionCallbacks.get(action)!;
            callbacks.splice(callbacks.indexOf(callback));
        };
    }
    if (ActionCallbacks.has(action)) ActionCallbacks.get(action)!.push(callback);
    else ActionCallbacks.set(action, [callback]);
}

function send (action: string, content: any) {
    window.postMessage({
        action,
        content,
        _identifier: IDENTIFIER
    }, window.location.origin);
}

window.addEventListener('message', event => {
    if (event.source !== window || !event.data || event.data._identifier !== IDENTIFIER) return;
    
    const callbacks = ActionCallbacks.get(event.data.action) || [];
    callbacks.forEach(callback => callback(event.data.content))
});

export { onReceive, send };