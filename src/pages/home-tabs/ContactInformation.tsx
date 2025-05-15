import { 
    IonButtons,
    IonContent, 
    IonHeader, 
    IonMenuButton, 
    IonPage, 
    IonTitle, 
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonButton,
    IonText
} from '@ionic/react';
import { 
    mailOutline,
    logoFacebook,
    callOutline,
    locationOutline,
    logoInstagram,
    logoGithub
} from 'ionicons/icons';

const ContactInformation: React.FC = () => {
  const contactInfo = {
    email: "20221190@nbsc.edu.ph",
    facebook: "https://www.facebook.com/Cabana.OhNana.11",
    phone: "09972959221",
    location: "Mantibugao, Manolo Fortich, Bukidnon",
    locationUrl: "https://www.google.com/maps/search/?api=1&query=Zone+3+Mantibugao+Manolo+Fortich+Bukidnon",
    instagram: "https://www.instagram.com/anjuuuqt/",
    github: "https://github.com/Angelodatoycabana"
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Contact Information</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        {/* Primary Contact Information */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              Contact Information
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem>
                <IonIcon icon={mailOutline} slot="start" color="primary" />
                <IonLabel>
                  <h2>Email</h2>
                  <p>{contactInfo.email}</p>
                </IonLabel>
                <IonButton slot="end" href={`mailto:${contactInfo.email}`} fill="clear">
                  Contact
                </IonButton>
              </IonItem>
              <IonItem>
                <IonIcon icon={callOutline} slot="start" color="primary" />
                <IonLabel>
                  <h2>Phone</h2>
                  <p>{contactInfo.phone}</p>
                </IonLabel>
                <IonButton slot="end" href={`tel:${contactInfo.phone}`} fill="clear">
                  Call
                </IonButton>
              </IonItem>
              <IonItem>
                <IonIcon icon={locationOutline} slot="start" color="primary" />
                <IonLabel>
                  <h2>Location</h2>
                  <p>{contactInfo.location}</p>
                </IonLabel>
                <IonButton slot="end" href={contactInfo.locationUrl} target="_blank" fill="clear">
                  Map
                </IonButton>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* Social Media Accounts */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              Social Media
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem>
                <IonIcon icon={logoFacebook} slot="start" color="primary" />
                <IonLabel>
                  <h2>Facebook</h2>
                  <p>{contactInfo.facebook}</p>
                </IonLabel>
                <IonButton slot="end" href={contactInfo.facebook} target="_blank" fill="clear">
                  Visit
                </IonButton>
              </IonItem>
              <IonItem>
                <IonIcon icon={logoInstagram} slot="start" color="primary" />
                <IonLabel>
                  <h2>Instagram</h2>
                  <p>{contactInfo.instagram}</p>
                </IonLabel>
                <IonButton slot="end" href={contactInfo.instagram} target="_blank" fill="clear">
                  Visit
                </IonButton>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* Other Accounts */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              Other Accounts
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem>
                <IonIcon icon={logoGithub} slot="start" color="primary" />
                <IonLabel>
                  <h2>GitHub</h2>
                  <p>{contactInfo.github}</p>
                </IonLabel>
                <IonButton slot="end" href={contactInfo.github} target="_blank" fill="clear">
                  Visit
                </IonButton>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default ContactInformation;