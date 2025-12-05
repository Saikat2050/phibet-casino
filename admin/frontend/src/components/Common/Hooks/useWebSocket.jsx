/* eslint-disable import/no-extraneous-dependencies */
import { io } from 'socket.io-client';
import { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
// import msgPackParser from 'socket.io-msgpack-parser'

// const MAX_RETRY = 1000;

const useWebSocket = (url, handleData, token) => {
	// const [retry, setRetry] = useState(0);
	const [isConnected, setIsConnected] = useState(false);
	const [error, setError] = useState('');
	const socket = useRef(null);

	// Event handler for successful connection
	const handleConnected = () => {
		// console.log(`socket connected`);
		setIsConnected(true);
	};

	// Event handler for socket errors
	const handleError = (err) => {
		setError(err || `Failed to connect socket on ${url}`);
	};

	// console.log('Socket  outside =', socket);

	const disconnectSocket = () => {
		// console.log(',,,,,,,,,,,,,,,,,,,,,,called disconnect', socket);
		// console.log('Socket  inside =', socket);

		if (socket.current) {
			// console.log(socket, ',,,,,,,,,,,,,,,,,,,,,,disconnected');
			socket.current.close();
		}
	};

	const connectSocket = () => {
		disconnectSocket();
		if (socket.current) {
			socket.current.connect();
		}
	};

	// Event handler for socket closure
	const handleDisconnect = (reason) => {
		setIsConnected(false);
		if (reason === 'io server disconnect') {
			// the disconnection was initiated by the server, you need to reconnect manually
			connectSocket();
		}
		// else the socket will automatically try to reconnect
	};

	const startConnection = () => {
		try {
			const newSocket = io(url, {
				// transports: ['websocket'],
				path: '/api/socket',
				// parser: msgPackParser,
				extraHeaders: token ? { 'access-token': token } : {},
			});

			newSocket.on('connect', handleConnected);
			newSocket.onAny(handleData); // handle all events
			newSocket.on('connect_error', handleError);
			newSocket.on('disconnect', handleDisconnect);
			socket.current = newSocket;

			window.privateSocket = newSocket; // If need to use at other places of project
		} catch (er) {
			console.log('Unable to connect to socket.');
		}
	};

	useEffect(() => {
		disconnectSocket();
		startConnection();

		return () => {
			disconnectSocket();
		};
		//   }, [url, retry]);
	}, [url, token]); // Reconnect when the URL changes

	// Function to send a message through the socket
	const sendMessage = (message) => {
		if (isConnected) {
			socket.current.send(JSON.stringify(message));
		} else {
			setError('Socket not connected. Message not sent:', message);
		}
	};

	return {
		socket,
		isConnected,
		sendMessage,
		error,
		connectSocket,
		disconnectSocket,
	};
};

export default useWebSocket;
