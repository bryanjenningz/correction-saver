import React from 'react'

const Header = ({children}) =>
  <div>
    <div><a href="#/">Home</a></div>
    <div>{children}</div>
  </div>

export default Header
