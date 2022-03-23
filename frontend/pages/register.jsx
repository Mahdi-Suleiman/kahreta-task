import React, { useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import client from '../apollo-client'
import { useCookies } from 'react-cookie'

function Register() {
    const [cookies, setCookie, removeCookie] = useCookies(['access_token']);


    const [email, setemail] = useState()
    const [password, setPassword] = useState()
    const [name, setName] = useState()

    const handleEmailChange = (e) => {
        setemail(e.target.value)
    }
    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }
    const handleNameChange = (e) => {
        setName(e.target.value)
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(email)
        console.log(password)
        console.log(name)

        const response = await client.mutate({
            mutation: gql`
        mutation Signup($email: String!, $password: String!, $name: String!) {
                signup(email: $email, password: $password, name: $name) {
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
                password: password,
                name: name
            },

        })
        // console.log('response', response)
        if (response) {
            console.log(response.data.signup.token)
            // localStorage.setItem('token', JSON.stringify(response.data.login.token))
            setCookie('access_token', response.data.signup.token)

            alert('account created successfully')
            // navigate('/feed')
        } else {
            alert("incorrect credetials")
        }
    }
    return (
        <>
            <div>Register</div>
            <section className="vh-100 gradient-custom">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                            <div className="card bg-dark text-white" style={{ borderRadius: "1rem" }}>
                                <div className="card-body p-5 text-center">
                                    <form action="" method="post" onSubmit={handleSubmit}>

                                        <div className="mb-md-5 mt-md-4 pb-5">

                                            <h2 className="fw-bold mb-2 text-uppercase">Register</h2>
                                            <p className="text-white-50 mb-5">Please enter your info!</p>

                                            <div className="form-outline form-white mb-4">
                                                <label className="form-label" htmlFor="typeEmailX">Name</label>
                                                <input type="text" name='name' id="typeEmailX" className="form-control form-control-lg" value={name} onChange={handleNameChange} />
                                            </div>

                                            <div className="form-outline form-white mb-4">
                                                <label className="form-label" htmlFor="typeEmailX">Email</label>
                                                <input type="email" name='email' id="typeEmailXx" className="form-control form-control-lg" value={email} onChange={handleEmailChange} />
                                            </div>

                                            <div className="form-outline form-white mb-4">
                                                <label className="form-label" htmlFor="typePasswordX">Password</label>
                                                <input type="password" name='password' id="typePasswordX" className="form-control form-control-lg" value={password} onChange={handlePasswordChange} />
                                            </div>

                                            <p className="small mb-5 pb-lg-2"><a className="text-white-50" href="#!">Forgot password?</a></p>

                                            <button className="btn btn-outline-light btn-lg px-5" type="submit">Register</button>

                                            <div className="d-flex justify-content-center text-center mt-4 pt-1">
                                                <a href="#!" className="text-white"><i className="fab fa-facebook-f fa-lg"></i></a>
                                                <a href="#!" className="text-white"><i className="fab fa-twitter fa-lg mx-4 px-2"></i></a>
                                                <a href="#!" className="text-white"><i className="fab fa-google fa-lg"></i></a>
                                            </div>

                                        </div>

                                        <div>
                                            <p className="mb-0">Do not have an account? <a href="#" className="text-white-50 fw-bold">Sign Up</a></p>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>

    )
}

export default Register