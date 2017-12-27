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
import { Router, Route, Switch } from 'dva/router'
import dynamic from 'dva/dynamic'

const RouterConfig = ({ history, app }) => {
  const IndexPage = dynamic({
  	app,
    component: import('./routes/IndexPage'),
  })
  return (
    <Router history={history}>
      <Switch>
        <Route exact path='/' component={IndexPage} />
      </Switch>
    </Router>
  )
}

export default RouterConfig
