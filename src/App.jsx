
import './App.css';
import { useAuth } from './context/AuthContext';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import LogoutButton from './LogoutButton';
import { useEffect } from 'react';
import echo from './lib/echo';
import api from './lib/axios';


function App() {
  const { user, loading } = useAuth();

   useEffect(() => {
        echo.connector.pusher.connection.bind('connected', () => {
            console.log('Reverb connected!');
        });
    }, []);

     useEffect(() => {
    if (!user) return;

    const beat = () => {
      if (document.visibilityState === 'visible') {
        api.post('/api/presence/heartbeat').catch((error) => {
          console.error('Heartbeat failed:', error);
        });
      }
    };

    // Send the first heartbeat immediately.
    beat();

    // Then send one every 25 seconds.
    const id = setInterval(beat, 25000);

    // Send a heartbeat immediately when the app becomes visible again.
    document.addEventListener('visibilitychange', beat);

    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', beat);
    };
  }, [user?.id]);

  useEffect(() => {
    if (!user) return;

    const channelName = `user.${user.id}`;

    echo.private(channelName)
        .listen('MessageSent', (e) => {
            console.log(
                'New message in',
                e.message.conversation_id,
                e.message
            );
        })
        .listen('MessageUpdated', (e) => {
            console.log('updated', e.message);
        })
        .listen('MessageDeleted', (e) => {
            console.log('deleted', e);
        })
        .listen('ReactionToggled', (e) => {
            console.log('reaction', e);
        })
        .listen('MessagesRead', (e) => {
            console.log('MessagesRead event received:', e);

            // TODO: Update that participant's last_read_message_id in state.
            // "Seen by" for my message m =
            // other participants whose last_read_message_id >= m.id.
        })
        .listen('UserTyping', (e) => {
            console.log('UserTyping event received:', e);
        })
          .listen('PresenceChanged', (e) => {
        console.log('PresenceChanged event received:', e);
        console.log(
          `User ${e.user_id} is ${e.is_online ? 'online' : 'offline'}`,
          'Last seen:', e.last_seen_at
        );

        // TODO: Update presence state for e.user_id.
      });

    return () => echo.leave(channelName);
}, [user?.id]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <p>Logged in as: {user ? user.name : 'not logged in'}</p>

      {user ? (
        <LogoutButton />
      ) : (
        <>
          <RegisterForm />
          <LoginForm />
        </>
      )}
    </div>
  );

}

export default App;