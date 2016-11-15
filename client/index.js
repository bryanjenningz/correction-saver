import React, {Component} from 'react'
import {render} from 'react-dom'
import {Router, Route, IndexRoute, hashHistory} from 'react-router'
import Chat from './components/Chat'
import People from './components/People'

const Header = ({children}) =>
  <div>
    <div>
      <a href="#/">Home</a>
    </div>
    {children}
  </div>

const routes =
  <Router history={hashHistory}>
    <Route path="/" component={Header}>
      <IndexRoute component={People} />
      <Route path="/chat/:person" component={Chat} />
    </Route>
  </Router>


class App extends Component {
  render() {
    return (
      <div>
        <Chat />
        <People />
      </div>
    )
  }
}

render(routes, document.querySelector('#root'))
