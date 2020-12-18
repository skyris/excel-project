import {
  COL_RESIZE, ROW_RESIZE, CHANGE_TEXT, ADD_ROWS, CHANGE_TITLE,
} from './types'
import {TABLE} from '@core/utils'

export function tableResize(data) {
  const {type, payload} = data
  return {
    type: type === 'col' ? COL_RESIZE : ROW_RESIZE,
    payload,
  }
}

export function changeText(payload) {
  return {
    type: CHANGE_TEXT,
    payload,
  }
}

export function addRows(payload) {
  TABLE.maxHeight += payload
  return {type: ADD_ROWS, payload}
}

export function changeTitle(payload) {
  return {type: CHANGE_TITLE, payload}
}
