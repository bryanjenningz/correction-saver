import React, {Component} from 'react'
import {render} from 'react-dom'


class App extends Component {
  constructor() {
    super()
    this.socket = io()
    this.state = {
      messages: [], // [{type: String, text: String, correction: Maybe String}]
      correcting: null // Maybe Int
    }
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
    if (typeof this.state.correcting === 'number') {
      const originalMessage = this.state.messages[this.state.correcting].text
      return (
        <div className="text-center">
          <h2>Correction</h2>
          <div>{originalMessage}</div>
          <input ref="correctionInput" defaultValue={originalMessage} />
          <button onClick={() => {
            this.sendMessage({
              type: 'CORRECTION',
              text: originalMessage,
              correction: this.refs.correctionInput.value
            })
            this.setState({correcting: null})
          }}>Done</button>
          <button onClick={() => {
            this.setState({correcting: null})
          }}>Cancel</button>
        </div>
      )
    }

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
              return (
                <li key={i} onClick={() => {
                  this.setState({correcting: i})
                }}>
                  {message.text}
                </li>
              )
            default:
              return <li key={i}>INVALID MESSAGE TYPE</li>
          }
        })}
      </div>
    )
  }
}

render(<App />, document.querySelector('#root'))
