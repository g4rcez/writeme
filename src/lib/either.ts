export namespace Either {
  export type Error<E> = { error: E; success?: undefined };

  export type Success<S> = { error?: undefined; success: S };

  type Either<L, R> = Error<L> | Success<R>;

  class EitherNoValueError extends Error {
    public constructor() {
      super();
      this.message = "Either require error or success, undefined for both is not accepted";
    }
  }

  const create = <E, S>(error: E, success: S) => {
    if (error !== undefined) {
      return { error, success: undefined };
    }
    if (success !== undefined) {
      return { success, error: undefined };
    }
    throw new EitherNoValueError();
  };
  export const isError = <E, S>(e: Either<E, S>): e is Error<E> => e.error !== undefined;

  export const isSuccess = <E, S>(e: Either<E, S>): e is Success<S> => e.success !== undefined;

  export const error = <E>(e: E): Error<E> => create<E, undefined>(e, undefined) as Error<E>;

  export const success = <S>(s: S): Success<S> => create<undefined, S>(undefined, s) as Success<S>;
}
