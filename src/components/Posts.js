import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import Post from "./Post";
import More from "./More";
import { useApi } from "../contexts/ApiProvider";

export default function Posts({ content }) {
  const [posts, setPosts] = useState();
  const [pagination, setPagination] = useState();
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
        setPagination(results.body.pagination)
      }
      else {
        setPosts(null);
      }
    })();
  // A simple rule to remember, is that when this argument is set to an empty array, the side effect function runs once when the component is first rendered and never again.
  // A common mistake is to forget to include the second argument. This is interpreted by React as instructions to run the side effect function every single time the component renders, which is rarely necessary.
  }, [api, url]);

  const loadNextPage = async () => {
    const response = await api.get(url, {
      after: posts[posts.length - 1].timestamp
    });
    if (response.ok) {
      setPosts([...posts, ...response.body.data]);
      setPagination(response.body.pagination);
    }
  };

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
              {posts.length === 0 ?
                <p>There are no blog posts.</p>
              :
                posts.map(post => <Post key={post.id} post={post} />)
              }
              <More pagination={pagination} loadNextPage={loadNextPage} />
            </>
          }
        </>
      }
    </>
  );
}