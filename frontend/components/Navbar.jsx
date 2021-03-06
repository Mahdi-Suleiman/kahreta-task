import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import Link from 'next/link'


function Navbar() {
    // const loggedIn = Cookies.get('access_token')
    const [loggedIn, setLoggedIn] = useState(Cookies.get('access_token'))
    const router = useRouter()

    useEffect(() => {
        setLoggedIn(Cookies.get('access_token'))
    }, [Cookies.get('access_token'), loggedIn])

    // const [loggedIn, setLoggedIn] = useState(Cookies.get('access_token'))

    const goToLogin = () => {
        window.location.replace("/login");
        router.push('/login')
        router.replace('/login')
    }

    const Logout = () => {
        Cookies.remove('access_token')
        setLoggedIn('')
        goToLogin()
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand" href="#">Navbar</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <Link href="/feed">
                            <a className="nav-item nav-link active" href="">Feed</a>
                        </Link>
                        <Link href="/post">
                            <a className="nav-item nav-link active" href="">post</a>
                        </Link>
                        <Link href="/users">
                            <a className="nav-item nav-link active" href="">users</a>
                        </Link>
                        <Link href="/profile">
                            <a className="nav-item nav-link active" href="">profile</a>
                        </Link>
                        <Link href="/register">
                            <a className="nav-item nav-link active" href="">register</a>
                        </Link>
                        {/* <a className="nav-item nav-link" href="#">Features</a> */}
                        {
                            loggedIn ? <a href='' className="nav-item nav-link" onClick={Logout}> logout</a> : <Link href="/login" ><a href='' className="nav-item nav-link" >login</a></Link>
                        }
                    </div>
                </div>
            </nav>
        </>

    )
}

export default Navbar