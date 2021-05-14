import React, { useState, useEffect } from 'react';
import useInfiniteScroll from "../useInfiniteScroll";
import axios from 'axios';
import '../css/listAds.css';
import ModalApply from "../ModalApply";
import useModal from '../useModal';
import useCookie from '../useCookie'
import "../css/style.css";

const ListAds = () => {
  const [status, setStatus] = useCookie("status")
  if(status === "recruiter") window.location.href = "/ads"
  if(status === "admin") window.location.href = "/admin"

  const [listAds, setListAds] = useState({ads : []});
  const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems);
  const [listItems, setListItems] = useState([]);

  
  const {isShowing, toggle} = useModal();
  const [idDivOpened, setIdDivOpened] = useState();
  const [isDivOpened, setDivOpened] = useState(false);

  const apiURL = 'http://localhost:8000/getAllAds';

  function toggleAd(id) {
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
  }, []);

  return (
    <div className="Ads">
    {listItems.map(ad =>
    <div key={ad.id}>
      <div className="Ad"onClick={() => toggleAd(ad._id)}>
        <div className="Ad-Company">{ad.company}</div>
        <div className="Ad-Title">{ad.title}</div>
        <div className={`arrow ${isDivOpened && (idDivOpened === ad._id) ? "open" : null}`} />
      </div>
      {(idDivOpened === ad._id) && isDivOpened && (
      <div className="Ad-Description">
        <p>{ad.description}</p>
        <button className="button-default" onClick={toggle}>Apply</button>
      <ModalApply
        id={ad._id}
        label='Ads'
        isShowing={isShowing}
        hide={toggle}
      />
      </div>
      )}
    </div>
    )}
    {isFetching && 'Fetching more list items...'}
    </div>
  );
};

export default ListAds;