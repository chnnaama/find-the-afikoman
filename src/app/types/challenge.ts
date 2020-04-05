export class Challenge {
  id: string;
  uid: string;
  postProcess = {
    tiles: false,
    thumbnail: false
  };
  description = '';
  photoCredit = '';
  photoCreditUrl = '';
  afikomanRect = {
    x: 0,
    y: 0,
    width: 500,
    height: 500,
  }
  width: number;
  height: number;

  constructor(id: string, uid: string) {
    this.id = id;
    this.uid = uid;
  }

}
