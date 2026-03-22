import { io } from 'socket.io-client'
import { API_ROOT } from './apis/environment.js'
export const socketIoInstance = io(API_ROOT)