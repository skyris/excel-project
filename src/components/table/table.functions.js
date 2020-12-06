export function shouldResize(event) {
  return event.target.dataset.resize
}

export const isCell = event => event.target.dataset.type === 'cell'

export const isAddRowsButton = event => {
  return event.target.dataset.type === 'add-rows-button'
}

export const isDomInstance = obj => !!obj && obj.$el !== undefined
