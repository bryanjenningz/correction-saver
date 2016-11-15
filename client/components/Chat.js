import React, {Component, PropTypes} from 'react'

const messageType = PropTypes.shape({
  type: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  receiverId: PropTypes.string.isRequired,
  senderId: PropTypes.string.isRequired,
  correction: PropTypes.string
})

const SavedMessages = ({messages, onRemove}) =>
  <div className="row">
    <div className="col-sm-offset-4 col-sm-4">
      <h2 className="text-center">Saved Messages</h2>
      {messages.map((message, i) =>
        <SavedMessage key={i} message={message} onRemove={() => onRemove(i)} />
      )}
    </div>
  </div>

SavedMessages.propTypes = {
  messages: PropTypes.arrayOf(messageType).isRequired,
  onRemove: PropTypes.func.isRequired
}

const SavedMessage = ({message, onRemove}) => {
  switch (message.type) {
    case 'CORRECTION':
      return (
        <div className="well well-sm clearfix">
          <div className="col-xs-5">{message.text}</div>
          <div className="col-xs-6 text-success">{message.correction}</div>
          <span className="pull-right">
            <i onClick={onRemove} className="glyphicon glyphicon-remove" />
          </span>
        </div>
      )
    case 'MESSAGE':
      return (
        <div className="well well-sm clearfix">
          {message.text}
          <span className="pull-right">
            <i onClick={onRemove} className="glyphicon glyphicon-remove" />
          </span>
        </div>
      )
    default:
      return <div>INVALID MESSAGE TYPE</div>
  }
}

SavedMessage.propTypes = {
  message: messageType.isRequired,
  onRemove: PropTypes.func.isRequired
}

const Correction = ({originalMessage, onAccept, onCancel}) => {
  let correctionInput

  return (
    <div className="col-sm-offset-4 col-sm-4">
      <h2 className="text-center">Correction</h2>
      <div className="text-center">{originalMessage}</div>
      <div className="col-xs-8">
        <input className="form-control" ref={(node) => correctionInput = node} defaultValue={originalMessage} />
      </div>
      <div className="col-xs-4">
        <button className="btn btn-success" onClick={() => onAccept(correctionInput.value)}>
          <i className="glyphicon glyphicon-ok" />
        </button>
        <button className="btn btn-danger" onClick={onCancel}>
          <i className="glyphicon glyphicon-remove" />
        </button>
      </div>
    </div>
  )
}

Correction.propTypes = {
  originalMessage: PropTypes.string.isRequired,
  onAccept: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}

const MessageInput = ({onSubmit, receiverId, senderId}) => {
  let input
  console.log(receiverId, senderId)

  return (
    <div className="row">
      <form className="col-sm-offset-4 col-sm-4" onSubmit={(e) => {
        e.preventDefault()
        if (input.value.trim()) {
          onSubmit({
            type: 'MESSAGE',
            text: input.value.trim(),
            receiverId,
            senderId
          })
          input.value = ''
        }
      }}>
        <input className="form-control" ref={(node) => input = node} />
      </form>
    </div>
  )
}

MessageInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  receiverId: PropTypes.string.isRequired,
  senderId: PropTypes.string.isRequired
}

const Messages = ({messages, onSave, onCorrect}) =>
  <div className="row">
    <div className="col-sm-offset-4 col-sm-4">
      {messages.map((message, i) => {
        switch (message.type) {
          case 'CORRECTION':
            return (
              <div key={i} className="well well-sm clearfix">
                <div className="col-xs-5">{message.text}</div>
                <div className="col-xs-6 text-success">{message.correction}</div>
                <div className="col-xs-1">
                  <button className="btn btn-primary btn-xs" onClick={() => onSave(i)}><i className="glyphicon glyphicon-save" /></button>
                </div>
              </div>
            )
          case 'MESSAGE':
            return (
              <div key={i} className="well well-sm clearfix">
                <div className="col-xs-11" onClick={() => onCorrect(i)}>{message.text}</div>
                <div className="col-xs-1">
                  <button className="btn btn-primary btn-xs" onClick={() => onSave(i)}><i className="glyphicon glyphicon-save" /></button>
                </div>
              </div>
            )
          default:
            return <div key={i}>INVALID MESSAGE TYPE</div>
        }
      })}
    </div>
  </div>

Messages.propTypes = {
  messages: PropTypes.arrayOf(messageType).isRequired,
  onSave: PropTypes.func.isRequired,
  onCorrect: PropTypes.func.isRequired
}

class Chat extends Component {
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
        <Correction
          originalMessage={originalMessage}
          onAccept={(correctionText) => {
            this.sendMessage({
              type: 'CORRECTION',
              text: originalMessage,
              correction: correctionText
            })
            this.setState({correcting: null})
          }}
          onCancel={() => this.setState({correcting: null})} />
      )
    }

    const receiverId = this.props.params.receiverId
    const senderId = '-1'

    return (
      <div>
        <MessageInput
          onSubmit={this.sendMessage.bind(this)}
          receiverId={receiverId}
          senderId={senderId} />
        <Messages
          messages={this.state.messages}
          onSave={this.saveMessage.bind(this)}
          onCorrect={(i) => this.setState({correcting: i})} />
        {this.state.savedMessages.length > 0 ?
          <SavedMessages
            messages={this.state.savedMessages}
            onRemove={this.removeSavedMessage.bind(this)} /> : null}
      </div>
    )
  }
}

export default Chat
