import Body from '../components/Body';
import Posts from '../components/Posts';

export default function ExplorePage() {
  return (
    <Body sidebar>
      <h1>Explore</h1>
      <hr />
      <Posts content="explore" />
    </Body>
  );
}