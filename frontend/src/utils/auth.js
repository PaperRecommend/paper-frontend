import Cookies from 'js-cookie'

const TokenKey = 'token'

export function getToken(key) {
  return Cookies.get(key)
}

export function setToken(key,token) {

  return Cookies.set(key, token,{ expires: 1 })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
