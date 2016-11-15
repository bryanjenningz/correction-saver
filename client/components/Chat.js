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

const Correction = ({originalText, onAccept, onCancel}) => {
  let correctionInput

  return (
    <div className="col-sm-offset-4 col-sm-4">
      <h2 className="text-center">Correction</h2>
      <div className="text-center">{originalText}</div>
      <div className="col-xs-8">
        <input className="form-control" ref={(node) => correctionInput = node} defaultValue={originalText} />
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
  originalText: PropTypes.string.isRequired,
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
      byReceiverId: {},
      savedMessages: [],
      correcting: null // Maybe Int
    }
  }

  receiveMessage(message) {
    const {receiverId} = message
    const messages = this.state.byReceiverId[receiverId] || []

    this.setState({
      byReceiverId: {
        ...this.state.byReceiverId,
        [receiverId]: [...messages, message]
      }
    })
  }

  sendMessage(message) {
    this.socket.emit('sendMessage', message)
  }

  saveMessage(receiverId, i) {
    this.setState({
      savedMessages: [
        ...this.state.savedMessages,
        this.state.byReceiverId[receiverId][i]
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
    const receiverId = this.props.params.receiverId
    const senderId = '-1'
    const messages = this.state.byReceiverId[receiverId] || []

    if (typeof this.state.correcting === 'number') {
      const originalMessage = messages[this.state.correcting]
      return (
        <Correction
          originalText={originalMessage.text}
          onAccept={(correctionText) => {
            this.sendMessage({
              ...originalMessage,
              type: 'CORRECTION',
              correction: correctionText
            })
            this.setState({correcting: null})
          }}
          onCancel={() => this.setState({correcting: null})} />
      )
    }

    return (
      <div>
        <MessageInput
          onSubmit={this.sendMessage.bind(this)}
          receiverId={receiverId}
          senderId={senderId} />
        <Messages
          messages={messages}
          onSave={this.saveMessage.bind(this, receiverId)}
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
