import { getSources } from "../db/source";
import { UserIdType } from "../db/types";

export class SourcesService {
  private static _instance: SourcesService;
  private constructor() {}

  public static get Instance() {
    return this._instance || (this._instance = new SourcesService());
  }

  async getSources(userId: UserIdType) {
    return getSources(userId);
  }
}
