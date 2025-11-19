export class Rooms {
    constructor() {
        this.rooms = [];
    }

    createRoom({ name, maxPlayers, cardLimit }) {
        const id = Math.random().toString(36).substring(2, 8).toUpperCase();

        const room = {
            id,
            name,
            maxPlayers,
            cardLimit,
            players: []
        };

        this.rooms.push(room);
        return room;
    }

    joinRoom(roomId, playerName, socketId) {
        const room = this.rooms.find(r => r.id === roomId);
        if (!room) return null;

        room.players.push({ name: playerName, socketId });
        return room;
    }

    removePlayer(socketId) {
        this.rooms.forEach(room => {
            room.players = room.players.filter(p => p.socketId !== socketId);
        });
        this.rooms = this.rooms.filter(room => room.players.length > 0);
    }

    getRooms() {
        return this.rooms;
    }
}
