import axios from 'axios';


const isAuthenticated = async (rol) => {
    const token = localStorage.getItem('tokendataE')

    const response = await axios.post('http://127.0.0.1:5000/verifytoken', null, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return response.data.rol == rol
};

export default isAuthenticated;
