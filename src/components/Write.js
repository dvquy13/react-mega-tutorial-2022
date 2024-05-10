import { useState, useEffect, useRef } from 'react';
import Stack from "react-bootstrap/Stack";
import Image from "react-bootstrap/Image";
import Form from 'react-bootstrap/Form';
import InputField from './InputField';
import { useApi } from '../contexts/ApiProvider';
import { useUser } from '../contexts/UserProvider';

// About the showPost prop:
// When a user writes a blog post, the application needs to immediately add
// the post to the feed at the top position. Since this component does not
// know anything about modifying the displayed feed, it accepts a callback
// function provided by the parent component to perform this action. As far as
// the Write component is concerned, all that needs to be done after
// successfully creating a blog post is to call the function passed in
// showPost with the new post object (which Microblog API returns in the body
// of the response) as an argument.
export default function Write({ showPost }) {
  const [formErrors, setFormErrors] = useState({});
  const textField = useRef();
  const api = useApi();
  const { user } = useUser();

  useEffect(() => {
    textField.current.focus();
  }, []);

  const onSubmit = async (ev) => {
    ev.preventDefault();
    const response = await api.post("/posts", {
      text: textField.current.value
    });
    if (response.ok) {
      showPost(response.body);
      textField.current.value = '';
    }
    else {
      if (response.body.errors) {
        setFormErrors(response.body.errors.json);
      }
    }
  };

  return (
    <Stack direction="horizontal" gap={3} className="Write">
      <Image
        src={ user.avatar_url + '&s=48' }
        roundedCircle
      />
      <Form onSubmit={onSubmit}>
        <InputField
          name="text" placeholder="What's on your mind?"
          error={formErrors.text} fieldRef={textField} />
      </Form>
    </Stack>
  );
}
