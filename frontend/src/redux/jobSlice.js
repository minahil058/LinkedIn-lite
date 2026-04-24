import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name: "job",
    initialState: {
        allJobs: [],
        allAdminJobs: [],
        allAppliedJobs: [],
        singleJob: null,
        searchedQuery: "",
        savedJobs: [],
    },
    reducers: {
        // actions
        setAllJobs: (state, action) => {
            state.allJobs = action.payload;
        },
        setAllAppliedJobs: (state, action) => {
            state.allAppliedJobs = action.payload;
        },
        setSingleJob: (state, action) => {
            state.singleJob = action.payload;
        },
        setAllAdminJobs: (state, action) => {
            state.allAdminJobs = action.payload;
        },
        setSearchedQuery: (state, action) => {
            state.searchedQuery = action.payload;
        },
        toggleSavedJob: (state, action) => {
            const job = action.payload;
            if (!state.savedJobs) state.savedJobs = [];
            if (!job || !job._id) return;
            const exists = state.savedJobs.find(j => j?._id === job._id);
            if (exists) {
                state.savedJobs = state.savedJobs.filter(j => j?._id !== job._id);
            } else {
                state.savedJobs.push(job);
            }
        },
        removeSavedJob: (state, action) => {
            if (!state.savedJobs) state.savedJobs = [];
            state.savedJobs = state.savedJobs.filter(j => j._id !== action.payload);
        },
        setSavedJobs: (state, action) => {
            state.savedJobs = action.payload || [];
        }
    }
});

export const { 
    setAllJobs, 
    setAllAppliedJobs, 
    setSingleJob, 
    setAllAdminJobs, 
    setSearchedQuery,
    toggleSavedJob,
    removeSavedJob,
    setSavedJobs
} = jobSlice.actions;
export default jobSlice.reducer;
