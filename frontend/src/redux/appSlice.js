import { createSlice } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";

const appSlice = createSlice({
    name:"app",
    initialState : {
        navigate : useNavigate()
    },
    // reducers : {
    //     setNavigate : 
    // }
})

export default appSlice