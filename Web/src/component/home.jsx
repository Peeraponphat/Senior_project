import React, { useEffect } from 'react';
import Nav from './Nav';
import AppStyles from '../App.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, selectLoading } from '../store/loading';
import ClipLoader from 'react-spinners/ClipLoader';
import Form from '../component/form';
import Footer from './footer';

function Home() {
    const loading = useSelector(selectLoading);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setLoading(true)); // Set loading to true
        setTimeout(() => {
            dispatch(setLoading(false));
        }, 100);
    }, [dispatch]);

    const app1Class = `${AppStyles.app1} ${loading ? '' : AppStyles.spaceBetween}`;

    return (
        <div className={app1Class}>
            {loading ? (
                <ClipLoader
                    className="w-full max-w-lg mx-auto"
                    color={'#32bd35'}
                    loading={loading}
                    size={100}
                />
            ) : (
                <>
                    <Nav />
                    <Form />
                    <Footer />
                </>
            )}
        </div>
    );
}

export default Home;
