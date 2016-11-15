import React, {Component, PropTypes} from 'react'

const People = ({people}) =>
  <div className="col-sm-offset-4 col-sm-4">
    {people.map((person, i) =>
      <a key={i} href={`#/chat/${i}`}>
        <div className="row">
          <div className="col-xs-3">
            <img className="thumbnail" src="default.png" style={{width: 50, height: 50}} />
          </div>
          <div className="col-xs-9">
            <h5 className="col-xs-4">Name: {person.name}</h5>
            <h5 className="col-xs-4">Speaks: {person.speaks}</h5>
            <h5 className="col-xs-4">Learning: {person.learning}</h5>
          </div>
        </div>
      </a>
    )}
  </div>

People.propTypes = {
  people: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    speaks: PropTypes.string.isRequired,
    learning: PropTypes.string.isRequired
  })).isRequired
}

export default People
