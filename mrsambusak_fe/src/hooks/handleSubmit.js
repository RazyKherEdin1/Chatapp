import axios from "axios";


const myHandleSubmit = async (url,data) => {
    try {
        const response = await axios.post(url, data);
        return response; // Return the response data
      } catch (error) {
        throw error.response.data; // Throw an error with response data
      }
    };

export default myHandleSubmit;