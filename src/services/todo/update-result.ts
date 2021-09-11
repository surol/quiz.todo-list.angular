export type UpdateResult<T> =
  | UpdateResult.Ok
  | UpdateResult.Conflict<T>;

export namespace UpdateResult {

  export interface Ok {

    readonly type: 'ok';

  }

  export interface Conflict<T> {

    readonly type: 'conflict';

    readonly proposedItem: T;

    readonly conflictingItem: T;

  }

}
