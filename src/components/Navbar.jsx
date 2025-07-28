import styles from '../styles/Navbar.module.css';

const Navbar = () => {
    return (
    <>
        <div className={styles.container}>
            <nav>
                <ul>
                    <li>Logo</li>
                    <li>Keluhan</li>
                </ul>
            </nav>
        </div>
    </> );
}

export default Navbar;