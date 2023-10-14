export const defineCancelApiObj = (apiObj: Record<string, any>) => {
  const cancelApiObj: Record<string, any> = {};

  Object.getOwnPropertyNames(apiObj).forEach((name) => {
    const cancelControllerObj = {
      controller: undefined as AbortController | undefined,
    };

    cancelApiObj[name] = {
      handleRequestCancel: () => {
        if (cancelControllerObj.controller) {
          cancelControllerObj.controller.abort();
        }
        cancelControllerObj.controller = new AbortController();
        return cancelControllerObj.controller;
      },
    };
  });
  return cancelApiObj;
};
