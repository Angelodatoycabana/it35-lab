import React, { useState } from 'react';
import { 
    IonButton,
    IonContent, 
    IonHeader, 
    IonPage, 
    IonTitle, 
    IonToolbar, 
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonToast,
    IonFooter
} from '@ionic/react';
import { useHistory } from 'react-router-dom'; 

const Login: React.FC = () => {
    const history = useHistory();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const doLogin = () => {
 
        const storedUsername = localStorage.getItem('username');
        const storedPassword = localStorage.getItem('password');


        if (!storedUsername || !storedPassword) {
            setToastMessage("No account found. Please register first.");
            setShowToast(true);
            return;
        }

        if (username === storedUsername && password === storedPassword) {
            setToastMessage("Login Successful!"); 
            setShowToast(true); 

         
            setTimeout(() => {
                history.push('/it35-lab/app'); 
            }, 2000); 
        } else {
            setToastMessage("Invalid username or password.");
            setShowToast(true); 
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Login</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className='ion-padding'>
                <IonList>
                    <IonItem>
                        <IonLabel position="floating">Username</IonLabel>
                        <IonInput value={username} onIonChange={e => setUsername(e.detail.value!)} />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Password</IonLabel>
                        <IonInput type="password" value={password} onIonChange={e => setPassword(e.detail.value!)} />
                    </IonItem>
                </IonList>
                <IonButton onClick={doLogin} expand="full">Login</IonButton>
                <IonButton onClick={() => history.push('/signup')} expand="full" color="secondary">Register</IonButton> {}
            </IonContent>
            <IonFooter>
                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message={toastMessage}
                    duration={2000}
                />
            </IonFooter>
        </IonPage>
    );
};

export default Login;