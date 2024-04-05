import React from 'react';
import Nav from './Nav';
import ShowDetailUser from './showdetailuser';
import Footer from './footer';
function UserEdit() {
    return (
        <>
            <Nav />
            <div style={{ height:'85vh'}}>
            <ShowDetailUser />
            <Footer />
        </div >
        </>
    );
}

export default UserEdit;
