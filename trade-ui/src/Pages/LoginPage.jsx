import React, { useState } from 'react'
import { GoogleLogin } from "@react-oauth/google";
import FacebookButton from "../Component/FBLogin";

import { LoginApiUrl } from "../constants";

const responseOutput = (response) => {
  localStorage.setItem("isAuthenticated", true);
  window.location.replace('/trade');
};
const errorOutput = (error) => {
  console.log(error);
};
const handleFacebookLogin = (response) => {
  // Handle the Facebook login response
  localStorage.setItem("isAuthenticated", true);
  window.location.replace('/trade');
  console.log(response);
};

function LoginPage(event) {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const onUserNameChange = (event) => {
    setUserName(event.target.value);
  }

  const onPasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      var response = await fetch(LoginApiUrl, {
        method: 'POST',
        body: JSON.stringify({
          "userName": userName,
          "password": password
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      var isOK = await response.ok;
      if (isOK) {
        const data = await response.json();
        localStorage.setItem("loggedUser", JSON.stringify(data));
        responseOutput();
      }
      else {
        var status = await response.statusText;
        alert(status);
      }
    }
    catch (error) {
        console.log(error.message);
      }
    };

    return (

      <div className="container">
        <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                <div className="d-flex justify-content-center py-4">
                  <h2 className="d-none d-lg-block">Trading APP</h2>
                </div>
                <div className="card mb-3">
                  <div className="card-body">
                    <div className="pt-4 pb-2">
                      <h5 className="card-title text-center pb-0 fs-4">Login to Your Account</h5>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Username</label>
                      <div className="input-group has-validation">
                        <span className="input-group-text" id="inputGroupPrepend">@</span>
                        <input type="text" name="username" className="form-control" id="yourUsername" required onChange={onUserNameChange} />
                        <div className="invalid-feedback">Please enter your username.</div>
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Password</label>
                      <input type="password" name="password" className="form-control" id="yourPassword" required onChange={onPasswordChange} />
                      <div className="invalid-feedback">Please enter your password!</div>
                    </div>
                    <div className="col-12">
                      <button className="btn btn-primary w-100" type="submit" onClick={handleSubmit}>Login</button>
                    </div>
                    <div className="col-12">
                      <GoogleLogin onSuccess={responseOutput} onError={errorOutput} />
                    </div>
                    <div className="col-12">
                      <FacebookButton onFacebookLogin={handleFacebookLogin} />
                    </div>
                    <div className="col-12">
                      <p className="small mb-0">Don't have account? <span>Create an account</span></p>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

    )
  }

  export default LoginPage;