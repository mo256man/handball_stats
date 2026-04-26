export class Player {
  constructor(data) {
    this.playerId = data.playerId;
    this.number = data.number;
    this.position = data.position;
    this.name = data.name;
    this.shortName = data.shortName;
    this.isOnBench = data.isOnBench ?? true;
  }
}
