import { render, screen } from '@testing-library/react';
import { act, useEffect } from 'react';
import FlashProvider from './FlashProvider';
import { useFlash } from './FlashProvider';
import FlashMessage from '../components/FlashMessage';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

test('flashes a message', () => {
  const Test = () => {
    const flash = useFlash();
    useEffect(() => {
      flash('foo', 'danger');
    }, []);
    return null;
  };

  // Wrap the `render` in `act`
  render(
    <FlashProvider>
      <FlashMessage />
      <Test />
    </FlashProvider>
  );

  const alert = screen.getByRole('alert');

  expect(alert).toHaveTextContent('foo');
  expect(alert).toHaveClass('alert-danger');
  expect(alert).toHaveAttribute('data-visible', 'true');

  // As a result of the timer firing, some state variables in React will change,
  // and that will require some re-renders, which in turn might launch new
  // side effect functions that might require even more renders. The render()
  // function is designed to wait for this asynchronous activity until all
  // state variables, side effects and renders settle, but calling
  // jest.runAllTimers() on its own would not provide the same kind of safety
  // wait. The React Testing Library provides the act() function to perform
  // this type of waiting. Instead of calling jest.runAllTimers() directly, act()
  // is called with a function that performs this action. The act() function will
  // call the function passed as an argument, and then wait for the React
  // application to settle down.
  act(() => jest.runAllTimers());
  expect(alert).toHaveAttribute('data-visible', 'false');
});
