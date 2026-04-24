// Local development mein localhost use hoga, 
// aur Vercel par ye khud hi "/api/v1" utha lega.
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const USER_API_END_POINT = `${BASE_URL}/user`;
export const JOB_API_END_POINT = `${BASE_URL}/job`;
export const APPLICATION_API_END_POINT = `${BASE_URL}/application`;
export const COMPANY_API_END_POINT = `${BASE_URL}/company`;