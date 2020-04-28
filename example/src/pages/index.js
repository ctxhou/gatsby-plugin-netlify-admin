import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <h3><Link to="/admin/">Go to admin dashboard</Link></h3>
  </Layout>
)

export default IndexPage
