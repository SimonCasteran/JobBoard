import React, { useState, useEffect } from 'react';
import useInfiniteScroll from "../useInfiniteScroll";
import axios from 'axios';
import Register from '../registerUser'
import '../css/listAds.css';
import '../css/admin.css'

const UserCRUD = () =>  {
    const [listUsers, setListUsers] = useState({users : []});
    const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems);
    const [listItems, setListItems] = useState([]);
    const [idDivOpened, setIdDivOpened] = useState();
    const [isDivOpened, setDivOpened] = useState(false);
    const [bool, setBool] = useState(false);
    
    const apiURL = "http://localhost:8000/getAllUsers";
    const urlUpdateUser = "http://localhost:8000/updateUser";
    const urlDeleteUser = "http://localhost:8000/deleteUser";
    
    function toggleUser(id) {
        // We don't want to loose any modification to the user
        // by clicking on the title and closing it
        if (!isDivOpened && (id !== idDivOpened)){
            setDivOpened(wasOpened => !wasOpened)
        }
        setIdDivOpened(id);
    }
    
    function fetchMoreListItems() {
        setTimeout(() => {
            const newUsers = listUsers.users.slice(listItems.length, listItems.length + 20);
            setListItems(listItems.concat(newUsers));
            if(listItems < listUsers){
                setIsFetching(false);
            } 
        }, 1000);
        console.log('Fetching');
    }
    
    useEffect(() => {  
        const fetchData = async () => {
            const result = await axios.get(apiURL, {withCredentials: true});
            
            setListUsers(result.data);
            setListItems(result.data.users.slice(0,30));
        };
        
        fetchData();
    }, [bool]);
    
    const useRegistrationForm = () => {
        const [inputs, setInputs] = useState({});
        const handleSubmit = () => {
            axios.post(urlUpdateUser, inputs, {withCredentials: true}).then((res) => {alert("User updated")}).catch(err => alert(err.message))
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
    
    function deleteUser(user) {
        axios.post(urlDeleteUser, user, {withCredentials: true}).then((res) => {console.log("User deleted"); setBool(true)}).catch(err => alert(err.message))
    }
    
    return (
        <div className="Users">
        <div><br></br></div>
        <div>Create a new candidate</div>
        <div><br></br></div>
        <Register/>
        <div><br></br></div>
        {listItems.map(user =>
            <div key={user._id}>
            <div className="User"onClick={() => toggleUser(user._id
                )}>
                {(idDivOpened === user._id) && isDivOpened && (
                    <div>
                    <div><br></br></div>
                    </div>
                    )}
                    <input className="email" name="email" defaultValue={user.email} onChange={handleInputChange}></input>
                    </div>
                    {(idDivOpened === user._id) && isDivOpened && (
                        <div className="User-Description">
                        <div>
                            <div>Current status: <div>{user.status}</div></div>
                        <input type="radio" id="user" name="status" value="user" onChange={handleInputChange}></input>
                        <label for ="user">User</label>
                        <input type="radio" id="recruiter" name="status" value="recruiter" onChange={handleInputChange}></input>
                        <label for ="recruiter">recruiter</label>
                        </div>
                        <input type="text" name="firstName" className="firstName" defaultValue={user.firstName} onChange={handleInputChange}></input>
                        <input type="text" name="lastName" className="lastName" defaultValue={user.lastName} onChange={handleInputChange}></input>
                        <input type="text" name="password" className="password" placeholder="New password" onChange={handleInputChange}></input>
                        <button className="button-default" onMouseOver={setId(user._id)} onClick={() => handleSubmit()}>Submit edit</button>
                        <button className="button-default" onClick={() => deleteUser(user)}>Delete</button>
                        <div><br></br></div>
                        </div>
                        )}
                        </div>
                        )}
                        {isFetching && 'Fetching more list items...'}
                        </div>
                        )
                    }
                    
                    export default UserCRUD