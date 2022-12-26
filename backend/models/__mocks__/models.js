const Player = {
  findOne: () => {
    const player = {
      playerId: '13a54721-0312-4483-9703-4d9ad21c4ba9',
      winner: false,
      move: true,
      save: jest.fn(),
    };
    return player;
  },
};

export default Player;
