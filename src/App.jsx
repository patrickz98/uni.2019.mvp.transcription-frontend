import React from 'react';
import SignInPage from './SignInPage'
import SignUpPage from './SignUpPage'
import DashboardPage from './DashboardPage'
import EditingPage from './EditingPage'
import WelcomePage from './WelcomePage'

class App extends React.Component
{
    LOGTAG = "App";

    constructor(props)
    {
        super(props);
        this.state = {};
    }

    render()
    {
        console.debug(this.LOGTAG, "render");
        console.debug(this.LOGTAG, "window.location", window.location);

        var urlParams = new URLSearchParams(window.location.search);
        var page = urlParams.get("page");
        console.debug(this.LOGTAG, "page", page);

        if (page === "SignUp")
        {
            return <SignUpPage />
        }

        if (page === "dashboard")
        {
            return <DashboardPage />
        }

        if (page === "edit")
        {
            return <EditingPage />
        }

        if (page === "SignIn")
        {
            return <SignInPage />
        }

        return <WelcomePage />
    }

}

export default App;
