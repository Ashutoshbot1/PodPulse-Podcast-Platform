import React from 'react';
import './Header.css';
import { NavLink } from 'react-router-dom';
import { auth } from '../../../firebase';
import {useAuthState} from "react-firebase-hooks/auth"

const Header = ({setFlag,flag}) => {

  const[user]=useAuthState(auth);

  if(user){
  return (
    <div className="navbar">
      <div className="gradient"></div>
      <div className="links">
        <NavLink to="/">{!flag?"Signup":"Login"}</NavLink>
        <NavLink to="/podcasts">Podcasts</NavLink>
        <NavLink to="/start-podcast">Start Podcast</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </div>
    </div>
  )
  }
  else{
    return(
      <div className="navbar2">
        <div className="gradient2"></div>
        <div className="links2">
          <NavLink to="/" onClick={()=>setFlag(false)}  className={!flag?"act":"de-act"}>Signup</NavLink>
          <NavLink to="/" onClick={()=>setFlag(true)} className={flag?"act":"de-act"}>Login</NavLink>
        </div>
      </div>
    )
  }
}

export default Header;
