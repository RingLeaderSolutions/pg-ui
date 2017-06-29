export const reduceReducers = (...reducers : Array<any>) => {
  return (previous: any, current: any) =>
    reducers.reduce(
      (p: any, r: any) => r(p, current),
      previous
    );
}