import React, { useState } from 'react';
import NoCRUD from './noCRUD'
import UserCRUD from './userCRUD'
import AdCRUD from './adCRUD'
import CompanyCRUD from './companyCRUD'
import ApplicationCRUD from './applicationCRUD'

const Admin = () =>  {
    const [page, setPage] = useState(0);
    
    const components = [
        <NoCRUD/>,
        <UserCRUD/>,
        <CompanyCRUD/>,
        <AdCRUD/>,
        <ApplicationCRUD/>
    ]
    
    return (
        <div>
        <button className="button-default" onClick={() => setPage(0)}>No CRUD</button>
        <button className="button-default" onClick={() => {setPage(0); setPage(1)}}>User CRUD</button>
        <button className="button-default" onClick={() => {setPage(0); setPage(2)}}>Company CRUD</button>
        <button className="button-default" onClick={() => {setPage(0); setPage(3)}}> Ad CRUD</button>
        <button className="button-default" onClick={() => {setPage(0); setPage(4)}}>Application CRUD</button>
        {components[page]}
        </div>
        )
    };
    
    export default Admin;