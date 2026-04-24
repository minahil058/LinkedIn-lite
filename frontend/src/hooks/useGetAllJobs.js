import { setAllJobs } from "../redux/jobSlice";
import { JOB_API_END_POINT } from "../utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const { searchedQuery } = useSelector(store => store.job || {});
    
    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                console.log("Fetching jobs with query:", searchedQuery);
                const res = await axios.get(`${JOB_API_END_POINT}/get?keyword=${searchedQuery || ""}`, {
                    withCredentials: true
                });
                console.log("Fetch result:", res.data);
                if (res.data.success) {
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
                console.log("Error fetching jobs:", error);
                if (!error.response) {
                    toast.error("Server unreachable. Please check if the backend is running.");
                }
            }
        }
        fetchAllJobs();
    }, [dispatch, searchedQuery]);
}

export default useGetAllJobs;
