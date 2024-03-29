import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useInfiniteScroll from "./useInfiniteScroll";
import './css/listAds.css'
import './css/history.css'

const History = () => {
    const [listApplications, setListApplications] = useState({applications : []});
    const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems);
    const [listItems, setListItems] = useState([]);
    const [idDivOpened, setIdDivOpened] = useState();
    const [isDivOpened, setDivOpened] = useState(false);
    
    const urlGetApllication = "http://localhost:8000/getUserApplications";
    const urlUpdateApplication = "http://localhost:8000/updateApplication";
    const urlDeleteApplication = "http://localhost:8000/deleteApplication";

    function toggleApplication(id) {
        if (id === idDivOpened) {
          setDivOpened(wasOpened => !wasOpened);
        }
        if (!isDivOpened && (id !== idDivOpened)){
          setDivOpened(wasOpened => !wasOpened)
        }
        setIdDivOpened(id);
      }

    function fetchMoreListItems() {
        setTimeout(() => {
            const newApplications = listApplications.applications.slice(listItems.length, listItems.length + 20);
            setListItems(listItems.concat(newApplications));
            if(listItems < listApplications){
                setIsFetching(false);
            } 
        }, 1000);
        console.log('Fetching');
    }
    
    useEffect(() => {  
        const fetchData = async () => {
            const result = await axios.get(urlGetApllication, {withCredentials: true});
            
            setListApplications(result.data);
            setListItems(result.data.applications.slice(0,30));
        };
        
        fetchData();
    }, []);

    const useRegistrationForm = () => {
        const [inputs, setInputs] = useState({});
        const handleSubmit = () => {
            axios.post(urlUpdateApplication, inputs, {withCredentials: true}).then((res) => {alert("Application updated")}).catch(err => alert(err.message))
        }
        
        const handleInputChange = (event) => {
            event.persist();
            
            setInputs(inputs => ({...inputs, [event.target.name]: event.target.value}))
        }
        
        return {
            handleSubmit,
            handleInputChange,
            setInputs,
            inputs
        }
    }
    
    let {inputs, handleInputChange, handleSubmit, setInputs} = useRegistrationForm()
    
    
    function setId(id) {
        if(!inputs._id){
            setInputs({...inputs, _id:id})
        }
    }
    
    function deleteApplication(application) {
        axios.post(urlDeleteApplication, application, {withCredentials: true}).then((res) => {window.location.href = "/history"}).catch(err => alert(err.message))
    }
    
    return (
        <div className="Applications">
        {listItems.map(application =>
            <div className="" key={application._id}>
            <div className="Ad" onClick={() => toggleApplication(application._id
                )}>
                {(idDivOpened === application._id) && isDivOpened && (
                    <div>
                    </div>
                    )}
                    <div name="ad-Title"> {application.ad_id}</div>
                    </div>
                    {(idDivOpened === application._id) && isDivOpened && (
                        <div className="Ad-Description">
                        <textarea name="message"  className="Ad-Description" defaultValue={application.message} onChange={handleInputChange}></textarea>
                        <div className="buttons">
                        <button className="button-default" onMouseOver={setId(application._id)} onClick={() => handleSubmit()}>Submit edit</button>
                        <button className="button-default" onClick={() => deleteApplication(application)}>Delete</button>
                        </div>
                        </div>
                        )}
                        </div>
                        )}
                        {isFetching && 'Fetching more list items...'}
                        </div>
    )
}

export default History