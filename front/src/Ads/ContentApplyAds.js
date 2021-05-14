import React, {useState, useEffect} from 'react';
import axios from 'axios';
import useCookie from '../useCookie';


const ContentApllyAd = ({ ad_id, modalDisplay}) => {
  const url = 'http://localhost:8000/createApplication';    
  const isUserConnected = useCookie("status");
  const userFirstName = useCookie("firstName");
  const userLastName = useCookie("lastName");  
  const userEmail = useCookie("email");

    const displayModal = () => {
      modalDisplay();
    }

    const useRegistrationForm = () => {
      const [inputs, setInputs] = useState({});

      useEffect(() => {
        setInputs(inputs =>({...inputs, "ad_id": ad_id}));
        if(isUserConnected[0] === "user"){
          setInputs(inputs =>({...inputs, "lastName": userLastName[0], "firstName": userFirstName[0], "email": userEmail[0]}));
        }
      }, []);
      
      const handleSubmit = (event) => {
        if (event) {
          event.preventDefault()
        }
        axios.post(url, inputs, {withCredentials: true}).then((res) => {alert(res.data.message)}).catch(err => console.log(err.response.data.error));
        displayModal();
      }
      
      const handleInputChange = (event) => {
        event.persist();
        setInputs(inputs => ({...inputs, [event.target.name]:
          event.target.value}))
        }
        return {
          handleSubmit,
          handleInputChange,
          inputs
        }
      }
      
      const {inputs, handleInputChange, handleSubmit} = useRegistrationForm();
      return(
        <form onSubmit={handleSubmit}>
        {(isUserConnected[0] === null) && (
        <div>
          <div>
          <input type="text" name="firstName" placeholder="First Name" onChange={handleInputChange} required value={inputs.firstName}></input>
          </div>
          <div>
          <input type="text" name="lastName" placeholder="Last Name" onChange={handleInputChange} required value={inputs.lastName}></input>
          </div>
          <div>
          <input type="email" name="email" placeholder="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" required  onChange={handleInputChange} value={inputs.email}></input>
          </div>
        </div>  
        )}
        <div>
        <input type="textarea" name="message" placeholder="Message" required onChange={handleInputChange} value={inputs.message}></input>
        </div>
        <div>
        <button type="submit" onSubmit={handleSubmit}>Apply</button>
        </div>
        </form>
        );
}

export default ContentApllyAd;
        