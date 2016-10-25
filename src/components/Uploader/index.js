import { h, Component } from 'preact'
import Dropzone from 'react-dropzone'
import loadImage from 'blueimp-load-image/js/load-image'
import { DocumentNotFound } from '../Document'
import Spinner from '../Spinner'
import Confirm from '../Confirm'
import theme from '../Theme/style.css'
import style from './style.css'
import {functionalSwitch, impurify} from '../utils'

//ref: http://stackoverflow.com/a/27232658/689223
const isWebP = (base64) => base64.indexOf('data:image/webp') === 0

export const canvasToBase64Images = (canvas, callback) => {
  let imageLossy = canvas.toDataURL('image/webp')
  let imagePng
  //not all browsers support webp
  if (isWebP(imageLossy)){
    imagePng = canvas.toDataURL()
  } else {
    imagePng = imageLossy//if webp is not supported it defaults to png
    imageLossy = canvas.toDataURL("image/jpeg")
  }

  callback(imageLossy, imagePng)
}

export const fileToBase64 = (file, callback, errorCallback) => {
  const options = {
    maxWidth: 960,
    maxHeight: 960,
    canvas: true
  }

  errorCallback = errorCallback || callback

  loadImage(file.preview, canvasOrEventError => {
    if (canvasOrEventError.type === "error") errorCallback(canvasOrEventError)
    else canvasToBase64Images(canvasOrEventError, callback)
  }, options)
}

const UploadInstructions = () =>
  <div className={style.base}>
    <span className={`${theme.icon} ${style.icon}`}></span>
    <p className={style.text}>Take a photo with your camera or upload one from your library.</p>
  </div>

const UploadProcessing = () =>
  <div className={theme.center}>
    <Spinner />
    <div className={style.processing}>Processing your document</div>
  </div>

export const UploadError = ({children}) =>
  <div className={`${style.text} ${style.error}`}>{children}</div>

const InvalidCaptureError = ({method}) => functionalSwitch(method, {
  document: () => <DocumentNotFound />
})

const InvalidFileType = () =>
  <UploadError>The file uploaded has an unsupported file type.</UploadError>

//TODO move to react instead of preact, since preact has issues handling pure components
//IF this component is exported as pure,
//some components like Camera will not have componentWillUnmount called
export const Uploader = impurify(({method, onImageSelected, uploading, error}) => (
  <Dropzone
    onDrop={([ file ])=> onImageSelected(file)}
    multiple={false}
    className={style.dropzone}
  >
    {uploading ? <UploadProcessing /> : <UploadInstructions />}
    {!uploading && functionalSwitch(error, {
      INVALID_CAPTURE: ()=> <InvalidCaptureError {...{method}}/>,
      INVALID_TYPE: ()=>    <InvalidFileType />
    })}
  </Dropzone>
))