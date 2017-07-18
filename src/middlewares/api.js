async function handleAPIAction(API, action, next) {
  next({
    type: action.type + "_REQUEST",
    payload: action.payload
  });

  let response;
  try {
    response = await API[action.payload.method](...action.payload.args);
  }
  catch (error) {
    return next({
      type: action.type + "_FAILURE",
      payload: {
        ...action.payload,
        error
      }
    });
  }
  return next({
    type: action.type + "_SUCCESS",
    payload: {
      ...action.payload,
      response
    }
  });
}

const createAPIMiddleware = options => store => next => async action => {
  const APIByNamespace = options.APIByNamespace || {};
  let API;
  Object.keys(APIByNamespace).every(namespace => {
    if (action.type.startsWith(namespace)) {
      API = APIByNamespace[namespace];
      return false; // break loop
    }
    return true;
  });
  if (API) {
    return handleAPIAction(API, action, next);
  }
  return next(action);
};

export { createAPIMiddleware };
