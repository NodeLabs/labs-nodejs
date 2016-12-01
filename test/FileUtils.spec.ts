
import {expect} from "chai";
import {FileUtils} from '../src/utils/FileUtils';

describe('FileUtils:', () => {

   it('should do something', () => {
       expect(FileUtils).to.true;
   });

   describe('FileUtils.constructor', () => {

       it('should resolve a file path', () => {
           const file = new FileUtils('document1.txt');

           expect(file.getFileName()).to.equal('resources/document1.txt');

       });

   });

   describe('FileUtils.read', () => {

       it('should read a file and return this content (Event version)',  (done) => {

           const file = new FileUtils('document1.txt');

           file.read();

           file.on('success', (content: string) => {
               expect(content).to.be.a('string');
               expect(content).to.equal('azfzefze');
               done();
           });

       });


       it('should read a file and return this content (Promise version)',  (done) => {

           const file = new FileUtils('document1.txt');

           const promise = file.read();

           expect(promise).to.be.an.instanceof(Promise);

           promise.then((content: string) => {
               expect(content).to.be.a('string');
               expect(content).to.equal('azfzefze');
               done();
           });

       });

       it('should emit error (Event version)', (done) => {
           const file = new FileUtils('document-not-found.txt');

           file.read();

           file.on('error', (err: Error) => {
               expect(err).to.be.instanceof(Error);
               expect(err.message).to.be.equal('File not found');
               done();
           });

       });

       it('should emit error (Promise version)', (done) => {
           const file = new FileUtils('document-not-found.txt');

           const promise = file.read();

           expect(promise).to.be.an.instanceof(Promise);

           promise.catch((err: Error) => {
               expect(err).to.be.instanceof(Error);
               expect(err.message).to.be.equal('File not found');
               done();
           });
       });
   });

});