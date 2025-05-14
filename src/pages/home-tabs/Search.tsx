import { 
    IonButtons,
    IonContent, 
    IonHeader, 
    IonMenuButton, 
    IonPage, 
    IonTitle, 
    IonToolbar,
    IonSearchbar,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonSpinner,
    IonAvatar,
    IonRow,
    IonCol,
    IonText,
    IonPopover,
    IonModal,
    IonInput,
    IonFooter,
    IonAlert
} from '@ionic/react';
import { 
    searchOutline,
    createOutline,
    trashOutline,
    timeOutline,
    pencil
} from 'ionicons/icons';
import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { User } from '@supabase/supabase-js';
import { eventBus } from '../../utils/eventBus';

interface Post {
    post_id: string;
    user_id: number;
    username: string;
    avatar_url: string;
    post_content: string;
    post_created_at: string;
    post_updated_at: string;
}

const Search: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [popoverState, setPopoverState] = useState<{ open: boolean; event: Event | null; postId: string | null }>({ open: false, event: null, postId: null });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [postContent, setPostContent] = useState('');
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: authData } = await supabase.auth.getUser();
            if (authData?.user) {
                setUser(authData.user);
            }
        };
        fetchUser();
    }, []);

    // Function to handle search
    const handleSearch = async (value: string) => {
        setSearchText(value);
        setIsLoading(true);

        try {
            if (value.trim() === '') {
                setSearchResults([]);
            } else {
                const { data, error } = await supabase
                    .from('posts')
                    .select('*')
                    .ilike('post_content', `%${value}%`)
                    .order('post_created_at', { ascending: false });

                if (error) {
                    console.error('Error searching posts:', error);
                    setSearchResults([]);
                } else {
                    setSearchResults(data as Post[]);
                }
            }
        } catch (error) {
            console.error('Error in search:', error);
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Function to handle edit
    const handleEdit = (post: Post) => {
        setEditingPost(post);
        setPostContent(post.post_content);
        setIsModalOpen(true);
        setPopoverState({ open: false, event: null, postId: null });
    };

    // Function to save edited post
    const savePost = async () => {
        if (!postContent || !editingPost) return;
        
        try {
            const currentTime = new Date().toISOString();
            const { data, error } = await supabase
                .from('posts')
                .update({ 
                    post_content: postContent,
                    post_updated_at: currentTime
                })
                .match({ post_id: editingPost.post_id })
                .select('*');

            if (error) {
                console.error('Error updating post:', error);
            } else {
                const updatedPost = data[0] as Post;
                // Update the search results
                setSearchResults(searchResults.map(post => 
                    post.post_id === updatedPost.post_id ? updatedPost : post
                ));
                
                // Clear the form and close modal
                setPostContent('');
                setEditingPost(null);
                setIsModalOpen(false);
                setIsAlertOpen(true);

                // Notify other components about the update
                eventBus.emit('postUpdated');
            }
        } catch (error) {
            console.error('Error in save:', error);
        }
    };

    // Function to handle delete
    const handleDelete = async (postId: string) => {
        try {
            const { error } = await supabase
                .from('posts')
                .delete()
                .match({ post_id: postId });

            if (error) {
                console.error('Error deleting post:', error);
            } else {
                // Remove the deleted post from search results
                setSearchResults(searchResults.filter(post => post.post_id !== postId));
                setPopoverState({ open: false, event: null, postId: null });
                
                // Notify other components about the deletion
                eventBus.emit('postDeleted');
            }
        } catch (error) {
            console.error('Error in delete:', error);
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot='start'>
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Search Posts</IonTitle>
                </IonToolbar>
                <IonToolbar>
                    <IonSearchbar
                        value={searchText}
                        onIonInput={e => handleSearch(e.detail.value!)}
                        placeholder="Search your posts..."
                        animated
                        showCancelButton="focus"
                        style={{ '--background': 'var(--ion-color-light)' }}
                    />
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen className="ion-padding">
                {/* Loading State */}
                {isLoading && (
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: '200px' 
                    }}>
                        <IonSpinner name="crescent" />
                    </div>
                )}

                {/* Search Results */}
                {!isLoading && searchResults.length > 0 && (
                    <IonList>
                        {searchResults.map(post => (
                            <IonCard key={post.post_id} className="search-result-card">
                                <IonCardHeader>
                                    <IonRow>
                                        <IonCol size="1.85">
                                            <IonAvatar>
                                                <img alt={post.username} src={post.avatar_url} />
                                            </IonAvatar>
                                        </IonCol>
                                        <IonCol>
                                            <IonCardTitle style={{ marginTop: '10px' }}>{post.username}</IonCardTitle>
                                            <IonCardContent>
                                                {new Date(post.post_created_at).toLocaleString()}
                                            </IonCardContent>
                                        </IonCol>
                                        <IonCol size="auto">
                                            <IonButton
                                                fill="clear"
                                                onClick={(e) => setPopoverState({ open: true, event: e.nativeEvent, postId: post.post_id })}
                                            >
                                                <IonIcon color="secondary" icon={pencil} />
                                            </IonButton>
                                        </IonCol>
                                    </IonRow>
                                </IonCardHeader>
                                <IonCardContent>
                                    <IonText style={{ color: 'black' }}>
                                        <h1>{post.post_content}</h1>
                                    </IonText>
                                </IonCardContent>

                                {/* Popover with Edit and Delete options */}
                                <IonPopover
                                    isOpen={popoverState.open && popoverState.postId === post.post_id}
                                    event={popoverState.event}
                                    onDidDismiss={() => setPopoverState({ open: false, event: null, postId: null })}
                                >
                                    <IonButton fill="clear" onClick={() => handleEdit(post)}>
                                        Edit
                                    </IonButton>
                                    <IonButton fill="clear" color="danger" onClick={() => handleDelete(post.post_id)}>
                                        Delete
                                    </IonButton>
                                </IonPopover>
                            </IonCard>
                        ))}
                    </IonList>
                )}

                {/* No Results */}
                {!isLoading && searchText && searchResults.length === 0 && (
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center', 
                        justifyContent: 'center',
                        height: '200px',
                        color: 'var(--ion-color-medium)'
                    }}>
                        <IonIcon icon={searchOutline} style={{ fontSize: '48px' }} />
                        <p>No posts found matching "{searchText}"</p>
                    </div>
                )}

                {/* Initial State */}
                {!isLoading && !searchText && (
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center', 
                        justifyContent: 'center',
                        height: '200px',
                        color: 'var(--ion-color-medium)'
                    }}>
                        <IonIcon icon={searchOutline} style={{ fontSize: '48px' }} />
                        <p>Search your posts to edit or delete them</p>
                        <p style={{ fontSize: '0.9em', marginTop: '8px' }}>
                            Type in the search bar above to find your posts
                        </p>
                    </div>
                )}
            </IonContent>

            {/* Edit Modal */}
            <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Edit Post</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonInput 
                        value={postContent} 
                        onIonChange={e => setPostContent(e.detail.value!)} 
                        placeholder="Edit your post..." 
                    />
                </IonContent>
                <IonFooter>
                    <IonButton onClick={savePost}>Save</IonButton>
                    <IonButton onClick={() => setIsModalOpen(false)}>Cancel</IonButton>
                </IonFooter>
            </IonModal>

            {/* Success Alert */}
            <IonAlert
                isOpen={isAlertOpen}
                onDidDismiss={() => setIsAlertOpen(false)}
                header="Success"
                message="Post updated successfully!"
                buttons={['OK']}
            />
        </IonPage>
    );
};

export default Search;