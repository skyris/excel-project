import {$} from '@core/dom'

export function resizeHandler(table, event) {
  return new Promise(resolve => {
    const $resizer = $(event.target) // .col-resize or .row-resize
    const type = $resizer.data.resize
    const $parent = $resizer.closest('[data-type="resizable"]')
    const coords = $parent.getCoords()
    const rootCoords = table.$root.getCoords()
    const MIN_CELL_WIDTH =
      parseInt(getComputedStyle($parent.$el)['min-width']) || 40
    const MIN_CELL_HEIGHT =
      parseInt(getComputedStyle($parent.$el)['min-height']) || 20

    if (type === 'col') {
      table.vertical.css({
        '--mouse-vertical': event.clientX - rootCoords.left + 'px',
      })
      table.$root.append(table.vertical)
    } else {
      table.horizontal.css({
        '--mouse-horizontal': event.clientY - rootCoords.top + 'px',
      })
      table.$root.append(table.horizontal)
    }

    document.onmousemove = e => {
      if (type === 'col') {
        if (e.clientX - coords.right + coords.width >= MIN_CELL_WIDTH) {
          table.vertical.css({
            '--mouse-vertical': e.clientX - rootCoords.left + 'px',
          })
        }
      } else {
        if (e.clientY - coords.bottom + coords.height >= MIN_CELL_HEIGHT) {
          table.horizontal.css({
            '--mouse-horizontal': e.clientY - rootCoords.top + 'px',
          })
        }
      }
    }

    document.onmouseup = e => {
      if (type === 'col') {
        table.vertical.remove()
        const delta = e.pageX - coords.right
        const value = coords.width + delta >= MIN_CELL_WIDTH ?
          coords.width + delta :
          MIN_CELL_WIDTH
        const colId = $parent.data.col
        table.$root.findAll(`[data-col="${colId}"]`)
            .forEach($el => $el.css({width: value + 'px'}))
        resolve({
          payload: {[colId]: value},
          type,
        })
      } else {
        table.horizontal.remove()
        const delta = e.pageY - coords.bottom
        const value = coords.height + delta >= MIN_CELL_HEIGHT ?
          coords.height + delta :
          MIN_CELL_HEIGHT
        const rowId = $parent.data.row
        table.$root.findAll(`[data-row="${$parent.data.row}"]`)
            .forEach($el => $el.css({height: value + 'px'}))
        resolve({
          payload: {[rowId]: value},
          type,
        })
      }

      document.onmousemove = null
      document.onmouseup = null
    }
  })
}
