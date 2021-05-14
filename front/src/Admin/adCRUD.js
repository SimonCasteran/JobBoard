import React, { useState, useEffect } from 'react';
import useInfiniteScroll from "../useInfiniteScroll";
import axios from 'axios';
import '../css/listAds.css';
import '../css/admin.css'

const AdCRUD = () =>  {
  const [listAds, setListAds] = useState({ads : []});
  const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems);
  const [listItems, setListItems] = useState([]);
  const [idDivOpened, setIdDivOpened] = useState();
  const [isDivOpened, setDivOpened] = useState(false);
  const [bool, setBool] = useState(false);

  const apiURL = "http://localhost:8000/getAllAds";
  const urlUpdateAd = "http://localhost:8000/updateAd";
  const urlDeleteAd = "http://localhost:8000/deleteAd";
  
  function toggleAd(id) {
    // We don't want to loose any modification to the ad
    // by clicking on the title and closing it
    if (!isDivOpened && (id !== idDivOpened)){
      setDivOpened(wasOpened => !wasOpened)
    }
    setIdDivOpened(id);
  }
  
  function fetchMoreListItems() {
    setTimeout(() => {
      const newAds = listAds.ads.slice(listItems.length, listItems.length + 20);
      setListItems(listItems.concat(newAds));
      if(listItems < listAds){
        setIsFetching(false);
      } 
    }, 1000);
    console.log('Fetching');
  }
  
  useEffect(() => {  
    const fetchData = async () => {
      const result = await axios.post(apiURL);
      
      setListAds(result.data);
      setListItems(result.data.ads.slice(0,30));
    };
    
    fetchData();
    setBool(false)
  }, [bool]);
  
  const useRegistrationForm = () => {
    const [inputs, setInputs] = useState({});
    const handleSubmit = () => {
      
      axios.post(urlUpdateAd, inputs, {withCredentials: true}).then((res) => {console.log(res);setBool(true); alert("Ad updated")}).catch(err => alert(err.message))
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
  
  function deleteAd(ad) {
    axios.post(urlDeleteAd, ad, {withCredentials: true}).then((res) => {console.log(res); setBool(true)}).catch(err => alert(err.message))
  }
  
  return (
    <div className="Ads">
    {listItems.map(ad =>
      <div key={ad._id}>
      <div className="Ad"onClick={() => toggleAd(ad._id
        )}>
        <div className="Ad-Company" name="company" onChange={handleInputChange}>{ad.company}</div>
        <input type="text" name="title" className="Ad_Title" defaultValue={ad.title} onChange={handleInputChange}></input>
        </div>
        {(idDivOpened === ad._id) && isDivOpened && (
          <div className="Ad-Description">
          <textarea className="adDescription" name="description" defaultValue={ad.description} onChange={handleInputChange} ></textarea>
          <button className="button-default" onMouseOver={setId(ad._id)} onClick={() => handleSubmit()}>Submit edit</button>
          <button className="button-default" onClick={() => deleteAd(ad)}>Delete</button>
          </div>
          )}
          </div>
          )}
          {isFetching && 'Fetching more list items...'}
          </div>
          );
        }
        
        export default AdCRUD