import socketMiddleware from '../middlewares/socketMiddleware.mjs'
import documentModel from '../models/documentModel.mjs';

const socketService = (io) => {
    io.use(socketMiddleware);

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on('joinDocument', (_id) => {
            socket.join(_id);
        });

        socket.on('documentUpdate', (data) => {
            const { _id, title, content, isCode } = data;

            socket.to(_id).emit('documentUpdate', { title, content, isCode });
            setTimeout( async function() {
                try {
                    await documentModel.updateDocument(socket.user, data);
                    const message = 'Document saved';

                    socket.emit('documentSaved',{ _id, message });
                } catch (error) {
                    console.error('Error updating document:', error);
                    socket.emit('documentError',{ message: 'Error updating document' });
                }
            }, 2000);

        socket.on('disconnect', () => {
            console.log(`User disconnect: ${socket.id}`);
        });
        });
    });
};

export default socketService;
