import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { USER_API_END_POINT } from "../utils/constant";
import { setSavedJobs } from "../redux/jobSlice";

const useGetSavedJobs = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchSavedJobs = async () => {
            try {
                const res = await axios.get(`${USER_API_END_POINT}/getsavedjobs`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    dispatch(setSavedJobs(res.data.savedJobs));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSavedJobs();
    }, [dispatch]);
}

export default useGetSavedJobs;
