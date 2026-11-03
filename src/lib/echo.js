import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import api from './axios';

window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: false,
    enabledTransports: ['ws'],
    authorizer: (channel) => ({
        authorize: (socketId, callback) => {
            api.post('/broadcasting/auth', {
                socket_id: socketId,
                channel_name: channel.name,
            })
                .then((response) => callback(false, response.data))
                .catch((error) => callback(true, error));
        },
    }),
});


export default echo;