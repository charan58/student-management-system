import {useRouteError} from 'react-router-dom';
function ErrorElement() {
  return (
    <div>
      <h1>{useRouteError}</h1>
    </div>
  )
}

export default ErrorElement;