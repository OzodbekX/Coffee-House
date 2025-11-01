import React, {useEffect} from "react";
import Banner from "../components/Banner";
import {CoffeeSlider} from "../components/CoffeeSlider";
import About from "../components/About";
import {AppDownloadSection} from "../components/DownloadApp";
import {useLocation, useNavigate} from "react-router-dom";

const Main: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace("#", "");
            const target = document.getElementById(id);
            if (target) {
                // Delay a bit to ensure components are rendered
                setTimeout(() => {
                    target.scrollIntoView({behavior: "smooth", block: "start"});
                    navigate("/")
                }, 200);
            }
        }
    }, [location]);

    return (
        <div>
            <Banner/>
            <CoffeeSlider/>
            <About/>
            <AppDownloadSection/>
        </div>
    );
};

export default Main;
