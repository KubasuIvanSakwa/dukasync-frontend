const baseURL = 'https://dukasync-backend-fvw3.onrender.com/api/v1'

// const options = {
//     method: 'GET',
//     // headers: {
//     //     "content": "application/json",
//     //     "Access-Control-Allow-Origin": "*"
//     // }
// }


export async function fetchProducts() {
    try {
        const response = await fetch(`${baseURL}/product`)
        const result = await response.json()
        return result
    } catch(error){
        return error
    }
}