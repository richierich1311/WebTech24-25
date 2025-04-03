import { Link } from 'react-router-dom';

const Footer = () => (
    <footer>
        <p>&copy; 2024 ProTasker. Alle Rechte vorbehalten.</p>
        <Link to="/impressum" className="footer-link">Impressum</Link> |
        <Link to="/kontakt" className="footer-link">Kontakt</Link>
    </footer>
);

export default Footer;

