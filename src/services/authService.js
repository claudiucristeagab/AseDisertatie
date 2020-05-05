import * as jwt from 'jsonwebtoken';
import moment from 'moment';

class AuthService {
    tokenKey = 'auth_token';

    getToken = () => localStorage.getItem(this.tokenKey);

    saveToken = (token) => localStorage.setItem(this.tokenKey, token);

    tokenIsValid = (token) => moment().isBefore(this.getExpiration(token)); 

    getExpiration = (token) => {
        const decodedToken = jwt.decode(token);
        return moment.unix(decodedToken.exp);
    } 

    isAuthenticated(){
        const token = this.getToken();

        if(token && this.tokenIsValid(token)){
            return true;
        }

        return false;
    }

    invalidateUser = () => {
        localStorage.removeItem(this.tokenKey);
    }
}

export default new AuthService()