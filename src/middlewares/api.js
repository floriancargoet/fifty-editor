const createAPIMiddleware = options => store => next => async action => {
  if (!action.type.startsWith(options.actionNamespace || "API/")) {
    return next(action);
  }

  next({
    type: action.type + "_REQUEST",
    payload: action.payload
  });

  let response;
  try {
    response = await options.API[action.payload.method](...action.payload.args);
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
};

export { createAPIMiddleware };
