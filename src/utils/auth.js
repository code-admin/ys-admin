import Cookies from 'js-cookie'

const TokenKey = 'YS-USER-TOKEN-ID'
const orgId = 'ORG_ID'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}

export function getOrgId () {
  return Cookies.get(orgId)
}

export function setOrgId (id) {
  return Cookies.set(orgId, id)
}
