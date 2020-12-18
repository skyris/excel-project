class Store {
  #state = null
  #reducer = null
  #listeners = []
  constructor(rootReducer, initialState={}) {
    this.#state = rootReducer({...initialState}, {type: '__INIT__'})
    this.#reducer = rootReducer
  }

  subscribe(fn) {
    this.#listeners.push(fn)
    return () => {
      this.#listeners = this.#listeners.filter(listener => listener !== fn)
    }
  }

  dispatch(action) {
    this.#state = this.#reducer(this.#state, action)
    this.#listeners.forEach(listener => listener())
  }

  getState() {
    return this.#state
  }
}

export function createStore(rootReducer, initialState) {
  const store = new Store(rootReducer, initialState)
  window['store'] = store
  return store
}
