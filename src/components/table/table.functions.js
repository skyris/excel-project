export function shouldResize(event) {
  return event.target.dataset.resize
}
export const isCell = event => event.target.dataset.type === 'cell'
