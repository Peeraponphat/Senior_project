import React, { useEffect, useState } from 'react';
import Nav from './Nav';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, selectLoading } from '../store/loading';
import Footer from './footer';
import History from './history';

function MyTrip() {
    return (
        <>
            <Nav />
            <History />
        </>
    );
}
export default MyTrip;
