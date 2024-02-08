import { useState, useEffect } from 'react';
import './App.css';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';


function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [completedTodos, setCompletedTodos] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // Add state to track the index of the item being edited

  const handleAddTodo = () => {
    let newTodoitem = {
      title: newTitle,
      description: newDescription,
    };

    if (newTitle === '' || newDescription === '') {
      alert('Title and Description can\'t be null !!!');
      return;
    };

    let updatedTodoArr = [...allTodos];
    updatedTodoArr.push(newTodoitem);
    setTodos(updatedTodoArr);
    localStorage.setItem('todolist', JSON.stringify(updatedTodoArr));

    setNewTitle('');
    setNewDescription('');
  };

  const handleEditTodo = (index) => { // Add function to handle editing
    setEditIndex(index);
    setNewTitle(allTodos[index].title);
    setNewDescription(allTodos[index].description);
  };

  const handleUpdateTodo = () => { // Add function to handle updating todo item
    let updatedTodos = [...allTodos];
    updatedTodos[editIndex] = { title: newTitle, description: newDescription };
    setTodos(updatedTodos);
    localStorage.setItem('todolist', JSON.stringify(updatedTodos));
    setEditIndex(null); // Clear editIndex after updating

    setNewTitle('');
    setNewDescription('');
  };

  const handleDeleteTodo = (index) => {
    let reducedTodo = [...allTodos];
    reducedTodo.splice(index, 1); // Corrected splice usage

    localStorage.setItem('todolist', JSON.stringify(reducedTodo));
    setTodos(reducedTodo);
  };

  const handleComplete = (index) => {
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yyyy = now.getFullYear();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    let completedOn = dd + '-' + mm + '-' + yyyy + ' at ' + h + ':' + m + ':' + s;

    let filteredItem = {
      ...allTodos[index],
      completedOn: completedOn
    }

    let updatedCompletedArr = [...completedTodos];
    updatedCompletedArr.push(filteredItem);
    setCompletedTodos(updatedCompletedArr);
    handleDeleteTodo(index);
    localStorage.setItem('completedTodos', JSON.stringify(updatedCompletedArr));
  };

  const handleDeleteCompletedTodo = (index) =>{
    let reducedTodo = [...completedTodos];
    reducedTodo.splice(index, 1); // Corrected splice usage

    localStorage.setItem('completedTodos', JSON.stringify(reducedTodo)); // Corrected storage key
    setCompletedTodos(reducedTodo);
  };

  useEffect(() => {
    let savedTodo = JSON.parse(localStorage.getItem('todolist'));
    let savedCompletedTodo = JSON.parse(localStorage.getItem('completedTodos')); // Corrected storage key
    if (savedTodo) {
      setTodos(savedTodo);
    }

    if (savedCompletedTodo){
      setCompletedTodos(savedCompletedTodo);
    }
  }, []);


  return (
    <div className="App">
      <h1>My todo</h1>

      <div className='todo-wrapper'>
        <div className='todo-input'>
          <div className='todo-input-item'>
            <label>Title</label>
            <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="What's the task title?" />
          </div>
          <div className='todo-input-item'>
            <label>Description</label>
            <input type="text" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder="What's the task description?" />
          </div>
          {editIndex !== null ? ( // Render different button based on edit mode
            <div className='todo-input-item'>
              <button type='button' onClick={handleUpdateTodo} className='primaryBtn'>Update</button>
            </div>
          ) : (
            <div className='todo-input-item'>
              <button type='button' onClick={handleAddTodo} className='primaryBtn'>Add</button>
            </div>
          )}
        </div>

        <div className='btn-area'>
          <button className={`secondaryBtn ${!isCompleteScreen && 'active'}`} onClick={() => setIsCompleteScreen(false)}>Todo</button>
          <button className={`secondaryBtn ${isCompleteScreen && 'active'}`} onClick={() => setIsCompleteScreen(true)}>Completed</button>
        </div>

        <div className='todo-list'>
          {!isCompleteScreen && allTodos.map((item, index) => {
            return (
              <div className='todo-list-item' key={index}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <div>
                  <AiOutlineDelete className='icon' onClick={() => handleDeleteTodo(index)} title="Delete?" />
                  <BsCheckLg className='check-icon' onClick={() => handleComplete(index)} title="complete?" />
                  <button className='edit-btn' onClick={() => handleEditTodo(index)}>Edit</button> {/* Add edit button */}
                </div>
              </div>
            )
          })}

          {isCompleteScreen && completedTodos.map((item, index) => {
            return (
              <div className='todo-list-item' key={index}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <p><small>Completed on: {item.completedOn}</small></p>
                </div>
                <div>
                  <AiOutlineDelete className='icon' onClick={() => handleDeleteCompletedTodo(index)} title="Delete?" />
                </div>
              </div>
            )
          })}

        </div>

      </div>
    </div>
  );
}

export default App;
