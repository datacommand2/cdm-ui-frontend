import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

interface FetchProps {
    method: 'get' | 'post' | 'delete' | 'put' | 'patch';
    url: string;
    payload?: object;
}

type FetchResult = [any, any | null, number];

const fetch = async ({ method, url, payload }: FetchProps): Promise<FetchResult> => {
    let apiUrl: string;
    if (process.env.NODE_ENV === 'development') {
        apiUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';
    } else {
        apiUrl = '/api';
    }

    let option: any;
    option = {
        headers: {
            'X-Tenant-Id': 1,
            'X-Authenticated-Session': localStorage.getItem('session'),
        },
    };
    try {
        let response: AxiosResponse<any, any>;
        if (method === 'get') {
            response = await axios.get(apiUrl + url, option);
        } else if (method === 'post') {
            response = await axios.post(apiUrl + url, payload, option);
        } else if (method === 'patch') {
            response = await axios.patch(apiUrl + url, payload, option);
        } else if (method === 'delete') {
            response = await axios.delete(apiUrl + url, option);
        } else if (method === 'put') {
            response = await axios.put(apiUrl + url, payload, option);
        } else {
            throw new Error('Unsurpported HTTP error');
        }

        const { data } = response;

        if (data.status === 200 || data.status === 201) {
            // node success
            localStorage.setItem('session', data.headers['x-authenticated-session']);
            return [data.data, null, data.status];
        } else if (data.status === 204) {
            return [data.data, null, data.status];
        } else {
            // // errors
            if (data.status === 401) {
                if (
                    data.data?.message?.originalCode.split('.').includes('check_connection') ||
                    data.data?.message?.originalCode.split('.').includes('update_credential')
                ) {
                    console.log('cluster connection');
                    // return [null, data.data, data.status];
                } else {
                    localStorage.setItem('session', 'undefined');
                }
            } else {
                return [null, data.data, data.status];
            }
            return [null, data.data, data.status];
        }
    } catch (error: any) {
        // react - node server 간 에러 발생
        // cancel request
        if (error?.message === 'canceled') {
            return [null, 'error', 500];
        } else {
            toast.error('node server error occurred');
            return [null, 'error', 500];
        }
    }
};

export const GET = (url: string): Promise<FetchResult> => fetch({ method: 'get', url });

export const POST = (url: string, payload?: {}): Promise<FetchResult> => fetch({ method: 'post', url, payload });

export const PATCH = (url: string, payload?: {}): Promise<FetchResult> => fetch({ method: 'patch', url, payload });

export const DELETE = (url: string): Promise<FetchResult> => fetch({ method: 'delete', url });

export const PUT = (url: string, payload?: {}): Promise<FetchResult> => fetch({ method: 'put', url, payload });
