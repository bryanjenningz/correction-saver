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

  sendMessage(message) {
    this.socket.emit('sendMessage', message)
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
            this.sendMessage({
              type: 'MESSAGE',
              text: this.refs.input.value.trim()
            })
            this.refs.input.value = ''
          }
        }}>
          <input ref="input" />
        </form>
        {this.state.messages.map((message, i) => {
          switch (message.type) {
            case 'CORRECTION':
              return (
                <li key={i} className="row">
                  <div className="col-xs-6">{message.text}</div>
                  <div className="col-xs-6">{message.correction}</div>
                </li>
              )
            case 'MESSAGE':
              return <li key={i}>{message.text}</li>
            default:
              return <li key={i}>INVALID MESSAGE TYPE</li>
          }
        })}
      </div>
    )
  }
}

render(<App />, document.querySelector('#root'))
