import { h } from 'preact'
import {errors} from '../strings/errors'
import theme from '../Theme/style.css'
import style from './style.css'

const Error = ({error, renderAction, i18n}) => {
  const errorList = errors(i18n)
  const errorText = errorList[error.name]
  const errorType = error.type === 'error' ? 'error' : 'warning'
  return (
    <div className={style[`container-${errorType}`]}>
      <div className={style.title}>
        <span className={style[`title-icon-${errorType}`]}/>
        <span className={style['title-text']}>{errorText.message}</span>
      </div>
      <p className={style.instruction}>
        {errorText.instruction}
      </p>
      {
        renderAction ?
          <div className={theme.actions}>
          {renderAction()}
          </div> :
          null
      }
    </div>
  )
}

export default Error
 