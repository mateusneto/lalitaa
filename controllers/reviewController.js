// create for both 'products' and 'stores'
exports.nothing = (req, res, next) => {
   res.status(500).json({
      status: 'error',
      message: 'This route is not Implemented, please use SignUp'
   });
};
