import React, {Component} from 'react'

const people = [
  {name: 'Abe', speaks: 'Mandarin', learning: 'English'},
  {name: 'Brad', speaks: 'English', learning: 'Mandarin'},
  {name: 'Carl', speaks: 'Spanish', learning: 'English'},
]

export default class People extends Component {
  render() {
    return (
      <div className="col-sm-offset-4 col-sm-4">
        {people.map((person, i) =>
          <div key={i} className="row">
            <div className="col-xs-3">
              <img className="thumbnail" src="default.png" style={{width: 50, height: 50}} />
            </div>
            <div className="col-xs-9">
              <h5 className="col-xs-4">Name: {person.name}</h5>
              <h5 className="col-xs-4">Speaks: {person.speaks}</h5>
              <h5 className="col-xs-4">Learning: {person.learning}</h5>
            </div>
          </div>
        )}
      </div>
    )
  }
}
