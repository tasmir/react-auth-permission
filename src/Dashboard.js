import React, { useState, useEffect } from 'react';
import {authFetch, Permissions, MyComponent} from "./Auth/AuthProvider"
import Logout from "./Logout";
import { PermissibleRender } from '@brainhubeu/react-permissible';
import CheckComponentS from "./CheckComponentS";

const Dashboard = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        authFetch('/posts')
            .then(r => r.json())
            .then(_posts => setPosts(_posts))
    }, []);

    return <div>
        {posts.map(post => <div key={post.id}>
            {post.message}
        </div>) }
        <Logout/>



        <PermissibleRender
            userPermissions={MyComponent().split(',')}
            requiredPermissions={["user_list"]}
            renderOtherwise="Access Denied" // optional
            oneperm // optional
        >
            <CheckComponentS/>
        </PermissibleRender>


    </div>
};

export default Dashboard;