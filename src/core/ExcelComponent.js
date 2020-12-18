import {DomListener} from '@core/DomListener'

export class ExcelComponent extends DomListener {
  constructor($root, options={}) {
    super($root, options)
    this.unsubscribers = []
    this.subscribe = options.subscribe || []

    this.prepare()
  }

  prepare() {}

  // Returns component's template
  toHTML() {
    return ''
  }

  $emit(event, ...args) {
    this.emitter.emit(event, ...args)
  }

  $on(event, fn) {
    const unsub = this.emitter.subscribe(event, fn)
    this.unsubscribers.push(unsub)
  }

  $dispatch(action) {
    this.store.dispatch(action)
  }

  isWatching(key) {
    return this.subscribe.includes(key)
  }

  // $subscribe(fn) {
  //   this.storeSub = this.store.subscribe(fn)
  // }

  storeChanged(changes) {
    console.log('changes: ', changes);
  }

  init() {
    this.initDOMListeners()
  }

  destroy() {
    this.removeDOMListeners()
    this.unsubscribers.forEach(unsub => unsub())
    // this.storeSub()
  }
}
