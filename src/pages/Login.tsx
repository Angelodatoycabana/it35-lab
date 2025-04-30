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
import { supabase } from '../utils/supabaseClient';

const Login: React.FC = () => {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const doLogin = async () => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            setToastMessage(error.message);
            setShowToast(true);
        } else {
            setToastMessage("Login Successful!");
            setShowToast(true);
            
            setTimeout(() => {
                history.push('/it35-lab/app'); 
            }, 2000);
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
                        <IonLabel position="floating">Email</IonLabel>
                        <IonInput 
                            type="email" 
                            value={email} 
                            onIonChange={e => setEmail(e.detail.value!)} 
                        />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Password</IonLabel>
                        <IonInput 
                            type="password" 
                            value={password} 
                            onIonChange={e => setPassword(e.detail.value!)} 
                        />
                    </IonItem>
                </IonList>
                <IonButton onClick={doLogin} expand="full">Login</IonButton>
                <IonButton onClick={() => history.push('/signup')} expand="full" color="secondary">Register</IonButton>
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