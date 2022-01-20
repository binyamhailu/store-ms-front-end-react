import fetch from 'unfetch';
// const BACKEND_URL="http://binistorebackend-env-3.eba-pn96evrm.us-east-1.elasticbeanstalk.com"

const checkStatus = response => {
    if (response.ok) {
        return response;
    }
    // convert non-2xx HTTP responses into errors:
    const error = new Error(response.statusText);
    error.response = response;
    return Promise.reject(error);
}

export const getAllItems = () =>
    fetch("item/all")
        .then(checkStatus);

export const addNewItem = item =>
    fetch("item/add", {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(item)
        }
    ).then(checkStatus)

export const deleteItem = itemId =>
    fetch(`item/delete/item/${itemId}`, {
        method: 'DELETE'
    }).then(checkStatus);

export const updateAcceptItem = itemId =>
    fetch(`item/update/${itemId}`, {
        method: 'PATCH'
    }).then(checkStatus);
export const updateRejectItem = itemId =>
    fetch(`item/update/reject/${itemId}`, {
        method: 'PATCH'
    }).then(checkStatus);
