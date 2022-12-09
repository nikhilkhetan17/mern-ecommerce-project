function asyncHandler(fn) {
  return async function (req, res, next) {
    try {
      await fn(req, res, next);
    } catch (err) {
      res.status(err.code || 500).json({
        success: false,
        message: err.message,
      });
    }
  };
}

export default asyncHandler;

// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//       await fn(req, res, next);
//     } catch (err) {
//       res.status(err.code || 500).json({
//         success: false,
//         message: err.message,
//       });
//     }
//   };

// All 4 stages of writing asyncHandler HOF:

// const asyncHandler = () => {};
// const asyncHandler = (func) => {};
// const asyncHandler = (func) => () => {};
// const asyncHandler = (func) => async() => {}
