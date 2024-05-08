import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import Post from "./Post";
import { useApi } from "../contexts/ApiProvider";

export default function Posts({ content }) {
  const [posts, setPosts] = useState();
  const api = useApi();

  let url;
  switch (content) {
    case 'feed':
    case undefined:
      url = '/feed';
      break;
    case 'explore':
      url = '/posts';
      break
    default:
      url = `/users/${content}/posts`;
      break;
  }

  useEffect(() => {
    (async () => {
      const results = await api.get(url);
      if (results.ok) {
        setPosts(results.body.data);
      }
      else {
        setPosts(null);
      }
    })();
  // A simple rule to remember, is that when this argument is set to an empty array, the side effect function runs once when the component is first rendered and never again.
  // A common mistake is to forget to include the second argument. This is interpreted by React as instructions to run the side effect function every single time the component renders, which is rarely necessary.
  }, [api, url]);

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