/* eslint-disable camelcase */
import { Browser } from '@capacitor/browser'
import { Oauth2Scheme } from '~auth/runtime'

/**
 * Custom Oauth2 Login scheme with capacitor/browser usage istead of window.location.replace
 * the rest is a copy of Oauth2Scheme
 */

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
function randomString(length) {
  let result = ''
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

function encodeQuery(queryObject) {
  return Object.entries(queryObject)
    .filter(([_key, value]) => typeof value !== 'undefined')
    .map(([key, value]) => encodeURIComponent(key) + (value != null ? '=' + encodeURIComponent(value) : ''))
    .join('&')
}

export default class CustomOauth2Scheme extends Oauth2Scheme {
  async login(_opts = {}) {
    const opts = {
      protocol: 'oauth2',
      response_type: this.options.responseType,
      access_type: this.options.accessType,
      client_id: this.options.clientId,
      redirect_uri: this.redirectURI,
      scope: this.scope,
      state: _opts.state || randomString(10),
      code_challenge_method: this.options.codeChallengeMethod,
      ..._opts.params,
    }
    if (this.options.audience) {
      opts.audience = this.options.audience
    }
    if (opts.response_type.includes('token') || opts.response_type.includes('id_token')) {
      opts.nonce = _opts.nonce || randomString(10)
    }
    if (opts.code_challenge_method) {
      switch (opts.code_challenge_method) {
        case 'plain':
        case 'S256':
          {
            const state = this.generateRandomString()
            this.$auth.$storage.setUniversal(this.name + '.pkce_state', state)
            const codeVerifier = this.generateRandomString()
            this.$auth.$storage.setUniversal(this.name + '.pkce_code_verifier', codeVerifier)
            const codeChallenge = await this.pkceChallengeFromVerifier(
              codeVerifier,
              opts.code_challenge_method === 'S256'
            )
            opts.code_challenge = window.encodeURIComponent(codeChallenge)
          }
          break
      }
    }
    if (this.options.responseMode) {
      opts.response_mode = this.options.responseMode
    }
    if (this.options.acrValues) {
      opts.acr_values = this.options.acrValues
    }
    this.$auth.$storage.setUniversal(this.name + '.state', opts.state)
    const url = this.options.endpoints.authorization + '?' + encodeQuery(opts)
    Browser.open({ url, windowName: '_self' })
  }

  logout() {
    if (this.options.endpoints.logout) {
      const opts = {
        client_id: this.options.clientId + '',
        logout_uri: this.logoutRedirectURI,
      }
      const url = this.options.endpoints.logout + '?' + encodeQuery(opts)

    
    Browser.addListener('browserPageLoaded', () => {
      Browser.close()
      Browser.removeAllListeners()
    })
    Browser.open({ url, windowName: '_self' })
  }
    return this.$auth.reset()
  }
}
