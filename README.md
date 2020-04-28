# gatsby-plugin-netlify-admin

Gatsby + [Netlify Intendity](https://docs.netlify.com/visitor-access/identity/) = Static Site with Identification


## Why?

You love Gatsby. You love Netlify. So you host your Gatsby site on Netlify.<br/>
You love static site. You also want your static site has identity feature.

Here is it. Powered your Gatsby site with [Netlify Intendity](https://docs.netlify.com/visitor-access/identity/) without pain.


## Features

* Minimal configuration to set up Netlify Identity
* Protected pages with client side identity validation
* Support client side routing

## Demo

Go to [https://gatsby-plugin-netlify-admin.netlify.app/](https://gatsby-plugin-netlify-admin.netlify.app/)

Login as:
* Email: jpw41904@bcaoo.com
* Password: guest

## How to use

### 0. Enable the Netlify identity feature

Please follow the [Authenticate users with Netlify Identity](https://docs.netlify.com/visitor-access/identity/#enable-identity-in-the-ui) runbook to enable the Netlify identity in your dev site.

Since the plugin is using `netlify-identity-widget` under the hood, in dev environment, please follow

### 1. Install the package

```
yarn add gatsby-plugin-netlify-admin
```

### 2. Create the `admin` folder under `/src`

### 3. Add the plugin to `gatsby-config.js`

**Minimal set up**

```js
{
    resolve: 'gatsby-plugin-netlify-admin',
    options: {
        adminPath: `${__dirname}/src/admin`
    }
}
```

### 4. Add some pages under `/admin` folder

Let's say you'd like to have an index admin page and another login page.

```
.
├── admin
    ├── index.js
    └── login.js
```

**admin/index.js**

```js
import React from 'react';

const Admin = (props) => {
    return <div>Admin</div>
}

export default Admin;
```

**admin/login.js**

```js
import React from "react"

const Login = props => {
  return <button onClick={props.showNetlifyLoginModal}>Login</button>
}

export default Login
```

### 5. Spin up gatsby

```
gatsby develop
```

Assume your page is host under `http://localhost:8000`.

Follow this flow:

```
> Navigate to http://localhost:8000/admin.
> Will be reidrected to http://localhost:8000/login since you've not logged in
> Click `Login` and the Netlify login modal appears. Log in with correct identity
> Navigate to http://localhost:8000/admin
> You can see the admin page
```

### 6. That's it

The setup is simple. The only thing you need to do is creating a folder to host the admin pages and you can reuse the original gatsby usage.

## Usage

### gatsby-config

#### All options

```js
{
    resolve: 'gatsby-plugin-netlify-admin',
    options: {
        adminPath: `${__dirname}/src/admin`,
        adminUri: 'admin',
        loginUri: '/admin/login/',
        excludeUri: ['/admin/signup'],
    }
}
```

| option      | type   | default        | details                                                                                 |
|-------------|--------|----------------|-----------------------------------------------------------------------------------------|
| adminPath*  | string |                | The field is `required`. The folder hosts the admin pages                               |
| adminUri    | string | `admin`          | the root admin URI. It means pages will be host under `/<admin>/...`                    |
| loginUri    | string | `/admin/login`   | This is the default redirection page if users are trying to access the auth first pages |
| excludeUri | Array  | `["/admin/login"]` | Pages are eligble to all users                                                   |

### pages

All pages under the `adminPath` folder will be injected with Netlify login info.

You can directly access and use these props in your component:


| props name         | type     | details                                      |
| ------------------ | -------- | -------------------------------------------- |
| netlifyLogin       | Function | The function triggers Netlify login popup    |
| netlifyLogout      | Function | The function signs out current user          |
| netlifyAdminStatus | Object   | The status of current user. values are: `{user: Object, isLoggedIn: boolean, isModalOpen: boolean, error: string}` |

For example, you can take these props by:

**[`admin/login.js`](https://github.com/ctxhou/gatsby-plugin-netlify-admin/blob/master/example/src/admin/login.js)**

```js
import React from "react"
import {navigate} from 'gatsby';

const Login = props => {
  if (props.netlifyAdminStatus && props.netlifyAdminStatus.isLoggedIn) {
		navigate('/admin');
    return null;
  }
  return (
      <button onClick={props.netlifyLogin}>Login</button>
  )
}

export default Login
```

## More features

### Client side routing

Admin pages usually happen to have client side generated pages. This plugin also makes it easy to configure.

We will utilize the [Gatsby client routing](https://www.gatsbyjs.org/docs/client-only-routes-and-user-authentication/) to do the trick.

Update your `admin/index.js` file:

```js
import React from "react"
import { Router } from "@reach/router"
import UserPage from "../components/UserPage"
const App = () => {
  return (
      <Router>
        <UserPage path="/admin/user/:id" component={UserPage} />
      </Router>
  )
}
```

Then `/admin/user/:id` will be generated by client side routing. Plus, this route will also be protected by identification since `/admin/user/*` is not in `excludeUri`.

---

Example: https://github.com/ctxhou/gatsby-plugin-netlify-admin/blob/master/example

## Reference

* [netlify-identity-widget](https://github.com/netlify/netlify-identity-widget): This plugin uses netlify-identity-widget under the hood