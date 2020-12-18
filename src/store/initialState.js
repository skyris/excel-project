import {storage, TABLE} from '@core/utils'

const defaultState = {
  colState: {},
  rowState: {},
  dataState: {}, // {'0:1': 'some text'}
  currentText: '',
  rowsAmount: TABLE.maxHeight,
  title: 'Новая таблица',
}
export const initialState = storage('excel-state') || defaultState
