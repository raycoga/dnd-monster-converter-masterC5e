 
/* import { SessionData, useDecodeToken } from '../hooks/decodeToken/useDecodeToken' */
import { Navigate, Outlet } from 'react-router-dom'

function NormalRoute(): JSX.Element {
/*   const { dataToken } = useDecodeToken()
  const { uid }: SessionData = dataToken() */
  const unauthenticated = true
  if (unauthenticated) return <Outlet />
  return <Navigate to={'/'} />
}
NormalRoute.displayName = 'NormalRoute'
export default NormalRoute
