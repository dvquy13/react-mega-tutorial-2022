import { useState, useEffect, useRef } from "react";
import { Spinner } from "react-bootstrap";
import Post from "./Post";
import More from "./More";
import { useApi } from "../contexts/ApiProvider";

export default function Posts({ content }) {
  const [posts, setPosts] = useState();
  const [pagination, setPagination] = useState();
  const [loading, setLoading] = useState(false);
  const api = useApi();
  const moreRef = useRef();

  let url;
  switch (content) {
    case "feed":
    case undefined:
      url = "/feed";
      break;
    case "explore":
      url = "/posts";
      break;
    default:
      url = `/users/${content}/posts`;
      break;
  }

  useEffect(() => {
    (async () => {
      const results = await api.get(url);
      if (results.ok) {
        setPosts(results.body.data);
        setPagination(results.body.pagination);
      } else {
        setPosts(null);
      }
    })();
    // A simple rule to remember, is that when this argument is set to an empty array, the side effect function runs once when the component is first rendered and never again.
    // A common mistake is to forget to include the second argument. This is interpreted by React as instructions to run the side effect function every single time the component renders, which is rarely necessary.
  }, [api, url]);

  const loadNextPage = async () => {
    if (loading || pagination?.offset === undefined) return;
    if (pagination.offset + pagination.count >= pagination.total) return;
    setLoading(true);
    const response = await api.get(url, {
      offset: pagination.offset + pagination.count,
    });
    if (response.ok) {
      setPosts([...posts, ...response.body.data]);
      setPagination(response.body.pagination);
    }
    setLoading(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // console.log(`entries[0].isIntersecting=${entries[0].isIntersecting}`)
        if (entries[0].isIntersecting) {
          loadNextPage();
        }
      },
      { threshold: 1.0 } // Trigger only when the `More` button is fully visible
    );

    if (moreRef.current) {
      observer.observe(moreRef.current);
    }

    return () => {
      if (moreRef.current) {
        observer.unobserve(moreRef.current);
      }
    };
  }, [moreRef.current, posts, pagination]);

  return (
    <>
      {posts === undefined ? (
        <Spinner className="CenterSpinner" animation="border" />
      ) : (
        <>
          {posts === null ? (
            <p>Failed to load posts</p>
          ) : (
            <>
              {posts.length === 0 ? (
                <p>There are no blog posts.</p>
              ) : (
                posts.map((post) => <Post key={post.id} post={post} />)
              )}
              {pagination && posts.length >= pagination.total ? (
                  <p style={{ textAlign: "center", marginTop: "20px", marginBottom: "40px" }}>There are no more blog posts.</p>
                ) : (
                <div ref={moreRef}>
                  {loading ? (
                    <Spinner className="CenterSpinner" animation="border" />
                  ) : (
                    <More pagination={pagination} loadNextPage={loadNextPage} />
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
