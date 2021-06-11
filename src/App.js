import React, { useEffect, useState } from 'react'
import { Icon } from 'semantic-ui-react';
import './App.css';

function App() {
  
  const [movie, setmovie] = useState('');
  const [addmovie, setAddMovie] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('mymovieData'));
    setAddMovie(items)
  }, [])

  useEffect(() => {
    localStorage.setItem('mymovieData', JSON.stringify(addmovie));
  }, [addmovie])

  useEffect(() => {
    const sorting = addmovie.sort((a,b) => a.updateDate < b.updateDate ? 1:-1);
    setSortedData(sorting);
  }, [addmovie])

  const handleChange = (e) => {
    setmovie(e.target.value);
  }

  const handleSubmit = (e) => {
    let date = new Date();
    e.preventDefault();
    if(movie === '') return;
    setAddMovie([...addmovie, {id:Math.floor(Math.random()*1000), movieName:movie, updateDate:date.toLocaleDateString()}])
    // const sortDate = addmovie.sort((a,b) => a.movieName < b.movieName ? 1:-1)
    // setAddMovie(sortDate)
    setmovie('');
  }

  const handleEdit = (ind) =>{
    setIsEdit({[ind]:!isEdit[ind]})
  }

  const handleDelete = (id) => {
    const arrdelete = addmovie.filter((data) => data.id !== id)
    setAddMovie(arrdelete);
  }

  

  const handleEditChange = (e, id ) => {
    const saveData = sortedData.map((data) => {
      if(data.id === id){
        data.movieName = e.target.value
      }
      return data;
    })

    setSortedData(saveData);
  }

  

  return (
    <div>
      <form>
        <div className="main_add_form">
          <textarea value={movie} placeholder="Add your daily task" onChange={handleChange} ></textarea><br />
          <button onClick={handleSubmit}>Add Task</button>
        </div>
        <div className="main_output_data">
          {sortedData.map((data,i) => {
            return(
              <div key={i} className="main_data_flex">
                {isEdit[i] ?
                <>
                  <textarea value={data.movieName} placeholder="movies" onChange={(e, i)=>handleEditChange(e, data.id)} ></textarea><br />
                  <span className="todoedit"><Icon name="save" size="large" color="blue" onClick={() => handleEdit(i)} /></span>
                </>
                :
                <>
                  <div className="noteResult">
                    <p>{data.movieName}</p>
                  </div>
                  <div className="noteIcons">
                    <span>{data.updateDate}</span><br /><br />
                    <span className="tododelete"><Icon name="trash alternate" size="large" color="red" onClick={() => handleDelete(data.id)} /></span>
                    <span className="todoedit"><Icon name="edit" size="large" color="blue" onClick={() => handleEdit(i)} /></span>
                  </div>
                </>
                
                }
              </div>
            )
          })}
        </div>
      </form>
    </div>
  )
}

export default App
