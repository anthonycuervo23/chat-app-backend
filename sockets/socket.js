const { validateJWT } = require('../helpers/jwt');
const { io } = require('../index');
const { userConnected, userDisconnected, saveMessage } = require('../controllers/socket');

// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    const [valid, uid] = validateJWT(client.handshake.headers['x-token']);

    //verificamos que tenga un JWT valido
    if (!valid){ 
        return client.disconnect();
    }

    console.log(uid);
    //Cliente autenticado
    userConnected(uid);

    // Ingresar al usuario a una sala de chat especifica
    client.join( uid );

    // Escuchar de el frontend el evente 'mensaje-privado'
    client.on('mensaje-privado', async(payload)=> {
        
        //Guardar mensaje en base de datos
        await saveMessage(payload);

        io.to(payload.to).emit('mensaje-privado', payload);
    });


    client.on('disconnect', () => {
        userDisconnected(uid);
    });

    // client.on('mensaje', ( payload ) => {
    //     console.log('Mensaje', payload);

    //     io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );

    // });


});
