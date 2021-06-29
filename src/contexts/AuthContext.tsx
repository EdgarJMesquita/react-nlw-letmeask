import { createContext, useState, ReactNode, useEffect } from "react";
import { firebase, auth } from '../services/firebase';


type AuthContextType = {
    user: UserType | undefined;
    signInWithGoogle: ()=> Promise<void>;
}
type UserType = {
    id: string;
    name: string;
    avatar: string;
}
type AuthContextProviderProps = {
    children: ReactNode;
}

const AuthContext = createContext({} as AuthContextType);

function AuthContextProvider(props: AuthContextProviderProps){
    const [user,setUser] = useState<UserType>();

    useEffect(()=>{

        const unsubscribe = auth.onAuthStateChanged(user=>{
          if(user){
            const { displayName, photoURL, uid } = user;
    
            if(!displayName || !photoURL){
              throw new Error('Missing information from Google Account.');
            }
    
            setUser({
              id: uid,
              name: displayName,
              avatar: photoURL
            })
          }
        })
    
        return ()=> { 
          unsubscribe(); 
        }
      }, []);
    

    async function signInWithGoogle(){

        const provider = new firebase.auth.GoogleAuthProvider();
        const resultado = await auth.signInWithPopup(provider);
    
        if(resultado.user){
          const { displayName, photoURL, uid } = resultado.user;
          if(!displayName || !photoURL){
            throw new Error('Missing information from Google Account.');
          }
    
          setUser({
            id: uid,
            name: displayName,
            avatar: photoURL
          })
        }
      }

    return (
        <AuthContext.Provider value={{
            user,
            signInWithGoogle
          }}>
        {props.children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthContextProvider }