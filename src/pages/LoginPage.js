import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef, useContext } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Body from '../components/Body';
import InputField from '../components/InputField';
import { useUser } from '../contexts/UserProvider';
import { useFlash, FlashContext } from '../contexts/FlashProvider';

export default function LoginPage() {
  const [formErrors, setFormErrors] = useState({});
  const usernameField = useRef();
  const passwordField = useRef();
  const { login } = useUser();
  const flash = useFlash();
  const { hideFlash } = useContext(FlashContext);
  // This hook is from React-Router, and provides access to a navigate() function that is similar to the Navigate component, but in function form.
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    usernameField.current.focus();
  }, []);

  const onSubmit = async (ev) => {
    ev.preventDefault();
    const username = usernameField.current.value;
    const password = passwordField.current.value;

    const errors = {};
    if (!username) {
      errors.username = 'Username must not be empty.';
    }
    if (!password) {
      errors.password = 'Password must not be empty.';
    }
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    const result = await login(username, password);
    if (result === 'fail') {
      flash('Invalid username or password', 'danger');
    }
    else if (result === 'ok') {
      let next = '/';
      if (location.state && location.state.next) {
        next = location.state.next;
      }
      // Hide flash here to remove the invalid username/password message that hangs around if user failed previous attempts
      hideFlash();
      navigate(next);
    }

  };

  return (
    <Body>
      <h1>Login</h1>
      <Form onSubmit={onSubmit}>
        <InputField
          name="username" label="Username or email address"
          error={formErrors.username} fieldRef={usernameField} />
        <InputField
          name="password" label="Password" type="password"
          error={formErrors.password} fieldRef={passwordField} />
        <Button variant="primary" type="submit">Login</Button>
      </Form>
      <hr />
      <p>Don&apos;t have an account? <Link to="/register">Register here</Link>!</p>
      <p>Forgot your password? You can <Link to="/reset-request">reset it</Link>.</p>
    </Body>
  );
}
