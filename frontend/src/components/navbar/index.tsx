import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import styles from "./navbar.module.css";
import Item from "./item/item";

export default function NavBar() {
    const { isLoggedIn, loading, isBusiness } = useContext(AuthContext);

    if (!loading) {
        if (isLoggedIn) {
            return (
                <div className={styles.container}>
                    <Item title="My Account" pathname="/account" />
                    {isBusiness && 
                        <>
                            <Item title="Create a task" pathname="/create" />
                            <Item title="Manage submissions" pathname="/manage" />
                        </>
                    }
                    {!isBusiness && 
                        <>
                            <Item title="Explore competitions" pathname="/explore" />
                        </>
                    }
                </div>
            );
        } else {
            return (
                <div className={styles.container}>
                    <Item title="Login" pathname="/login" />
                    <Item title="Signup" pathname="/signup" />
                </div>
            );
        }
    } else {
        return null;
    }
}