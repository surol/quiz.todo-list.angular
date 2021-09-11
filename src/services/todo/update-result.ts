export type UpdateResult<T> =
  | UpdateResult.Ok<T>
  | UpdateResult.Conflict<T>;

export namespace UpdateResult {

  export interface Ok<T> {

    readonly type: 'ok';

    readonly updated: T;

  }

  export interface Conflict<T> {

    readonly type: 'conflict';

    readonly proposed: T;

    readonly conflicting: T;

  }

}
