import dva from 'dva'
import regeneratorRuntime from 'regenerator-runtime'
import createLoading from 'dva-loading'
import RouterConfig from './router'
import './index.css'

window.regeneratorRuntime = regeneratorRuntime
// 1. Initialize
const app = dva()

// 2. Plugins
// app.use({});
app.use(createLoading({ namespace: 'isFetching', effects: true }))

// 3. Model
// require('./models').default.forEach((model) => {
//   app.model(model)
// })
// console.log('xjs', require('./models/example.jsx'))
app.model(require('./models/example.jsx').default)

// 4. Router
app.router(RouterConfig)
// app.router(() => <Router />)


// 5. Start
app.start('#root')
