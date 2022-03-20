import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { gql, useMutation } from '@apollo/client'
import client from '../apollo-client'
import '../styles/login.module.css'
import { useCookies } from 'react-cookie'

function Login() {
    // const navigate = useNavigate()
    const [cookies, setCookie, removeCookie] = useCookies(['access_token']);

    const [email, setemail] = useState()
    const [password, setPassword] = useState()

    const handleEmailChange = (e) => {
        setemail(e.target.value)
        // console.log(email)
    }
    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
        // console.log(password)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        // console.log(email)
        // console.log(password)
        const response = await client.mutate({
            mutation: gql`
         mutation Login($email: String!, $password: String!) {
                login(email: $email, password: $password) {
                    token
                    user {
                    id
                    name
                    email
                    }
                }
            }
            `,
            variables: {
                email: email,
                password: password
            },

        })
        // console.log(response)
        if (response) {
            console.log(response.data.login.token)
            // localStorage.setItem('token', JSON.stringify(response.data.login.token))
            // document.cookie = `access_token=${response.data.login.token}`;
            // const date = new Date()
            setCookie('access_token', response.data.login.token)
            alert('you are now logged in')
            // navigate('/feed')
        } else {
            alert("incorrect credetials")
        }

    }
    return (
        <>
            <section className="vh-100 gradient-custom">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                            <div className="card bg-dark text-white" style={{ borderRadius: "1rem" }}>
                                <div className="card-body p-5 text-center">
                                    <form action="" method="post" onSubmit={handleSubmit}>

                                        <div className="mb-md-5 mt-md-4 pb-5">

                                            <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                                            <p className="text-white-50 mb-5">Please enter your login and password!</p>

                                            <div className="form-outline form-white mb-4">
                                                <label className="form-label" htmlFor="typeEmailX">Email</label>
                                                <input type="email" name='email' id="typeEmailX" className="form-control form-control-lg" value={email} onChange={handleEmailChange} />
                                            </div>

                                            <div className="form-outline form-white mb-4">
                                                <label className="form-label" htmlFor="typePasswordX">Password</label>
                                                <input type="password" name='password' id="typePasswordX" className="form-control form-control-lg" value={password} onChange={handlePasswordChange} />
                                            </div>

                                            <p className="small mb-5 pb-lg-2"><a className="text-white-50" href="#!">Forgot password?</a></p>

                                            <button className="btn btn-outline-light btn-lg px-5" type="submit">Login</button>

                                            <div className="d-flex justify-content-center text-center mt-4 pt-1">
                                                <a href="#!" className="text-white"><i className="fab fa-facebook-f fa-lg"></i></a>
                                                <a href="#!" className="text-white"><i className="fab fa-twitter fa-lg mx-4 px-2"></i></a>
                                                <a href="#!" className="text-white"><i className="fab fa-google fa-lg"></i></a>
                                            </div>

                                        </div>

                                        <div>
                                            <p className="mb-0">Don't have an account? <a href="#!" className="text-white-50 fw-bold">Sign Up</a></p>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <button type='button' onClick={() => {
                // // console.log(document.cookie)
                // function getCookie(name) {
                //     const value = `; ${document.cookie}`;
                //     console.log(value)
                //     const parts = value.split(`; ${name}=`);
                //     console.log(parts)
                //     if (parts.length === 2) return parts.pop().split(';').shift();
                // }

                // console.log(cookies.access_token)
                removeCookie('access_token')
            }}>Remove cookie</button>

            {/* <div>Login</div>
            <form action="" method="post" onSubmit={handleSubmit}>
                <input type="email" name="email" id="email" placeholder='email' value={email} onChange={handleEmailChange} />
                <input type="password" name="password" id="password" placeholder='password' value={password} onChange={handlePasswordChange} />
                <input type="submit" value="login" />
            </form> */}
        </>
    )
}

export default Login