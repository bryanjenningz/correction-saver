import React, {Component} from 'react'
import {render} from 'react-dom'

class App extends Component {
  render() {
    return (
      <div className="text-center">
        hello
      </div>
    )
  }
}

render(<App />, document.querySelector('#root'))