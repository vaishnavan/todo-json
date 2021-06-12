import React, { useEffect, useState } from 'react'
import { Icon } from 'semantic-ui-react';
import moment from 'moment';
import Footer from './Footer/Footer';
import './App.css';

function App() {
  
  const [movie, setmovie] = useState('');
  const [addmovie, setAddMovie] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [myNote, setMyNote] = useState('');
  const [filterData, setFilterData] = useState([]);
  const [important, setImportant] = useState('')
  
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('mymovieData'));
    if(items){
      setAddMovie(items);
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('mymovieData', JSON.stringify(addmovie));
  }, [addmovie])

  useEffect(() => {
    const sorting = addmovie.sort((a,b) => a.updateDate < b.updateDate ? 1:-1);
    setSortedData(sorting);
    
  }, [addmovie])

  useEffect(() => {
    setFilterData(
      sortedData.filter((searchdata) => {
        return searchdata.movieName.toLowerCase().includes(myNote.toLowerCase());
      })
    )
  },[myNote, sortedData])

  const handleChange = (e) => {
    setmovie(e.target.value);
  }

  const handleSubmit = (e) => {
    // let date = new Date();
    // console.log( moment(Date.now()).format('ll') - 1);
    e.preventDefault();
    if(movie === '') return;
    const newNotes = [...addmovie, {id:Math.floor(Math.random()*1000), movieName:movie, updateDate:Date.now(), imp:important}]
    setAddMovie(newNotes);
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

  const handleNotes = (e) => {
    setMyNote(e.target.value);
  }

  const handlePrioty = (e) => {
    setImportant(e.target.value)
  }



  return (
    <div>
      <form>
        <div className="main_add_form">
          <textarea value={movie} placeholder="Add your daily task" onChange={handleChange}></textarea><br />
          <div>
            <select onChange={handlePrioty}>
              <option disabled>Select task Alert</option>
              <option value="high priority">High priority</option>
              <option value="important">Important</option>
              <option value="relex">Relex</option>
            </select>
          </div>
          <button onClick={handleSubmit}>Add Task</button>
        </div>
        <div className="search_notes">
            <input type="text" placeholder="Search for notes..."  onChange={handleNotes} />
        </div>
        <div className="important_info">
          <div className="important">
            <div className="important_red"></div>
            <div style={{margin:"0 5px"}}> high priority</div>
          </div>
          <div className="important">
            <div className="important_orange"></div>
            <div style={{margin:"0 5px"}}>Important</div>
          </div>
          <div className="important">
            <div className="important_green"></div>
            <div style={{margin:"0 5px"}}>Relex</div>
          </div>
        </div>
        <div className="main_output_data">
          {filterData.length === 0 && <img className="empty_svgimg" src="notfound.svg" alt="notfound" />}
          {filterData.map((data,i) => {
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
                    {data.imp === 'high priority' && <span className="highlight_prioty"></span>}
                    {data.imp === 'important' && <span className="highlight_important"></span>}
                    {data.imp === 'relex' && <span className="highlight_relex"></span>}

                    <span className="highlight_status">{moment(data.updateDate).format('ll') === moment(Date.now()).format('ll') ? 'New Note':'Previous note' }</span>
                    <p>{data.movieName}</p>
                  </div>
                  <div className="noteIcons">
                    <span>{moment(data.updateDate).format('lll')}</span><br /><br />
                    <span className="tododelete"><Icon name="trash alternate" size="large" color="red" onClick={() =>{if(window.confirm('Are you sure you want to delete this item?'))
                     {handleDelete(data.id)}}} /></span>
                    <span className="todoedit"><Icon name="edit" size="large" color="blue" onClick={() => handleEdit(i)} /></span>
                  </div>
                </>
                }
              </div>
            )
          })}
        </div>
      </form>
      <Footer />
    </div>
  )
}

export default App
