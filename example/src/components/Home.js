import React from "react"
import { Link } from "gatsby"
import {fakeFriends} from '../utils/data';

const Home = ({netlifyAdminStatus}) => (
  <main>
    <h1>Admin page</h1>
    <p>
      Hi User <b>{netlifyAdminStatus ? netlifyAdminStatus.user.email : ''}</b>
    </p>
    <p>only you and other login users can see the page!</p>
    <hr />
    <h3>My friends:</h3>
    <ul>
      {fakeFriends.map(item => (
        <li key={item.id}>
          <Link to={`/admin/user/${item.id}`}>{item.name}</Link>
        </li>
      ))}
    </ul>
  </main>
)

export default Home;