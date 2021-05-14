import React, { useState, useEffect } from 'react';
import useInfiniteScroll from "../useInfiniteScroll";
import axios from 'axios';
import '../css/listAds.css';
import '../css/admin.css'

const ApplicationCRUD = () =>  {
    const [listApplications, setListApplications] = useState({applications : []});
    const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems);
    const [listItems, setListItems] = useState([]);
    const [idDivOpened, setIdDivOpened] = useState();
    const [isDivOpened, setDivOpened] = useState(false);
    const [bool, setBool] = useState(false);

    const apiURL = "http://localhost:8000/getAllApplications";
    const urlUpdateApplication = "http://localhost:8000/updateApplication";
    const urlDeleteApplication = "http://localhost:8000/deleteApplication";
    
    function toggleApplication(id) {
        // We don't want to loose any modification to the application
        // by clicking on the title and closing it
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
            const result = await axios.get(apiURL, {withCredentials: true});
            
            setListApplications(result.data);
            setListItems(result.data.applications.slice(0,30));
        };
        
        fetchData();
    }, [bool]);
    
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
        axios.post(urlDeleteApplication, application, {withCredentials: true}).then((res) => {console.log("Application deleted"); setBool(true)}).catch(err => alert(err.message))
    }
    
    return (
        <div className="Applications">
        <div><br></br>Application can be created once logout.</div>
        <div><br></br></div>
        {listItems.map(application =>
            <div key={application._id}>
            <div className="Application"onClick={() => toggleApplication(application._id
                )}>
                {(idDivOpened === application._id) && isDivOpened && (
                    <div>
                    <div><br></br></div>
                    </div>
                    )}
                    <input className="email" name="email" defaultValue={application.email} onChange={handleInputChange}></input>
                    </div>
                    {(idDivOpened === application._id) && isDivOpened && (
                        <div className="Description">
                        <input type="text" name="firstName" placeholder="firstName" className="Application-Description" defaultValue={application.firstName} onChange={handleInputChange}></input>
                        <input type="text" name="lastName" placeholder="lastName" className="Application-Description" defaultValue={application.lastName} onChange={handleInputChange}></input>
                        <input type="text" name="message" placeholder="message" className="Application-Description" defaultValue={application.message} onChange={handleInputChange}></input>
                        <input type="text" name="ad_id" placeholder="ad_id" className="Application-Description" defaultValue={application.ad_id} onChange={handleInputChange}></input>

                        <button className="button-default" onMouseOver={setId(application._id)} onClick={() => handleSubmit()}>Submit edit</button>
                        <button className="button-default" onClick={() => deleteApplication(application)}>Delete</button>
                        <div><br></br></div>
                        </div>
                        )}
                        </div>
                        )}
                        {isFetching && 'Fetching more list items...'}
                        </div>
                        )
                        
                    }
                    
                    export default ApplicationCRUD