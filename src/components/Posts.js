import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import Post from "./Post";

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

export default function Posts() {
  const [posts, setPosts] = useState();

  useEffect(() => {
    (async () => {
      const response = await fetch(BASE_API_URL + '/api/feed');
      if (response.ok) {
        const results = await response.json();
        setPosts(results.data);
      }
      else {
        setPosts(null);
      }
    })();
  // A simple rule to remember, is that when this argument is set to an empty array, the side effect function runs once when the component is first rendered and never again.
  // A common mistake is to forget to include the second argument. This is interpreted by React as instructions to run the side effect function every single time the component renders, which is rarely necessary.
  }, []);

  return (
    <>
      {posts === undefined ?
        <Spinner animation="border"/>
      :
        <>
          {posts === null ?
            <p>Failed to load posts</p>
          :
            <>
              {/* Something to remember when refactoring loops is that the required key attribute must always be in the source file that has the loop. React will not see it if it is moved into the child component. */}
              {posts.map(post => <Post key={post.id} post={post} />
              )}
            </>
          }
        </>
      }
    </>
  );
}