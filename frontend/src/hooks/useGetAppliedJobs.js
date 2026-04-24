import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAllAppliedJobs } from "../redux/jobSlice";
import { APPLICATION_API_END_POINT } from "../utils/constant";

const useGetAppliedJobs = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAppliedJobs = async () => {
            try {
                console.log("Fetching applied jobs...");
                const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setAllAppliedJobs(res.data.applications));
                }
            } catch (error) {
                console.log("Error fetching applied jobs:", error);
            }
        }
        fetchAppliedJobs();
    }, [dispatch]);
};
export default useGetAppliedJobs;
