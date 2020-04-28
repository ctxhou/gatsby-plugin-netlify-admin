import React from "react"
import { Link } from "gatsby"

import { fakeFriends } from "../utils/data"

const User = ({ id }) => {
  return (
    <>
      <div>Hi I am {fakeFriends[id].name}</div>
      <Link to="/admin">Back</Link>
    </>
  )
}

export default User
