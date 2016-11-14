import React, {Component} from 'react'

export default class Chat extends Component {
  constructor() {
    super()
    this.socket = io()
    this.state = {
      messages: [], // [{type: String, text: String, correction: Maybe String}]
      savedMessages: [], // [{type: String, text: String, correction: Maybe String}]
      correcting: null // Maybe Int
    }
  }

  receiveMessage(message) {
    this.setState({messages: [...this.state.messages, message]})
  }

  sendMessage(message) {
    this.socket.emit('sendMessage', message)
  }

  saveMessage(i) {
    this.setState({
      savedMessages: [
        ...this.state.savedMessages,
        this.state.messages[i]
      ]
    })
  }

  removeSavedMessage(i) {
    this.setState({
      savedMessages: [
        ...this.state.savedMessages.slice(0, i),
        ...this.state.savedMessages.slice(i + 1)
      ]
    })
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
        <div>
          {this.state.messages.map((message, i) => {
            switch (message.type) {
              case 'CORRECTION':
                return (
                  <li key={i} className="row">
                    <div className="col-xs-6">{message.text}</div>
                    <div className="col-xs-6">{message.correction}</div>
                    <button className="pull-right">Save</button>
                  </li>
                )
              case 'MESSAGE':
                return (
                  <li key={i}>
                    <div onClick={() => {
                      this.setState({correcting: i})
                    }}>{message.text}</div>
                    <button className="pull-right" onClick={this.saveMessage.bind(this, i)}>Save</button>
                  </li>
                )
              default:
                return <li key={i}>INVALID MESSAGE TYPE</li>
            }
          })}
        </div>
        {this.state.savedMessages.length > 0 ?
          <div>
            <h2>Saved Messages</h2>
            <div>
              {this.state.savedMessages.map((message, i) => {
                switch (message.type) {
                  case 'CORRECTION':
                    return (
                      <li key={i} className="row" onClick={this.removeSavedMessage.bind(this, i)}>
                        <div className="col-xs-6">{message.text}</div>
                        <div className="col-xs-6">{message.correction}</div>
                      </li>
                    )
                  case 'MESSAGE':
                    return (
                      <li key={i} onClick={this.removeSavedMessage.bind(this, i)}>
                        {message.text}
                      </li>
                    )
                  default:
                    return <li key={i}>INVALID MESSAGE TYPE</li>
                }
              })}
            </div>
          </div> : null}
      </div>
    )
  }
}
