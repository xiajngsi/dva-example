// import { Router } from 'dva/router'
// // import { Router, Route } from 'dva/router'
// import IndexPage from './routes/IndexPage'
// // import OverView from './overview'
// // import Console from './console'
// // import Layout from './index/layout'

// export default function ({ browserHistory, app }) {
//   const routes = [
//     {
//       path: '/',
//       component: IndexPage,
//     },
//   ]
//   return <Router history={browserHistory} routes={routes} />
// }

import React from 'react'
import { Router, Route } from 'dva/router'
import IndexPage from './routes/IndexPage'

const RouterConfig = ({ history }) => {
  return (
    <Router history={history}>
      <Route path='/' component={IndexPage} />
    </Router>
  )
}

export default RouterConfig
