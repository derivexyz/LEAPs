import React from 'react'
import { graphql } from 'gatsby'
import { sortBy, filter, flow } from 'lodash/fp'
import { Helmet } from 'react-helmet'

import statuses from '../../ci/statuses'
import { AllLeapsQuery } from '../../types/gql'
import Main from '../layout/Main'
import { StatusTable } from '../components/StatusTable'
import { StatusLabel } from '../components/StatusLabel'

interface Props {
  data: AllLeapsQuery
}

const Template: React.FC<Props> = ({ data: { allMarkdownRemark } }) => {
  const { group } = allMarkdownRemark
  const columns = flow(
    filter(({ fieldValue }) => statuses.indexOf(fieldValue) > -1),
    sortBy(({ fieldValue }) => statuses.indexOf(fieldValue)),
  )(group) as AllLeapsQuery['allMarkdownRemark']['group']

  return (
    <Main>
      <Helmet title="All LEAPs" />
      <header className="post-header">
        <h1 className="post-title">All LEAPs</h1>
      </header>
      <div className="post-content">
        {columns.map((g) => {
          const rows = sortBy('frontmatter.leap')(g.nodes)
          return (
            <div key={g.fieldValue}>
              <StatusLabel label={g.fieldValue} />
              <StatusTable rows={rows as any} />
            </div>
          )
        })}
      </div>
    </Main>
  )
}

export default Template

export const pageQuery = graphql`
  query allLeaps {
    allMarkdownRemark(
      filter: {
        fileAbsolutePath: { regex: "/leaps/" }
        frontmatter: { leap: { ne: null } }
      }
    ) {
      group(field: frontmatter___status) {
        fieldValue
        nodes {
          id
          frontmatter {
            ...Frontmatter
          }
        }
      }
    }
  }
`
