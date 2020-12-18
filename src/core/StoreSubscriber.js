import {isEqual} from '@core/utils'

export class StoreSubscriber {
  constructor(store) {
    this.store = store
    this.sub = null
    this.prevState = {}
  }

  subscribeComponents(components) {
    this.prevState = this.store.getState()
    this.sub = this.store.subscribe(() => {
      const state = this.store.getState()
      Object.keys(state).forEach(key => {
        if (!isEqual(this.prevState[key], state[key])) {
          components.forEach(component => {
            if (component.isWatching(key)) {
              const changes = {
                [key]: state[key],
              }
              component.storeChanged(changes)
            }
          })
        }
      })
      this.prevState = state
    })
  }

  unsubscribeFromStore() {
    this.sub.unsubscribe()
  }
}
