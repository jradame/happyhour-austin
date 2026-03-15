import { createContext, useContext, useEffect, useState } from "react";
import { auth, provider } from "../lib/firebase";
import {
	onAuthStateChanged,
	signInWithPopup,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut
} from "firebase/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsub = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
			setLoading(false);
		});
		return () => unsub();
	}, []);

	const loginWithGoogle = () => signInWithPopup(auth, provider);

	const loginWithEmail = (email, password) =>
		signInWithEmailAndPassword(auth, email, password);

	const signupWithEmail = (email, password) =>
		createUserWithEmailAndPassword(auth, email, password);

	const logout = () => signOut(auth);

	return (
		<AuthContext.Provider
			value={{ user, loading, loginWithGoogle, loginWithEmail, signupWithEmail, logout }}
		>
			{!loading && children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}