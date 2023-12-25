import { createSlice } from '@reduxjs/toolkit';


const initialState={
    podcasts:[]
}


const podcastSlice=createSlice({
    name:"pocasts",
    initialState,
    reducers:{
        setPodcasts:(state,action)=>{
            state.podcasts=action.payload
        }
    }
});


export default podcastSlice.reducer;

export const{setPodcasts}=podcastSlice.actions;

