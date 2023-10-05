import styles from "../navbar.module.css";

export default function Item({pathname, title} : {pathname: string, title: string}) {
    const current = window.location.pathname;

    return (
        <div className={`${styles.item} ${current === pathname && styles.selected}`} onClick={() => window.location.replace(pathname)}>{title}</div>  
    );
}