import 'core-js'
import "regenerator-runtime/runtime"

import axios from "axios"

const corsOrigin = "https://cors-anywhere.herokuapp.com/"
const baseUrl = "http://localhost:3000"

const post = axios.create({
  method: "POST",
  baseURL: `${corsOrigin}${baseUrl}`,
})

const get = axios.create({
  method: "GET",
  baseURL: `${corsOrigin}${baseUrl}`,
})

const patch = axios.create({
  method: "PATCH",
  baseURL: `${corsOrigin}${baseUrl}`,
})

const remove = axios.create({
  method: "DELETE",
  baseURL: `${corsOrigin}${baseUrl}`,
})

// login admin
export const loginAdmin = async (username, password) => {
    try {
        const { data } = await post({
            url: '/dashboard/login',
            data: {
                username,
                password
            }
        })
        return data
    }
    catch(e) {
        console.log(e)
    }
}

// logout admin
export const logoutAdmin = async (token) => {
    try {
        const { data } = await post({
            url: `/dashboard/logout`,
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        }).then((data) => {
            console.log(data)
        })
        localStorage.removeItem("Auth")
        return data
    } catch (e) {
        console.log(e)
    }
}

// logoutAll admin
export const logoutAllAdmin = async (token) => {
    try {
        const { data } = await post({
            url: `/dashboard/logoutall`,
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        }).then((data) => {
            console.log(data)
        })
  
      localStorage.removeItem("Auth")
      return data
    } catch (e) {
      console.log(e)
    }
}

// login employee
export const loginEmp = async (email, password) => {
    try {
        const { data } = await post({
            url: '/employees/login',
            data: {
                email,
                password
            }
        })
        return data
    }
    catch(e) {
        console.log(e)
    }
}

// Update Profile of employee
export const updateProfile = async (updates = {}, token) => {
    const _id = req.params.id
    const { data } = await patch({
        url: `/employees/modify/${_id}`,
        data: updates,
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    }).then( response => {
        console.log(response);
    } ).catch(e => console.log(e))

    return data;
}

// logout employee
export const logoutEmp = async (token) => {
    try {
        const { data } = await post({
            url: `/employees/logout`,
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        }).then((data) => {
            console.log(data)
        })
        localStorage.removeItem("Auth")
        return data
    } catch (e) {
        console.log(e)
    }
}

//logoutAll employee
export const logoutAllEmp = async (token) => {
    try {
        const { data } = await post({
            url: `/employees/logoutall`,
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        }).then((data) => {
            console.log(data)
        })
  
      localStorage.removeItem("Auth")
      return data
    } catch (e) {
      console.log(e)
    }
}

//create employee's account by admin
export const createAcc = async (firstname, lastname, job, phoneNumber, dateOfBirth, ccp, email, password, token) => {
    try {
        const { data } = await post({
            url: '/employees',
            data: {
                firstname,
                lastname,
                job,
                phoneNumber,
                dateOfBirth,
                ccp,
                email,
                password
            },
            headers: {
                'Content-Type': 'multipart/form-data',
                "Authorization": `Bearer ${token}` 
            }
        }).then( response => {
            console.log(response.data);            
        })
        
        return data;
    } catch (e) {
        console.log(e);
    }
}

//Delete employee's account by admin
export const deleteEmpAcc = async (_id, token) => {
    const { data } = await remove({
        url: `/employees/${_id}`,
        data: {
            _id
        },
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })

    return data;
}


//Add profile pic to employee
export const addProfileImg = async (file, token) => {
    const data = await post({
        url: '/employees/me/image',
        data: file,
        headers: {
            'Content-Type': 'multipart/form-data',
            "Authorization": `Bearer ${token}` 
        }
    }).then( (response) => {
        console.log(response);               
        //console.log('Finish')
    })
    return data;
}

//Delete profile pic of employee
export const deleteEmpPic = async (token) => {
    const { data } = await remove({
        url: `/employees/me/image`,
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })

    return data;
}

// Add type of service by admin
export const AddService = async (data, token) => {
    try {
        const { data } = await post({
            url: '/services',
            data: data,
            headers: {
                'Content-Type': 'multipart/form-data',
                "Authorization": `Bearer ${token}`,
            },
        }).then( response => {
                console.log(response.data);            
            })
    
        return data;
    } catch (e) {
        console.log(e);
    }
}

export const getService 