import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import {
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
  const login = async (email, password) => wrapAction(() => firebaseLogin(email, password))
  const loginWithGoogle = async () => wrapAction(() => firebaseLoginGoogle())
  const logout = async () => wrapAction(() => firebaseLogout())

  const isAdmin = currentUser?.role === 'admin'
  const isBlocked = currentUser?.role === 'blocked'

  const value = { currentUser, signup, login, loginWithGoogle, logout, loading, isAdmin, isBlocked }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
