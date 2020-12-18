import {Excel} from '@/components/excel/Excel'
import {Header} from '@/components/header/Header'
import {Toolbar} from '@/components/toolbar/Toolbar'
import {Formula} from '@/components/formula/Formula'
import {Table} from '@/components/table/Table'
import {createStore} from '@core/createStore'
import {rootReducer} from '@/store/rootReducer'
import {initialState} from '@/store/initialState'
import {storage} from '@core/utils'
import './scss/index.scss'

const store = createStore(rootReducer, initialState)

store.subscribe(() => {
  storage('excel-state', store.getState())
})

const excel = new Excel('#app', {
  components: [
    Header,
    Toolbar,
    Formula,
    Table,
  ],
  store,
})

excel.render()
