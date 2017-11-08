import agent from '../utils/request'

export function login(query) {
  console.log('query', query)
  return agent.get('api/login')
    .query({ ...query })
    .then(response => response.body)
}
