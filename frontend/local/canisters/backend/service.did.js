export const idlFactory = ({ IDL }) => {
  const Backend = IDL.Service({
    'add' : IDL.Func([IDL.Nat], [], []),
    'get' : IDL.Func([], [IDL.Nat], ['query']),
    'inc' : IDL.Func([], [], []),
  });
  return Backend;
};
export const init = ({ IDL }) => { return []; };
