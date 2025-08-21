"use client";
import React, { createContext, useState } from "react";

export const navbarContext = createContext();
const navbarContextFunction = ({children}) => {
    const [navbarToggleState, setNavbarToggleState] = useState(false);
    const [isNavbarVisible, setisNavbarVisible] = useState(true);
    const data = {
        navbarToggleState, setNavbarToggleState,isNavbarVisible, setisNavbarVisible
    }
  return (
    <div>
       <navbarContext.Provider value={data} >
        {children}
    </navbarContext.Provider>
    </div>
  )
}

export default navbarContextFunction
