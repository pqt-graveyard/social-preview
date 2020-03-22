import { graphql, StaticQuery } from "gatsby"
import React, { Fragment } from "react"
import { Helmet } from "react-helmet"
import "../../styles/main.css"
import { Footer } from "../Footer/Footer"

const query = graphql`
  query LayoutQuery {
    site {
      siteMetadata {
        title
        description
      }
    }
  }
`

export const Layout = ({ children }) => {
  return (
    <StaticQuery
      query={query}
      render={data => (
        <Fragment>
          <Helmet defaultTitle={data.site.siteMetadata.title} defer={false}>
            <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
          </Helmet>
          <div className="flex flex-col min-h-screen">
            <div className="flex-1">
              <div>{children}</div>
            </div>
            <Footer />
          </div>
        </Fragment>
      )}
    />
  )
}
