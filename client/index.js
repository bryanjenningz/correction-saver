import React, {Component} from 'react'
import {render} from 'react-dom'
import Chat from './components/Chat'
import People from './components/People'

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

render(<App />, document.querySelector('#root'))
