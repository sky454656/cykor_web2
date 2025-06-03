import {useState, useEffect} from 'react';
import axios from "axios";

function Home(props){
  return   <div><a href="/" onClick={(event)=>{
      event.preventDefault();
      props.onChangeMode();
    }}>{props.title}</a>
    </div>
}

function Create(props){
  return <article>
    <h2>Create</h2>
    <form onSubmit={(event)=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onCreate(title, body);
    }}>
      <p><input type ="text" name="title" placeholder="title"></input></p>
      <p><textarea name="body" placeholder="body"></textarea></p>
      <p><input type="submit" value="create"></input></p>
    </form>
      </article>
}
 
function List(props){
  return <div>
        <a href = "/" onClick={(event)=>{
          event.preventDefault();
          props.onChangeMode();
        }}>list</a>
      </div>
}

function Article(props){
  return <article>
    <h2>{props.title}</h2>
    {props.body}
  </article>
}

function Print_title(props){
  return <article>
    <h2>list</h2>
     <ol>
        {props.topics.map(t => (
          <li><a href ="/" onClick = {(event)=>{
            event.preventDefault();
            props.onSelect(t._id);
          }}>{t.title}</a></li>
        ))}
      </ol>
  </article>
}

function Edit(props){
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);

  return <article>
    <h2>Edit</h2>
    <form onSubmit={event=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onUpdate(title, body);
    }}>
      <p><input type ="text" name="title" placeholder="title" value={title} 
      onChange={(event)=>{
        setTitle(event.target.value);
      }}></input></p>
      <p><textarea name="body" placeholder="body" value={body}
      onChange={(event)=>{
        setBody(event.target.value);
      }}></textarea></p>
      <p><input type="submit" value="Edit"></input></p>
    </form> 
  </article>
}


function App() {
  const [mode, setMode] = useState('HOME');
  const [topics, setTopics] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [logIn, setLogIn] = useState(false);
  const [user, setUser] = useState(null);


  const selectedTopic = topics.find(t => t._id === selectedId);

  useEffect(() => {
    axios.get('http://localhost:5001/api/posts')
      .then((res) => setTopics(res.data))
      .catch((err) => console.error('fail', err));
  }, []);


  



  let content = null;
  let contextControl = null;

  if (mode === 'HOME')
    content = <Article title="home" body="tmp home"></Article>
  else if(mode === 'LIST'){
    content = <Print_title topics={topics} onSelect={(_id) => {
      setSelectedId(_id);
      setMode('READ')
    }}></Print_title>;
  } else if (mode === 'READ'){
    if (selectedTopic) {
      content = <>
      <Print_title topics={topics} onSelect={(_id) => {
        setSelectedId(_id);
        }}></Print_title>
       <Article title={selectedTopic.title} body={selectedTopic.body}></Article>
      </>
      contextControl = <>
      <p><a href ={'edit'+selectedId} onClick={(event)=>{
        event.preventDefault();
        setMode('EDIT');
      }}>edit</a></p>
      <p><input type ="button" value = "Delete" onClick={()=>{
         axios.delete(`http://localhost:5001/api/posts/${selectedId}`)
            .then(() => {
              setTopics(topics.filter(t => t._id !== selectedId));
              setMode('HOME');
            })
            .catch((err) => console.error('삭제 실패:', err));
      }}></input></p>
      </>
      } else {
      content = <Article title="Not Found" body="해당 글이 없습니다."></Article>;
    }
  } else if (mode === 'CREATE'){
      content = <Create onCreate={(title, body)=>{
        axios.post('http://localhost:5001/api/posts', {
        title,
        body,
        author: 'tmp'
      }).then(res => {
        setTopics(prev => [...prev, res.data]);
        setMode('HOME');
        setSelectedId(res.data._id);
      }).catch(err => console.error('생성 실패:', err));
    }}></Create>
  } else if (mode === 'EDIT'){
    if (!selectedTopic)
      return null;
    content = <Edit title = {selectedTopic.title} body = {selectedTopic.body} onUpdate={(title, body)=>{
      axios.put(`http://localhost:5001/api/posts/${selectedId}`, { title, body })
      .then((res) => {
        const updated = res.data;
        const newTopics = topics.map(t =>{
          if (t._id === selectedId)
            return updated;
          else
            return t;
        });
        setTopics(newTopics);
        setMode('LIST');
      }).catch(err => console.error('수정 실패:', err));
    }}></Edit>
  }



  return (
    <div>
      <Home title="home" author="tmp" onChangeMode={()=>{
        setMode('HOME');
      }}></Home>
      <div>
        <a href = "/create" onClick={(event)=>{
          event.preventDefault();
          setMode('CREATE');
        }}>Create</a>
      </div>
      <List onChangeMode={()=>{
        setMode('LIST');
      }}></List>
      {content}
      {contextControl}
    </div>
)};


export default App;