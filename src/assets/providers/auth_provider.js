import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from './firebaseConfig'

const AuthContext = createContext({
  currentUser: null,
  signup: () => {},
  login: () => {},
  loginWithGoogle: () => {},
  logout: () => {},
  loading: false,
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
    })
    return unsubscribe
  }, [])

  const signup = async (email, password) => {
    setLoading(true)
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  const login = async (email, password) => {
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  const loginWithGoogle = async () => {
    setLoading(true)
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  const logout = async () => {
    setLoading(true)
    try {
      await signOut(auth)
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  const value = {
    currentUser,
    signup,
    login,
    loginWithGoogle,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
