import axios from 'axios';
import { BASE_URL } from './constants';
import { errors } from "./helpers";

async function axioGet(url) {
    const apiurl = `${BASE_URL}/${url}`;
    try {
        const response = await axios.get(apiurl);
        return response;
    }
    catch (e) {
        errors(this, e)
    }
}

async function axioPost(url, param, config) {
    const apiurl = `${BASE_URL}/${url}`;
    try {
        const response = await axios.post(apiurl, param, config);
        return response;
    }
    catch (e) {
        errors(this, e)
    }
}

async function axioDelete(url, config) {
    const apiurl = `${BASE_URL}/${url}`;
    try {
        const response = await axios.delete(apiurl, config);
        return response;
    }
    catch (e) {
        errors(this, e)
    }
}

async function axioPut(url, param, config) {
    const apiurl = `${BASE_URL}/${url}`;
    try {
        const response = await axios.put(apiurl, param, config);
        return response;
    }
    catch (e) {
        errors(this, e)
    }
}

export {
    axioGet,
    axioPost,
    axioDelete,
    axioPut
};
