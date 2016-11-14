import React, {Component} from 'react'
import {render} from 'react-dom'


class App extends Component {
  constructor() {
    super()
    this.socket = io()
    this.state = {messages: []}
  }

  receiveMessage(message) {
    this.setState({messages: [...this.state.messages, message]})
  }

  sendMessage(text) {
    this.socket.emit('sendMessage', {text})
  }

  componentWillMount() {
    this.socket.on('receiveMessage', this.receiveMessage.bind(this))
  }

  render() {
    return (
      <div className="text-center">
        <form onSubmit={(e) => {
          e.preventDefault()
          if (this.refs.input.value.trim()) {
            this.sendMessage(this.refs.input.value.trim())
            this.refs.input.value = ''
          }
        }}>
          <input ref="input" />
          <input type="submit" hidden />
        </form>
        {this.state.messages.map((message, i) => <li key={i}>{message.text}</li>)}
      </div>
    )
  }
}

render(<App />, document.querySelector('#root'))
