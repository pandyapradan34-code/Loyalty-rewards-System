import { createContext, useContext, useState } from 'react'

// Keeps track of who is logged in (customer and/or factory owner).
// Saved in localStorage so a page refresh doesn't log you out.
// When the real backend exists, we'll also store the JWT token here.

const AuthContext = createContext(null)

function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key))
  } catch {
    return null
  }
}

function write(key, value) {
  try {
    if (value) localStorage.setItem(key, JSON.stringify(value))
    else localStorage.removeItem(key)
  } catch {
    /* storage unavailable */
  }
}

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(() => read('auth_customer'))
  const [admin, setAdmin] = useState(() => read('auth_admin'))

  const value = {
    customer,
    admin,
    loginCustomer: (user) => {
      write('auth_customer', user)
      setCustomer(user)
    },
    logoutCustomer: () => {
      write('auth_customer', null)
      setCustomer(null)
    },
    loginAdmin: (user) => {
      write('auth_admin', user)
      setAdmin(user)
    },
    logoutAdmin: () => {
      write('auth_admin', null)
      setAdmin(null)
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
