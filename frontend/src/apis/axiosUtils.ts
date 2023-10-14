export const defineCancelApiObj = <T>(apiObj: Record<string, T>) => {
  const cancelApiObj: Record<string, { handleRequestCancel: () => AbortController }> = {};

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
