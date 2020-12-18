import {
  COL_RESIZE, ROW_RESIZE, CHANGE_TEXT, ADD_ROWS, CHANGE_TITLE,
} from '../store/types'

export function rootReducer(state, action) {
  switch (action.type) {
    case COL_RESIZE:
      return {
        ...state,
        colState: {
          ...state.colState,
          ...action.payload,
        },
      }
    case ROW_RESIZE:
      return {
        ...state,
        rowState: {
          ...state.rowState,
          ...action.payload,
        },
      }
    case CHANGE_TEXT:
      return {
        ...state,
        currentText: action.payload.text,
        dataState: {
          ...state.dataState,
          ...{[action.payload.id]: action.payload.text},
        },
      }
    case ADD_ROWS:
      return {
        ...state,
        rowsAmount: state.rowsAmount + action.payload,
      }
    case CHANGE_TITLE:
      return {
        ...state,
        title: action.payload,
      }
    default:
      return state
  }
}
