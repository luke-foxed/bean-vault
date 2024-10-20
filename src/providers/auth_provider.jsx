// In AuthProvider.jsx
import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebaseConfig'
import {
  firebaseFetchUser,
  firebaseLogin,
  firebaseLoginGoogle,
  firebaseLogout,
  firebaseSignup,
} from '../firebase/api'

const AuthContext = createContext({
  currentUser: null,
  signup: async () => {},
  login: async () => {},
  loginWithGoogle: async () => {},
  logout: async () => {},
  loading: false,
})

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch the user's role from Firestore
        const fetchedUser = await firebaseFetchUser(user.uid)
        setCurrentUser({ ...user, role: fetchedUser?.role || 'viewer' })
      } else {
        setCurrentUser(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const wrapAction = async (actionCallback) => {
    setLoading(true)

    const res = await actionCallback()

    if (res?.error) throw res.error

    setLoading(false)
  }

  const signup = async (email, password) => wrapAction(firebaseSignup(email, password))
  const login = async (email, password) => wrapAction(firebaseLogin(email, password))
  const loginWithGoogle = async () => wrapAction(firebaseLoginGoogle())
  const logout = async () => wrapAction(firebaseLogout)

  const value = { currentUser, signup, login, loginWithGoogle, logout, loading }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
