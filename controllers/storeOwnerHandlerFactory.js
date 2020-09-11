const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures');
const AppError = require('./../utils/appError');

//Function to filter an object and only allow selected fields (check 'UpdateMe' function)
const filterObj = (obj, ...allowedFields) => {
   const newObj = {};
   Object.keys(obj).forEach(el => {
      if (allowedFields.includes(el)) newObj[el] = obj[el];
   });
   return newObj;
};

exports.verifyOwner = Model =>
   catchAsync(async (req, res, next) => {
      const loja = await Model.findById(req.params.id);

      if (!loja) {
         return next(new AppError('Nenhum documento encontrado com este ID', 404));
      }

      if (loja.storeOwner.id !== res.locals.storeOwner.id) {
         return next(new AppError('Esta loja não lhe pertence', 404));
      }

      next();
   });

exports.createOne = Model =>
   catchAsync(async (req, res, next) => {
      const doc = await Model.create(req.body);

      res.status(201).json({
         status: 'Success',
         data: {
            data: doc
         }
      });
   });

exports.getAll = Model =>
   catchAsync(async (req, res, next) => {
      //To allow for nested get revies of servico (hack)
      let filter = {};
      if (req.params.servicoId) filter = { servico: req.params.servicoId };

      //Execute query
      const features = new APIFeatures(Model.find(filter), req.query).filter().sort().limitFields().paginate();
      const doc = await features.query; //.explain();

      //SEND RESPONSE
      res.status(200).json({
         status: 'success',
         results: doc.length,
         data: {
            doc
         }
      });
   });

exports.getOne = (Model, popOptions) =>
   catchAsync(async (req, res, next) => {
      let query = Model.findById(req.params.id);
      if (popOptions) query = query.populate(popOptions);

      const doc = await query;

      if (!doc) {
         return next(new AppError('Nenhum serviço encontrado com este ID', 404));
      }

      res.status(200).json({
         status: 'success',
         data: {
            data: doc
         }
      });
   });

exports.updateOne = Model =>
   catchAsync(async (req, res, next) => {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
         new: true,
         runValidators: true
      });

      if (!doc) {
         return next(new AppError('Nenhum documento encontrado com este ID', 404));
      }

      res.status(200).json({
         status: 'Success',
         data: {
            doc
         }
      });
   });

exports.deleteOne = Model =>
   catchAsync(async (req, res, next) => {
      const doc = await Model.findByIdAndDelete(req.params.id);

      if (!doc) {
         return next(new AppError('No documents with this id', 404));
      }

      res.status(200).json({
         status: 'success',
         data: null
      });
   });

exports.updateMe = Model =>
   catchAsync(async (req, res, next) => {
      //Create error if user tries to update the password
      if (req.body.password || req.body.passwordConfimacao) {
         return next(new AppError('This route is not for password updates, please use *updatePassword*', 400));
      }

      //Filtering out unwanted fields that are not allowed to be updated
      const filteredBody = filterObj(req.body, 'nome', 'nomeUsuario', 'email', 'numeroTelemovel'); //can only update 'nome','nomeUsuario','email'
      if (req.file) filteredBody.fotografia = req.file.filename;
      //Update user document
      const doc = await Model.findByIdAndUpdate(
         req.storeOwner._id, //changed from '_id' to 'id'
         filteredBody,
         {
            new: true,
            runValidators: true
         }
      );

      res.status(200).json({
         status: 'success',
         data: {
            storeOwner: doc
         }
      });
   });

exports.deleteMe = Model =>
   catchAsync(async (req, res, next) => {
      await Model.findByIdAndUpdate(req.storeOwner.id, { active: false });

      res.status(204).json({
         status: 'success',
         data: null
      });
   });
