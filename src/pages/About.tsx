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
  IonChip,
  IonGrid,
  IonRow,
  IonCol,
  IonButton
} from '@ionic/react';
import { 
  codeOutline,
  logoReact,
  logoIonic,
  logoJavascript,
  logoGithub,
  bookOutline,
  schoolOutline,
  trophyOutline,
  hardwareChipOutline,
  mailOutline,
  logoFacebook,
  callOutline,
  locationOutline
} from 'ionicons/icons';

const About: React.FC = () => {
const technologies = [
  { name: 'React', icon: logoReact, description: 'A JavaScript library for building user interfaces' },
  { name: 'Ionic', icon: logoIonic, description: 'Cross-platform mobile app development framework' },
  { name: 'JavaScript', icon: logoJavascript, description: 'Core programming language for web development' },
  { name: 'GitHub', icon: logoGithub, description: 'Version control and collaboration platform' }
];

const bestPractices = [
  'Write clean, maintainable code',
  'Follow component-based architecture',
  'Implement responsive design',
  'Use TypeScript for type safety',
  'Follow Git workflow best practices',
  'Write unit tests for components',
  'Document your code',
  'Optimize performance'
];

const learningResources = [
  {
    title: 'React Documentation',
    url: 'https://reactjs.org/docs/getting-started.html',
    type: 'Official Docs'
  },
  {
    title: 'Ionic Framework Guide',
    url: 'https://ionicframework.com/docs',
    type: 'Framework Guide'
  },
  {
    title: 'JavaScript MDN Web Docs',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    type: 'Language Guide'
  }
];

// Personal contact information
const contactInfo = {
  email: "20221190@nbsc.edu.ph",
  facebook: "https://www.facebook.com/Cabana.OhNana.11",
  phone: "09972959221",
  location: "Zone 3, Mantibugao, Manolo Fortich, Bukidnon",
  locationUrl: "https://www.google.com/maps/search/?api=1&query=Zone+3+Mantibugao+Manolo+Fortich+Bukidnon"
};

return (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot='start'>
          <IonMenuButton></IonMenuButton>
        </IonButtons>
        <IonTitle>About App Development</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen className="ion-padding">
      {/* Contact Information Section */}
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

      {/* Technologies Section */}
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>
            <IonIcon icon={hardwareChipOutline} className="ion-margin-end" />
            Technologies We Use
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonGrid>
            <IonRow>
              {technologies.map((tech, index) => (
                <IonCol size="6" key={index}>
                  <IonItem lines="none">
                    <IonIcon icon={tech.icon} slot="start" color="primary" />
                    <IonLabel>
                      <h2>{tech.name}</h2>
                      <p>{tech.description}</p>
                    </IonLabel>
                  </IonItem>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        </IonCardContent>
      </IonCard>

      {/* Best Practices Section */}
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>
            <IonIcon icon={trophyOutline} className="ion-margin-end" />
            Best Practices
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonList>
            {bestPractices.map((practice, index) => (
              <IonItem key={index}>
                <IonIcon icon={codeOutline} slot="start" color="primary" />
                <IonLabel>{practice}</IonLabel>
              </IonItem>
            ))}
          </IonList>
        </IonCardContent>
      </IonCard>

      {/* Learning Resources Section */}
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>
            <IonIcon icon={bookOutline} className="ion-margin-end" />
            Learning Resources
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonList>
            {learningResources.map((resource, index) => (
              <IonItem key={index} href={resource.url} target="_blank">
                <IonIcon icon={schoolOutline} slot="start" color="primary" />
                <IonLabel>
                  <h2>{resource.title}</h2>
                  <p>{resource.type}</p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        </IonCardContent>
      </IonCard>

      {/* Quick Tips Section */}
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Quick Tips</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <IonChip color="primary">Use Components</IonChip>
            <IonChip color="secondary">State Management</IonChip>
            <IonChip color="tertiary">Responsive Design</IonChip>
            <IonChip color="success">Testing</IonChip>
            <IonChip color="warning">Performance</IonChip>
            <IonChip color="danger">Security</IonChip>
          </div>
        </IonCardContent>
      </IonCard>
    </IonContent>
  </IonPage>
);
};

export default About;