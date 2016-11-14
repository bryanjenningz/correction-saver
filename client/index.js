import React, {Component} from 'react'
import {render} from 'react-dom'
import Chat from './components/Chat'

class App extends Component {
  render() {
    return (
      <div>
        <Chat />
      </div>
    )
  }
}

render(<App />, document.querySelector('#root'))
