// @ AJAX REQUEST
async function ajax(url, data, extension, context) {

    // * create responce data var
    let responceData = null;
    // <-- get crsf token
    function getToken(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // --> create ajex request
    const responce = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': getToken('csrftoken'),
        },
        body: JSON.stringify(data)

    }).then(responce => { // * return responce
        return responce.json();
    }).then(data => {
        // get responce datashare.html
        responceData = data;
    }).catch(() => {
        console.log('error');
    });
    
    // --> extension function
    
    if (extension !== undefined) {
        extension(responceData, context);
    }
   
    // <-- return responce data

    return responceData;
}