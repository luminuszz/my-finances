export class Left<LeftValue, RightValue> {
  // eslint-disable-next-line no-useless-constructor
  constructor(public readonly value: LeftValue) {}

  isRight(): this is Right<LeftValue, RightValue> {
    return false
  }

  isLeft(): this is Left<LeftValue, RightValue> {
    return true
  }
}

export class Right<LeftValue, RightValue> {
  // eslint-disable-next-line no-useless-constructor
  constructor(public readonly value: RightValue) {}

  isRight(): this is Right<LeftValue, RightValue> {
    return true
  }

  isLeft(): this is Left<LeftValue, RightValue> {
    return false
  }
}

export type Either<L, R> = Left<L, R> | Right<L, R>

export const left = <LeftValue, RightValue>(
  value: LeftValue,
): Either<LeftValue, RightValue> => new Left(value)

export const right = <LeftValue, RightValue>(
  value: RightValue,
): Either<LeftValue, RightValue> => new Right(value)
