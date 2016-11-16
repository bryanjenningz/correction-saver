import {combineReducers} from 'redux'

const byReceiverId = (state = {}, action) => {
  switch (action.type) {
    case 'RECEIVE_MESSAGE':
      return {...state, [action.message.id]: action.message}
    default:
      return state
  }
}

const savedMessages = (state = [], action) => {
  switch (action.type) {
    case 'SAVE_MESSAGE':
      return [...state, action.message]
    default:
      return state
  }
}

const correcting = (state = null, action) => {
  switch (action.type) {
    case 'CORRECTING':
      return action.correcting
    default:
      return state
  }
}

export default combineReducers({
  byReceiverId,
  savedMessages,
  correcting
})
