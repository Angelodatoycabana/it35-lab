import { useState, useEffect } from 'react';
import { 
    IonApp, 
    IonContent, 
    IonHeader, 
    IonPage, 
    IonTitle, 
    IonToolbar, 
    IonButton, 
    IonInput, 
    IonLabel, 
    IonModal, 
    IonFooter, 
    IonCard, 
    IonCardContent, 
    IonCardHeader, 
    IonCardSubtitle, 
    IonCardTitle, 
    IonAlert, 
    IonText, 
    IonAvatar, 
    IonCol, 
    IonGrid, 
    IonRow, 
    IonIcon, 
    IonPopover,
    IonButtons,
    IonChip,
    IonBadge,
    IonSpinner
} from '@ionic/react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabaseClient';
import { 
    heartOutline, 
    heart, 
    chatbubbleOutline, 
    paperPlaneOutline, 
    bookmarkOutline, 
    bookmark, 
    ellipsisHorizontal,
    timeOutline,
    personOutline
} from 'ionicons/icons';
import { eventBus } from '../utils/eventBus';
import './FeedContainer.css';

interface Post {
    post_id: string;
    user_id: number;
    username: string;
    avatar_url: string;
    post_content: string;
    post_created_at: string;
    post_updated_at: string;
    likes?: number;
    comments?: number;
}

const FeedContainer = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [postContent, setPostContent] = useState('');
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [popoverState, setPopoverState] = useState<{ open: boolean; event: Event | null; postId: string | null }>({ open: false, event: null, postId: null });
    const [isLoading, setIsLoading] = useState(true);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());

    const fetchPosts = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('post_created_at', { ascending: false });
        if (!error) {
            const postsWithStats = data.map(post => ({
                ...post,
                likes: Math.floor(Math.random() * 100), // Placeholder for likes
                comments: Math.floor(Math.random() * 20)  // Placeholder for comments
            }));
            setPosts(postsWithStats as Post[]);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        const fetchUser = async () => {
            const { data: authData } = await supabase.auth.getUser();
            if (authData?.user?.email?.endsWith('@nbsc.edu.ph')) {
                setUser(authData.user);
                const { data: userData, error } = await supabase
                    .from('users')
                    .select('user_id, username, user_avatar_url')
                    .eq('user_email', authData.user.email)
                    .single();
                if (!error && userData) {
                    setUser({ ...authData.user, id: userData.user_id });
                    setUsername(userData.username);
                }
            }
        };

        fetchUser();
        fetchPosts();

        eventBus.subscribe('postUpdated', fetchPosts);
        eventBus.subscribe('postDeleted', fetchPosts);

        return () => {
            eventBus.unsubscribe('postUpdated', fetchPosts);
            eventBus.unsubscribe('postDeleted', fetchPosts);
        };
    }, []);

    const createPost = async () => {
        if (!postContent || !user || !username) {
            console.log('Missing required data:', { postContent, user, username });
            return;
        }
    
        try {
            // Get user data from users table
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('user_id, user_avatar_url')
                .eq('user_email', user.email)
                .single();
    
            if (userError) {
                console.error('Error fetching user data:', userError);
                return;
            }
    
            const avatarUrl = userData?.user_avatar_url || 'https://ionicframework.com/docs/img/demos/avatar.svg';
    
            // Create the post
            const { data, error } = await supabase
                .from('posts')
                .insert([
                    { 
                        post_content: postContent, 
                        user_id: userData.user_id, // Use the user_id from users table
                        username: username,
                        avatar_url: avatarUrl,
                        post_created_at: new Date().toISOString(),
                        post_updated_at: new Date().toISOString()
                    }
                ])
                .select('*');
    
            if (error) {
                console.error('Error creating post:', error);
            } else if (data) {
                const newPost = {
                    ...data[0],
                    likes: 0,
                    comments: 0
                } as Post;
                setPosts([newPost, ...posts]);
                setPostContent('');
                // Notify other components about the new post
                eventBus.emit('postUpdated');
            }
        } catch (error) {
            console.error('Error in createPost:', error);
        }
    };

    const toggleLike = (postId: string) => {
        setLikedPosts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(postId)) {
                newSet.delete(postId);
            } else {
                newSet.add(postId);
            }
            return newSet;
        });
    };

    const toggleSave = (postId: string) => {
        setSavedPosts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(postId)) {
                newSet.delete(postId);
            } else {
                newSet.add(postId);
            }
            return newSet;
        });
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d`;
        return date.toLocaleDateString();
    };

    const deletePost = async (post_id: string) => {
        try {
            const { error } = await supabase
                .from('posts')
                .delete()
                .match({ post_id });
            
            if (error) {
                console.error('Error deleting post:', error);
            } else {
                setPosts(posts.filter(post => post.post_id !== post_id));
            }
        } catch (error) {
            console.error('Error in delete:', error);
        }
    };

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
                setPosts(posts.map(post => 
                    post.post_id === updatedPost.post_id ? updatedPost : post
                ));
                setPostContent('');
                setEditingPost(null);
                setIsModalOpen(false);
                setIsAlertOpen(true);
            }
        } catch (error) {
            console.error('Error in save:', error);
        }
    };

    return (
        <IonApp>
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Threads</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    {user ? (
                        <>
                            <IonCard className="create-post-card">
                                <IonCardContent>
                                    <IonRow>
                                        <IonCol size="2">
                                            <IonAvatar>
                                                <img 
                                                    alt={username || 'User'} 
                                                    src={user?.user_metadata?.user_avatar_url || 'https://ionicframework.com/docs/img/demos/avatar.svg'} 
                                                />
                                            </IonAvatar>
                                        </IonCol>
                                        <IonCol>
                                            <IonInput
                                                value={postContent}
                                                onIonChange={e => setPostContent(e.detail.value!)}
                                                placeholder="Start a thread..."
                                                className="thread-input"
                                            />
                                        </IonCol>
                                    </IonRow>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                                        <IonButton 
                                            onClick={createPost}
                                            disabled={!postContent.trim()}
                                            className="post-button"
                                        >
                                            Post
                                        </IonButton>
                                    </div>
                                </IonCardContent>
                            </IonCard>

                            {isLoading ? (
                                <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                                    <IonSpinner name="crescent" />
                                </div>
                            ) : (
                                posts.map(post => (
                                    <IonCard key={post.post_id} className="thread-card">
                                        <IonCardHeader>
                                            <IonRow>
                                                <IonCol size="2">
                                                    <IonAvatar>
                                                        <img alt={post.username} src={post.avatar_url} />
                                                    </IonAvatar>
                                                </IonCol>
                                                <IonCol>
                                                    <IonCardTitle className="username">{post.username}</IonCardTitle>
                                                    <IonCardSubtitle className="timestamp">
                                                        <IonIcon icon={timeOutline} />
                                                        {formatTimeAgo(post.post_created_at)}
                                                    </IonCardSubtitle>
                                                </IonCol>
                                                <IonCol size="auto">
                                                    <IonButton
                                                        fill="clear"
                                                        onClick={(e) => setPopoverState({ open: true, event: e.nativeEvent, postId: post.post_id })}
                                                    >
                                                        <IonIcon icon={ellipsisHorizontal} />
                                                    </IonButton>
                                                </IonCol>
                                            </IonRow>
                                        </IonCardHeader>
                                    
                                        <IonCardContent>
                                            <IonText className="post-content">
                                                {post.post_content}
                                            </IonText>
                                            
                                            <div className="post-actions">
                                                <IonButton fill="clear" onClick={() => toggleLike(post.post_id)}>
                                                    <IonIcon 
                                                        icon={likedPosts.has(post.post_id) ? heart : heartOutline} 
                                                        color={likedPosts.has(post.post_id) ? 'danger' : 'medium'}
                                                    />
                                                    <IonBadge color="medium">{post.likes}</IonBadge>
                                                </IonButton>
                                                
                                                <IonButton fill="clear">
                                                    <IonIcon icon={chatbubbleOutline} />
                                                    <IonBadge color="medium">{post.comments}</IonBadge>
                                                </IonButton>
                                                
                                                <IonButton fill="clear">
                                                    <IonIcon icon={paperPlaneOutline} />
                                                </IonButton>
                                                
                                                <IonButton fill="clear" onClick={() => toggleSave(post.post_id)}>
                                                    <IonIcon 
                                                        icon={savedPosts.has(post.post_id) ? bookmark : bookmarkOutline}
                                                        color={savedPosts.has(post.post_id) ? 'warning' : 'medium'}
                                                    />
                                                </IonButton>
                                            </div>
                                        </IonCardContent>
                                        
                                        <IonPopover
                                            isOpen={popoverState.open && popoverState.postId === post.post_id}
                                            event={popoverState.event}
                                            onDidDismiss={() => setPopoverState({ open: false, event: null, postId: null })}
                                        >
                                            <IonButton fill="clear" onClick={() => { setEditingPost(post); setIsModalOpen(true); setPopoverState({ open: false, event: null, postId: null }); }}>
                                                Edit
                                            </IonButton>
                                            <IonButton fill="clear" color="danger" onClick={() => { deletePost(post.post_id); setPopoverState({ open: false, event: null, postId: null }); }}>
                                                Delete
                                            </IonButton>
                                        </IonPopover>
                                    </IonCard>
                                ))
                            )}
                        </>
                    ) : (
                        <div className="loading-container">
                            <IonSpinner name="crescent" />
                            <IonLabel>Loading...</IonLabel>
                        </div>
                    )}
                </IonContent>

                <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Edit Thread</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setIsModalOpen(false)}>Cancel</IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <IonInput 
                            value={postContent} 
                            onIonChange={e => setPostContent(e.detail.value!)} 
                            placeholder="Edit your thread..." 
                            className="edit-input"
                        />
                    </IonContent>
                    <IonFooter>
                        <IonButton expand="block" onClick={savePost}>Save Changes</IonButton>
                    </IonFooter>
                </IonModal>

                <IonAlert
                    isOpen={isAlertOpen}
                    onDidDismiss={() => setIsAlertOpen(false)}
                    header="Success"
                    message="Thread updated successfully!"
                    buttons={['OK']}
                />
            </IonPage>
        </IonApp>
    );
};

export default FeedContainer;
