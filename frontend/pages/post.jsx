import React, { useState } from 'react'
// import FormData from 'form-data'
// import { Headers } from 'form-data'
import axios from 'axios'
import Cookies from 'js-cookie'
// import fetch from 'node-fetch'


function Post() {
    const [title, setTitle] = useState()
    const [description, setDescription] = useState()
    const [file, setFile] = useState()
    const [cookie, setCookie] = useState(Cookies.get('access_token'))

    const handleTitleChange = (e) => {
        setTitle(e.target.value)
    }
    const handleDescriptionChange = (e) => {
        setDescription(e.target.value)
    }

    const handleFileUpload = async (e) => {
        setFile(e.target.files[0])
        // console.log(e.target.files[0])
        // let data = new FormData();
        // data.append('image', e.target.files[0])
        // data.append('title', title);
        // data.append('description', description);
        // var myHeaders = new Headers();
        // myHeaders.append("Cookie", `access_token=${Cookies.get('access_token')}`);

        // var config = {
        //     method: 'post',
        //     url: 'http://localhost:4000/api/image-upload',
        //     headers: {
        //         // 'Cookie': 'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0MjAzZTA5OS1iYzVkLTRlODEtYTFmNS00MTYxNmZkNWI1MDgiLCJpYXQiOjE2NDc3NzQxMzV9.7IIzLHYSyXkHaH_FxTATpZ6A0VI8zvsitylRyfwU-Fw',
        //         // ...data.getHeaders()
        //         myHeaders
        //     },
        //     data: data
        // };

        // axios(config)
        //     .then(function (response) {
        //         console.log(JSON.stringify(response.data));
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     });


        // console.log(file)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        // let formData = new FormData();
        // formData.append('image', file)
        // console.log(formData)
        console.log(Cookies.get('access_token'))
        const myFrom = document.getElementById('myForm')
        // console.log('e', myFrom)
        // let data = new FormData(e.target);
        let data = new FormData();
        // let data = new FormData(myFrom);
        // data.set('image', file)
        // data.delete('image')
        data.append('title', title);
        data.append('description', description);
        data.append('image', file)
        var myHeaders = new Headers();
        // myHeaders.append("Cookie", "access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0MjAzZTA5OS1iYzVkLTRlODEtYTFmNS00MTYxNmZkNWI1MDgiLCJpYXQiOjE2NDc3NzQxMzV9.7IIzLHYSyXkHaH_FxTATpZ6A0VI8zvsitylRyfwU-Fw");
        // myHeaders.append("Cookie", `access_token=${Cookies.get('access_token')}`);
        myHeaders.append("Authorization", `Bearer ${Cookies.get('access_token')}`);
        // console.log('headers', myHeaders)
        const config = {
            method: 'post',
            url: 'http://localhost:4000/api/image-upload',
            headers: {
                // 'Cookie': 'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0MjAzZTA5OS1iYzVkLTRlODEtYTFmNS00MTYxNmZkNWI1MDgiLCJpYXQiOjE2NDc3NzQxMzV9.7IIzLHYSyXkHaH_FxTATpZ6A0VI8zvsitylRyfwU-Fw',
                // ...data.getHeaders()
                // myHeaders
                'Authorization': `Bearer ${Cookies.get('access_token')}`,
            },
            data: data
        };

        // axios.interceptors.request.use(function (config) {
        //     const token = `Bearer ${Cookies.get('access_token')}`
        //     config.headers.Authorization = `Bearer ${token}`;

        //     return config;
        // });
        var request = new XMLHttpRequest();
        // request.open("POST", "http://localhost:4000/api/image-upload", true);
        request.open("POST", "/api/post", true);
        request.setRequestHeader('Authorization', `Bearer ${Cookies.get('access_token')}`);
        // request.setRequestHeader('Content-Type', `multipart/form-data boundary=xxx`);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        // 'Content-Type': 'multipart/form-data',
        //
        // request.send(data);
        // console.log('request', request)
        // axios.post('/api/post',
        // axios.post('http://localhost:4000/api/image-upload',
        //     {
        //         data: { ...data },
        //         title: title,
        //         description: description
        //     },
        //     {
        //         headers: {
        //             'Authorization': `Bearer ${Cookies.get('access_token')}`
        //         }

        //         //     })
        //         //     // axios(config)
        //         //     .then(function (response) {
        //         //         console.log(JSON.stringify(response.data));
        //         //     })
        //         //     .catch(function (error) {
        //         //         console.log(error);
        //         //     });

        //         // console.log(data)

        //         // const asfetch = fetch('http://localhost:4000/api/image-upload', {
        //         //     method: 'POST',
        //         //     headers: {

        //         //         'Accept': 'application/json',
        //         //         // 'Content-Type': 'application/json',
        //         //         "Content-Type": "application/x-www-form-urlencoded",
        //         //         'Authorization': `Bearer ${Cookies.get('access_token')}`,
        //         //         // 'Content-Type': 'multipart/form-data',
        //         //         // Content-Type: multipart/form-data; boundary=???,
        //         //         // ...req.headers
        //         //     },
        //         //     body: { ...data }
        //         // })
        //         //     .then(response => {
        //         //         console.log(response);
        //         //     });

        console.log(data)
        axios({
            method: 'POST',
            // url: 'http://localhost:4000/api/image-upload',
            url: '/api/post',
            headers: {
                'Authorization': `Bearer ${Cookies.get('access_token')}`,
            },
            data: data,
        })
        // console.log('data', data.get('description'))
        // console.log('data', ...data)


    }
    if (cookie) {
        return (
            <>
                <div>Post</div>
                <div className="container">
                    <div className="row">
                        <form action="" method="post" onSubmit={handleSubmit} id='myForm'>
                            <div className="form-group">
                                <label htmlFor="title">Post title</label>
                                <input name='title' type="text" className="form-control" id="title" aria-describedby="emailHelp" value={title} onChange={handleTitleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Post description</label>
                                {/* <input type="password" className="form-control" id="postDescription" placeholder="Password" /> */}
                                <textarea name="description" id="description" className="form-control" onChange={handleDescriptionChange}>{description}</textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="image">image</label>
                                <input type="file" className="form-control" id="image" name='image' accept="image/*" onChange={handleFileUpload} />
                            </div>


                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                    </div>
                </div>
            </>
        )
    }
    else {
        return (
            <>
                <h1>please login to be able post</h1>
            </>
        )
    }
}

export default Post