import { useContext } from 'react';
import Alert from 'react-bootstrap/Alert';
import Collapse from 'react-bootstrap/Collapse';
import { FlashContext } from '../contexts/FlashProvider';

export default function FlashMessage() {
  const { flashMessage, visible, hideFlash } = useContext(FlashContext);

  return (
    // This component takes advantage of both the Alert component of React-Bootstrap and Collapse, which adds a nice
    // sliding animation when the alert is shown or hidden. The in prop of Collapse determines if the components
    // needs to be shown or hidden, so it is directly assigned the value of the visible state variable that was
    // obtained from the flash context.
    <Collapse in={visible}>
      <div>
        <Alert variant={flashMessage.type || 'info'} dismissible
          onClose={hideFlash}>
          {flashMessage.message}
        </Alert>
      </div>
    </Collapse>
  );
}