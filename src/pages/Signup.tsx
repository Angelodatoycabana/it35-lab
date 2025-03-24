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
    IonModal,
    IonText
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

const Signup: React.FC = () => {
    const history = useHistory();
    const [regUsername, setRegUsername] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [showModal, setShowModal] = useState(false); 

    const handleRegister = () => {
        if (regPassword === confirmPassword) {
            localStorage.setItem('username', regUsername);
            localStorage.setItem('password', regPassword);
            setShowToast(true);
            setShowModal(true);
        } else {
            alert("Passwords do not match!");
        }
    };

    const handleConfirm = () => {
        setShowModal(false);
        history.push('/it35-lab');
    };

    const handleCancel = () => {
        setShowModal(false); 
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
                        <IonLabel position="floating">Username</IonLabel>
                        <IonInput value={regUsername} onIonChange={e => setRegUsername(e.detail.value!)} />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Password</IonLabel>
                        <IonInput type="password" value={regPassword} onIonChange={e => setRegPassword(e.detail.value!)} />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Confirm Password</IonLabel>
                        <IonInput type="password" value={confirmPassword} onIonChange={e => setConfirmPassword(e.detail.value!)} />
                    </IonItem>
                </IonList>
                <IonButton onClick={handleRegister} expand="full">Create Account</IonButton>
                <IonButton onClick={() => history.push('/it35-lab')} expand="full" color="light">Back to Login</IonButton>
            </IonContent>
            <IonFooter>
                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message="Account created successfully!"
                    duration={2000}
                />
            </IonFooter>

            {}
            <IonModal isOpen={showModal} onDidDismiss={handleCancel}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Confirm Registration</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonText>
                        <h2>Registration Successful!</h2>
                        <p>Do you want to proceed to the login page?</p>
                    </IonText>
                </IonContent>
                <IonFooter>
                    <IonButton expand="full" onClick={handleConfirm}>Yes</IonButton>
                    <IonButton expand="full" color="light" onClick={handleCancel}>No</IonButton>
                </IonFooter>
            </IonModal>
        </IonPage>
    );
};

export default Signup;