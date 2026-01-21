import { Alert } from 'react-native';
import axios from 'axios';
import { useAuthStore } from '../authStore';
import { tokenStorage } from '../storage';
import { BASE_URL } from '../config';
import { resetAndNavigate } from '@/utils/Helpers';
import { useAnimeStore } from '../animeStore';
import { useWS } from '../sockets/WSProvider';


export const login = async (userInfo: { idToken: string }, updateAccessToken: () => void) => {
    try {
        console.log('Attempting login with Google ID Token');
        console.log('API URL:', `${BASE_URL}/auth/login`);
        
        const apiRes = await axios.post(`${BASE_URL}/auth/login`, { idToken: userInfo.idToken });
        console.log('Login response:', apiRes.data);
        
        const { tokens, user } = apiRes.data;
        
        if (!tokens || !tokens.access_token) {
            console.error('No tokens received in response');
            return false;
        }
        
        tokenStorage.set('accessToken', tokens.access_token);
        tokenStorage.set('refreshToken', tokens.refresh_token);

        const { setUser } = useAuthStore.getState();
        setUser(user);

        console.log('Login successful, updating access token');
        updateAccessToken();

        return true;
    } catch (error: any) {
        console.error('LOGIN ERROR:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        } else if (error.request) {
            console.error('Request made but no response:', error.request);
        }
        return false;
    }
};

export const logoutFromApp = async (disconnect: () => void) => {


    try {
        const { logout } = useAuthStore.getState();
        const { clearData } = useAnimeStore.getState();

        disconnect();

        logout();
        clearData();
        tokenStorage.clearAll();
        resetAndNavigate('/auth');
        console.log("LOGGED OUT AND WEBSOCKET DISCONNECTED");
    } catch (error) {
        console.log('Logout', error);
    }
};
