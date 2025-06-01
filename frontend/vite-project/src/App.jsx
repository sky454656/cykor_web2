import {useState} from 'react';

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
            props.onSelect(t.id);
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
  const [topics, setTopics] = useState([
    {id:1, title:'html', body:'html is ...'},
    {id:2, title:'css', body:'css is ...'},
    {id:3, title:'javascript', body:'javascript is ...'}
  ]);
  const [nextId, setNextId] = useState(4);

  const [id, setId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const selectedTopic = topics.find(t => t.id === selectedId);

  let content = null;
  let contextControl = null;

  if (mode === 'HOME')
    content = <Article title="home" body="tmp home"></Article>
  else if(mode === 'LIST'){
    content = <Print_title topics={topics} onSelect={(id) => {
      setSelectedId(id);
      setMode('READ')
    }}></Print_title>;
  } else if (mode === 'READ'){
    if (selectedTopic) {
      content = <>
      <Print_title topics={topics} onSelect={(id) => {
        setSelectedId(id);
        }}></Print_title>
       <Article title={selectedTopic.title} body={selectedTopic.body}></Article>
      </>
      contextControl = <>
      <p><a href ={'edit'+selectedId} onClick={(event)=>{
        event.preventDefault();
        setMode('EDIT');
      }}>edit</a></p>
      <p><input type ="button" value = "Delete" onClick={()=>{
        const newTopics = []
         for(let i=0; i<topics.length; i++){
          if(topics[i].id !== selectedId){
            newTopics.push(topics[i]);
          }
        }
        setTopics(newTopics);
        setMode('HOME');
      }}></input>
      </p>
      </>
      } else {
      content = <Article title="Not Found" body="해당 글이 없습니다."></Article>;
    }
  } else if (mode === 'CREATE'){
      content = <Create onCreate={(_title, _body)=>{
        const newTopic = {id:nextId, title:_title, body:_body}
        const newTopics = [...topics]
        newTopics.push(newTopic);
        setTopics(newTopics);
        setMode('HOME');
        setId(nextId);
        setNextId(nextId+1);
    }}></Create>
  } else if (mode === 'EDIT'){
    let title, body = null;
    const topic = topics.find(t => t.id === selectedId)
    title = topic.title;
    body = topic.body;

    content = <Edit title = {title} body = {body} onUpdate={(title, body)=>{
      const newTopics = [...topics];
      const editTopics = {id: selectedId, title:title, body:body}
      for(let i=0; i<newTopics.length; i++){
        if(newTopics[i].id === selectedId){
          newTopics[i] = editTopics;
          break;
        }
      }
      setTopics(newTopics);
      setMode('LIST');
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