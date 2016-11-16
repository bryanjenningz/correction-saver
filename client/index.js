import React from 'react'
import {render} from 'react-dom'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import routes from './config/routes'
import reducer from './reducers/index'

const store = createStore(reducer)
const root = <Provider store={store}>{routes}</Provider>

render(root, document.querySelector('#root'))
