import React from "react"
import {navigate} from 'gatsby';

const Login = props => {
  if (props.netlifyAdminStatus && props.netlifyAdminStatus.isLoggedIn) {
		navigate('/admin');
    return null;
  }
  return (
    <div style={{textAlign: 'center', marginTop: '100px'}}>
      <button style={{fontSize: '100px', lineHeight: '1.2'}} onClick={props.netlifyLogin}>Login</button>
      <pre>
      * Email: jpw41904@bcaoo.com
      * Password: guest
      </pre>
    </div>
  )
}

export default Login
