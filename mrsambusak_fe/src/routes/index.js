import React from "react";
import {
    BrowserRouter as Router,
    Routes as Switch,
    Route
  } from "react-router-dom";
import Register from "../pags/auth/register";
import GuestRequire from "../middlewares/guest_require";
import Login from "../pags/auth/login";
import Chat from "../pags/main/chat";
import AuthRequired from "../middlewares/auth_require";




export default function Routes(){

    return(
        <Router>

            <Switch>
                <Route path="/register" element={
                    <GuestRequire>
                        <Register />
                    </GuestRequire>
                } />

                <Route path="/" element={ //login page
                    <GuestRequire>
                        <Login />
                    </GuestRequire>
                } />
 
                <Route path="/chat" element={
                    <AuthRequired>
                        <Chat/>
                    </AuthRequired>
                }/>
            </Switch>
        </Router>
        )
    }

