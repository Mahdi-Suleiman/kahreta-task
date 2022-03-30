
import axios from "axios";
export default async function handler(req, res) {
    try {
        // console.dir(req.body)
        // console.log(...req.body)
        // console.log(req.body)`
        // console.log(req.headers)
        // // console.log(JSON.stringify(req.body))
        // // const data = await axios.post('http://localhost:4000/api/image-upload', req.body, req.headers)
        // //     .then(function (response) {
        // //         console.log(JSON.stringify(response.data));
        // //     })
        // //     .catch(function (error) {
        // //         console.log(error);
        // //     });

        // console.log(req.config.data)
        // var data = JSON.stringify(req.body);
        // var data = JSON.parse(req.body);
        // console.log(data.title)
        // var data = req.body;
        // var myBodyValue = data.title;
        // console.log(myBodyValue)
        /*
                console.dir(req.headers)
                console.dir(req.body)
                const body = JSON.stringify(req.body)
        
                await fetch('http://localhost:4000/api/image-upload', {
                    method: 'POST',
                    headers:
                        // 'Accept': 'application/json',
                        // 'Content-Type': 'application/json',
                        // 'Content-Type': 'multipart/form-data',
                        // Content-Type: multipart/form-data; boundary=???,
                        req.headers
                    ,
                    // body: { ...req.body }
                    body: req.body
                })
                    .then(response => {
                        console.log(response);
                    });
        */
        // res.status(200).json(data)
        // await axios({
        //     method: 'POST',
        //     url: 'http://localhost:4000/api/image-upload',
        //     // url: '/api/post',
        //     headers:
        //         // 'Authorization': `Bearer ${Cookies.get('access_token')}`,
        //         req.headers,

        //     data: req.body

        // })
        //     .then(response => {
        //         console.log(response);
        //     });
    } catch (error) {
        console.error(error)
        return res.status(error.status || 500).end(error.message)
    }
}