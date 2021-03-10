import { useState } from 'react';

function App() {
  const [posts, setPosts] = useState(null)
  const [query, setQuery] = useState('')


  const handleChange = (event) => {
    setQuery(event.target.value)
  }



  const handleClick = () => {
    
      fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({query: `{ post(id: ${query}) { id body } }`})
      }).then(data => data.json())
        .then(({data}) => setPosts(data.post))
        .catch(error => console.log)
   
  }
  return (
    <div className="App">
      <input type='text' onChange={handleChange} value={query}/>
      <button onClick={handleClick} >Click Here</button>
      {posts && <h4 key={posts.id}>{posts.body}</h4>}
    </div>
  );
}

export default App;
