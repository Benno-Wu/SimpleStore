export const simpleStore = new Map()
let origin = simpleStore.__proto__.set
simpleStore._ = new Map()
simpleStore.set = function (key, value) {
    const old = simpleStore.get(key)
    // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Errors/Called_on_incompatible_type
    origin.bind(simpleStore)(key, value)
    const $ = this._.get(key)
    if ($) $(value, old)
}
simpleStore.subscribe = function (key, func) {
    this._.set(key, func)
    return () => { this._.set(key, null) }
}

export const simpleSessionStorage = {
    _: new Map(),
    get length() {
        return sessionStorage.length
    },
    setItem: (keyName, keyValue) => {
        const $ = simpleSessionStorage._.get(keyName)
        const old = simpleSessionStorage.getItem(keyName)
        sessionStorage.setItem(keyName, keyValue)
        if ($) $(keyValue, old)
    },
    subscribe: (key, func) => {
        simpleSessionStorage._.set(key, func)
        return () => { simpleSessionStorage._.set(key, null) }
    },
    ...Object.fromEntries(Object.keys(Storage.prototype).filter(v => !['length', 'setItem'].includes(v)).map(v => [v, sessionStorage[v].bind(sessionStorage)]))
}

export const simpleLocalStorage = {
    _: new Map(),
    get length() {
        return localStorage.length
    },
    setItem: (keyName, keyValue) => {
        const $ = simpleLocalStorage._.get(keyName)
        const old = simpleLocalStorage.getItem(keyName)
        localStorage.setItem(keyName, keyValue)
        if ($) $(keyValue, old)
    },
    subscribe: (key, func) => {
        simpleLocalStorage._.set(key, func)
        return () => { simpleLocalStorage._.set(key, null) }
    },
    ...Object.fromEntries(Object.keys(Storage.prototype).filter(v => !['length', 'setItem'].includes(v)).map(v => [v, localStorage[v].bind(localStorage)]))
}
