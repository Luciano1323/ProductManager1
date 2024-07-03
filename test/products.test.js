const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const app = require('../public/serverBase');  // Cambia esta ruta según la configuración de tu servidor

describe('Products API', () => {
    it('should return a list of products', (done) => {
        request(app)
            .get('/api/products')
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.be.an('array');
                done();
            });
    });

    it('should add a new product', (done) => {
        const newProduct = {
            name: 'Test Product',
            price: 100
        };

        request(app)
            .post('/api/products')
            .send(newProduct)
            .end((err, res) => {
                expect(res.status).to.equal(201);
                expect(res.body).to.have.property('id');
                expect(res.body.name).to.equal('Test Product');
                done();
            });
    });

    it('should not add a product without a name', (done) => {
        const newProduct = {
            price: 100
        };

        request(app)
            .post('/api/products')
            .send(newProduct)
            .end((err, res) => {
                expect(res.status).to.equal(400);
                expect(res.body).to.have.property('error');
                done();
            });
    });
});
