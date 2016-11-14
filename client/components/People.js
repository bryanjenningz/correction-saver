import React, {Component} from 'react'

export default class People extends Component {
  render() {
    const people = this.props.people
    return (
      <div className="col-sm-offset-4 col-sm-4">
        {[1, 2, 3, 4].map((person, i) =>
          <div key={i} className="row">
            <div className="col-xs-3">
              <img className="thumbnail" src="default.png" style={{width: 50, height: 50}} />
            </div>
            <div className="col-xs-9">
              <h5 className="col-xs-4">Name</h5>
              <h5 className="col-xs-4">Speaks</h5>
              <h5 className="col-xs-4">Learning</h5>
            </div>
          </div>
        )}
      </div>
    )
  }
}
