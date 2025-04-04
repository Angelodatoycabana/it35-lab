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
    IonFooter,
    IonAlert
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const Signup: React.FC = () => {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const handleRegister = async () => {
        if (!email.includes('@')) {
            setToastMessage("Invalid email format!");
            setShowToast(true);
            return;
        }

        if (password !== confirmPassword) {
            setToastMessage("Passwords do not match!");
            setShowToast(true);
            return;
        }

        try {
            // Attempt to sign up the user
            const { data, error } = await supabase.auth.signUp({
                email,
                password
            });

            if (error) {
                throw new Error(error.message);
            }

            console.log("Signup response:", data);

            setToastMessage("Account created! Check your email to verify.");
            setShowToast(true);

            // Redirect to login page after 3 seconds
            setTimeout(() => history.push('/it35-lab'), 3000);

        } catch (error) {
            console.error("Signup Error:", error);
            setAlertMessage(error instanceof Error ? error.message : "An unknown error occurred.");
            setShowAlert(true);
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Sign Up</IonTitle>
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
                    <IonItem>
                        <IonLabel position="floating">Confirm Password</IonLabel>
                        <IonInput 
                            type="password" 
                            value={confirmPassword} 
                            onIonChange={e => setConfirmPassword(e.detail.value!)} 
                        />
                    </IonItem>
                </IonList>
                
                <IonButton onClick={handleRegister} expand="full">Create Account</IonButton>
                <IonButton onClick={() => history.push('/it35-lab')} expand="full" color="light">Back to Login</IonButton>
            </IonContent>

            <IonFooter>
                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message={toastMessage}
                    duration={3000}
                />
            </IonFooter>

            <IonAlert
                isOpen={showAlert}
                onDidDismiss={() => setShowAlert(false)}
                header="Error"
                message={alertMessage}
                buttons={['OK']}
            />
        </IonPage>
    );
};

export default Signup;