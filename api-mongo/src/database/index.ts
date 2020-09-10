import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/mongo-rest', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

export default mongoose;
