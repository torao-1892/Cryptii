
import App from './App'

export { App }
export { default as ArrayUtil } from './ArrayUtil'
export { default as Brick } from './Brick'
export { default as BrickFactory } from './Factory/Brick'
export { default as Browser } from './Browser'
export { default as ByteEncoder } from './ByteEncoder'
export { default as ByteEncodingError } from './Error/ByteEncoding'
export { default as Chain } from './Chain'
export { default as Encoder } from './Encoder'
export { default as EventManager } from './EventManager'
export { default as Factory } from './Factory'
export { default as Field } from './Field'
export { default as FieldFactory } from './Factory/Field'
export { default as Form } from './Form'
export { default as GenericError } from './GenericError'
export { default as InvalidInputError } from './Error/InvalidInput'
export { default as LibraryModalView } from './View/Modal/Library'
export { default as MathUtil } from './MathUtil'
export { default as ModalView } from './View/Modal'
export { default as Pipe } from './Pipe'
export { default as Random } from './Random'
export { default as StringUtil } from './StringUtil'
export { default as TextEncoder } from './TextEncoder'
export { default as TextEncodingError } from './Error/TextEncoding'
export { default as View } from './View'
export { default as Viewable } from './Viewable'
export { default as Viewer } from './Viewer'

// Check if we are running in the browser
if (typeof window !== 'undefined') {
  // Check if the init flag is set before initializing the app
  if (document.querySelector('script[data-cryptii-init]') !== null) {
    // Read optional pipe content
    const $pipeData = document.querySelector('script[data-cryptii-pipe]')
    const pipeData = $pipeData !== null ? JSON.parse($pipeData.innerHTML) : null

    // Read optional app config
    const $config = document.querySelector('script[data-cryptii-config]')
    const config = $config !== null ? JSON.parse($config.innerHTML) : {}

    // Configure app and bootstrap it
    const app = new App(config)
    app.run(pipeData)
  }
}
