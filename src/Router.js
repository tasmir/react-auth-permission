import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom";
import Login from "./LoginComponent";
import Dashboard from "./Dashboard";
import {useAuth} from "./Auth/AuthProvider";

const Router = () => {
    const [logged] = useAuth();
    return <BrowserRouter>
        <Switch>
            {!logged && <>
                <Route path="/login" component={Login}/>
                <Redirect to="/login"/>
            </>}
            {logged && <>
                <Route path="/dashboard" component={Dashboard} exact/>
                <Redirect to="/dashboard"/>
            </>}
        </Switch>
    </BrowserRouter>;
};
export default Router;