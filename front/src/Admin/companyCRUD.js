import React, { useState, useEffect } from 'react';
import useInfiniteScroll from "../useInfiniteScroll";
import axios from 'axios';
import ContentCreateCompany from '../ContentCreateCompany';
import useModal from '../useModal';
import '../css/listAds.css';
import '../css/admin.css'

const CompanyCRUD = () =>  {
    const [listCompanies, setListCompanies] = useState({companies : []});
    const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems);
    const [listItems, setListItems] = useState([]);
    const [idDivOpened, setIdDivOpened] = useState();
    const [isDivOpened, setDivOpened] = useState(false);
    const [bool, setBool] = useState(false);
    
    const apiURL = "http://localhost:8000/getAllCompanies";
    const urlCreateCompany= "http://localhost:8000/createCompany"
    const urlUpdateCompany = "http://localhost:8000/updateCompany";
    const urlDeletecompany = "http://localhost:8000/deleteCompany";
    
    function toggleCompany(id) {
        // We don't want to loose any modification to the company
        // by clicking on the title and closing it
        if (!isDivOpened && (id !== idDivOpened)){
            setDivOpened(wasOpened => !wasOpened)
        }
        setIdDivOpened(id);
    }
    
    function fetchMoreListItems() {
        setTimeout(() => {
            const newCompanies = listCompanies.companies.slice(listItems.length, listItems.length + 20);
            setListItems(listItems.concat(newCompanies));
            if(listItems < listCompanies){
                setIsFetching(false);
            } 
        }, 1000);
        console.log('Fetching');
    }
    
    useEffect(() => {  
        const fetchData = async () => {
            const result = await axios.get(apiURL, {withCredentials: true});
            
            setListCompanies(result.data);
            setListItems(result.data.companies.slice(0,30));
        };
        
        fetchData();
        setBool(false)
    }, [bool]);
    
    const useRegistrationForm = () => {
        const [inputs, setInputs] = useState({});
        const handleSubmit = () => {
            axios.post(urlUpdateCompany, inputs, {withCredentials: true}).then((res) => {alert("Company updated");setBool(true)}).catch(err => alert(err.message))
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
    
    function deleteCompany(company) {
        axios.post(urlDeletecompany, company, {withCredentials: true}).then((res) => {console.log("Company deleted"); setBool(true)}).catch(err => alert(err.message))
    }

    const useRegistrationFormCreateCompany = () => {
        const [inputsCreateCompany, setInputs] = useState({});
        
        const handleSubmitCreateCompany = async(event) => {
          if (event) {
            event.preventDefault()
          }
          if (await new Promise ((resolve, reject) => {
            axios.post(urlCreateCompany, inputsCreateCompany).then((res) => {
              resolve(res)
              ; setBool(true)}).catch(err => console.log(err.response.data.error));
          })) {
          }
        }
        
        const handleInputChangeCreateCompany = (event) => {
          event.persist();
          setInputs(inputsCreateCompany => ({...inputsCreateCompany, [event.target.name]:
            event.target.value}))
          }
          return {
            handleSubmitCreateCompany,
            handleInputChangeCreateCompany,
            inputsCreateCompany
          }
        }
        
        const {inputsCreateCompany, handleInputChangeCreateCompany, handleSubmitCreateCompany} = useRegistrationFormCreateCompany();
    
    return (
        <div className="Companies">
        <div><br></br>New company</div>
        <div className="form-create-company">
           <div>
          <input type="text" name="name" placeholder="Name" onChange={handleInputChangeCreateCompany} required value={inputsCreateCompany.name}></input>
          </div>      
          <div>
          <input type="textarea" name="description" placeholder="Description" required onChange={handleInputChangeCreateCompany} value={inputsCreateCompany.description}></input>
          </div>
          <div>
          <button className="button-default" type="submit" onClick={() => handleSubmitCreateCompany()}>Create company</button>
          </div>
        </div>
        
        <div><br></br></div>
        {listItems.map(company =>
            <div key={company._id}>
            <div className="Company"onClick={() => toggleCompany(company._id
                )}>
                {(idDivOpened === company._id) && isDivOpened && (
                    <div>
                    <div><br></br></div>
                    </div>
                    )}
                    <input className="name" name="name" defaultValue={company.name} onChange={handleInputChange}></input>
                    </div>
                    {(idDivOpened === company._id) && isDivOpened && (
                        <div className="Description">
                        <textarea type="text" name="description" className="Company-Description" defaultValue={company.description} onChange={handleInputChange}></textarea>
                        <button className="button-default" onMouseOver={setId(company._id)} onClick={() => handleSubmit()}>Submit edit</button>
                        <button className="button-default" onClick={() => deleteCompany(company)}>Delete</button>
                        <div><br></br></div>
                        </div>
                        )}
                        </div>
                        )}
                        {isFetching && 'Fetching more list items...'}
                        </div>
                        )
                        
                    }
                    
                    export default CompanyCRUD