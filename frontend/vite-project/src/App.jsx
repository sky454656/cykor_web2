import {useState, useEffect} from 'react';
import axios from "axios";

function Home(props){
  return   <div><a href="/" onClick={(event)=>{
      event.preventDefault();
      props.onChangeMode();
    }}>Home</a>
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

function Register(props){
  return <article>
    <h2>Register</h2>
    <form onSubmit={(event)=>{
      event.preventDefault();
      const username = event.target.username.value;
      const password = event.target.password.value;
      props.onRegister(username, password);
    }}>
      <p><input type ="text" name="username" placeholder="username"></input></p>
      <p><input type="password" name="password" placeholder="password"></input></p>
      <p><input type="submit" value="register"></input></p>
    </form>
      </article>
}

function Login(props){
  return <article>
    <h2>Login</h2>
    <form onSubmit={(event)=>{
      event.preventDefault();
      const username = event.target.username.value;
      const password = event.target.password.value;
      props.onLogin(username, password);
    }}>
      <p><input type ="text" name="username" placeholder="username"></input></p>
      <p><input type="password" name="password" placeholder="password"></input></p>
      <p><input type="submit" value="Login"></input></p>
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

  if (mode === 'HOME'){
    if (user && logIn)
      content = <Article title = "Home" body = {`You are logged in as ${user}`}></Article>
    else
      content = <Article title = "Home" body = "Welcome"></Article>
  }
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
        <p>Created by {selectedTopic.author}</p>
        </>
        if (selectedTopic.author === user){
          contextControl = <>
          <p><a href ={'edit'+ selectedId} onClick={(event)=>{
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
        }
        } else {
        content = <Article title="Not Found" body="해당 글이 없습니다."></Article>;
      }
  } else if (mode === 'CREATE'){
      content = <Create onCreate={(title, body)=>{
        axios.post('http://localhost:5001/api/posts', {
        title,
        body,
        author : user
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
  } else if (mode === 'REGISTER'){
    content = <Register onRegister={(username, password)=>{
        axios.post('http://localhost:5001/api/users/register', {
        username,
        password
      }).then(res => {
        setMode('HOME');
      }).catch(err => {
        if (err.response && err.response.status == 409)
          alert('Username already exists. ');
        else {
          console.error('register error', err);
          alert('register error');
        }
      });
    }}></Register>
  } else if (mode === 'LOGIN'){
    content = <Login onLogin={(username, password)=>{
        axios.post('http://localhost:5001/api/users/login', {
        username,
        password
      }).then(res => {
        setLogIn(true);
        setMode('HOME');
        setUser(res.data.username);
      }).catch(err => {
        if (err.response && err.response.status === 401)
          alert('login failure');
        else {
          console.error('login error', err);
          alert('login error');
        }
      })
    }}></Login>
  }


  if(!logIn){
    return (
      <div>
        <Home onChangeMode={()=>{
          setMode('HOME');
        }}></Home>
        <div>
          <a href = "/" onClick={(event)=>{
          event.preventDefault();
          setMode('REGISTER');
        }}>register</a>
        </div>
        <div>
          <a href = "/" onClick={(event)=>{
            event.preventDefault();
            setMode('LOGIN');
          }}>login</a>
        </div>
        {content}
      </div>
    );
  }else {
  return (
    <div>
      <Home onChangeMode={()=>{
        setMode('HOME');
      }}></Home>
      <div>
        <a href = "/" onClick={(event)=>{
          event.preventDefault();
          setMode('CREATE');
        }}>Create</a>
      </div>
      <List onChangeMode={()=>{
        setMode('LIST');
      }}></List>
       <div>
          <a href = "/" onClick = {(event)=>{
            event.prevenetDefault();
            setMode('HOME');
            setLogIn(false);
          }}>logout</a>
        </div>
      {content}
      {contextControl}
    </div>
  );
}
  return <div>초기화 오류: 모드를 찾을 수 없습니다. 현재 mode = {mode}</div>;
}


export default App;