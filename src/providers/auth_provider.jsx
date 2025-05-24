import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import {
  firebaseDeleteUserAuth,
  firebaseFetchUser,
  firebaseLogin,
  firebaseLoginGoogle,
  firebaseLogout,
  firebaseSignup,
} from '../firebase/api/auth'
import { auth } from '../firebase/config'
import { useNotify } from './notifcation_provider'

const AuthContext = createContext({
  currentUser: null,
  isAdmin: false,
  isSuperAdmin: false,
  isBlocked: false,
  loading: false,
  signup: async () => {},
  login: async () => {},
  loginWithGoogle: async () => {},
  logout: async () => {},
})

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const { notify } = useNotify()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const fetchedUser = await firebaseFetchUser(user.uid)
          setCurrentUser({ ...user, ...fetchedUser })
        } else {
          setCurrentUser(null)
        }
      } catch (error) {
        notify('error', 'Error', error?.message ?? 'There was an error with your request')
      }
      setLoading(false)
    })

    return unsubscribe
  }, [notify])

  const wrapAction = async (actionCallback) => {
    setLoading(true)
    try {
      await actionCallback()
    } catch (error) {
      notify('error', 'Error', error?.message ?? 'There was an error with your request')
    }

    setLoading(false)
  }

  const signup = async (user) => wrapAction(() => firebaseSignup(user))
  const logout = async () => wrapAction(() => firebaseLogout())
  const loginWithGoogle = async () => wrapAction(async () => firebaseLoginGoogle().then((user) => setCurrentUser(user)))

  // Since this is a frontend only app, we can't use firebase-admin to delete the user... instead, we delete it from our own db
  // then wait until they login again. If there is no user, it's been deleted so we can then delete the 'currentUser' auth account
  const login = async (email, password) => {
    setLoading(true)
    const user = await firebaseLogin(email, password)
    const dbUser = await firebaseFetchUser(user.uid)

    if (!dbUser) {
      await firebaseDeleteUserAuth()
      notify('info', 'Account No Longer Exists', 'Your account has been deleted by an admin')
      setCurrentUser(null)
    } else {
      setCurrentUser({ ...user, ...dbUser })
    }

    setLoading(false)
  }

  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'super_admin'
  const isSuperAdmin = currentUser?.role === 'super_admin'
  const isBlocked = currentUser?.role === 'blocked'

  const value = { currentUser, signup, login, loginWithGoogle, logout, loading, isAdmin, isSuperAdmin, isBlocked }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
