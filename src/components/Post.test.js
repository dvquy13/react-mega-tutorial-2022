import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Post from './Post';

test('it renders all the components of the post', () => {
  const timestampUTC = '2020-01-01T00:00:00.000Z';
  const post = {
    text: 'hello',
    author: {username: 'susan', avatar_url: 'https://example.com/avatar/susan'},
    timestamp: timestampUTC,
  };

  // In the render section, an instance of the Post component
  // receiving the fake blog post is rendered.
  // Because the Post component renders a link that navigates
  // to the author's page, it is necessary to have the support
  // of React Router, so instead of rendering the Post component
  // alone, it is wrapped in a BrowserRouter component.
  // When rendering isolated components, it is often necessary to create a
  // minimal environment that is similar to that of the real application.
  // In this case, the component needed routing support, so a router
  // component was added.
  // In other cases a component might need to have access to a specific
  // context, to the corresponding provider component must be included in
  // the render.
  // A good approach to render the smallest possible tree is to start by
  // rendering the target component and look at the errors the render produces
  // to determine what wrapper components are needed.
  render(
    <BrowserRouter>
      <Post post={post} />
    </BrowserRouter>
  );

  const message = screen.getByText('hello');
  const authorLink = screen.getByText('susan');
  const avatar = screen.getByAltText('susan');
  const timestamp = screen.getByText(/.* ago$/);

  expect(message).toBeInTheDocument();
  expect(authorLink).toBeInTheDocument();
  expect(authorLink).toHaveAttribute('href', '/user/susan');
  expect(avatar).toBeInTheDocument();
  expect(avatar).toHaveAttribute('src', 'https://example.com/avatar/susan&s=48');
  expect(timestamp).toBeInTheDocument();
  expect(timestamp).toHaveAttribute(
    'title', new Date(Date.parse(timestampUTC)).toString());
});