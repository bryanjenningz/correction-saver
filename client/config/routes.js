import React from 'react'
import {Router, Route, IndexRoute, hashHistory} from 'react-router'
import Chat from '../components/Chat'
import People from '../components/People'
import Header from '../components/Header'

const people = [
  {name: 'Abe', speaks: 'Mandarin', learning: 'English'},
  {name: 'Brad', speaks: 'English', learning: 'Mandarin'},
  {name: 'Carl', speaks: 'Spanish', learning: 'English'},
]

const routes =
  <Router history={hashHistory}>
    <Route path="/" component={Header}>
      <IndexRoute component={() => <People people={people} />} />
      <Route path="/chat/:person" component={Chat} />
    </Route>
  </Router>

export default routes
