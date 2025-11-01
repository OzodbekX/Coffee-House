import React from "react";
import "../styles/Footer.scss";

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <p>© {new Date().getFullYear()} My React TS App. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
