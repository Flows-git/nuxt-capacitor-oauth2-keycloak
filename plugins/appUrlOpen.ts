import { App, URLOpenListenerEvent } from '@capacitor/app'
import { Browser } from '@capacitor/browser'
import { Plugin } from '@nuxt/types'

// This enables Universal Links into the App
const appUrlOpen: Plugin = () => {
  App.addListener('appUrlOpen', function (event: URLOpenListenerEvent) {
    const slug = event.url.split('example-app://').pop()

    // We only set the route if there is a slug present
    if (slug) {
      window.location.replace(slug)
      // Close the InApp browser if open
      Browser.close()
    }
  })
}

export default appUrlOpen
