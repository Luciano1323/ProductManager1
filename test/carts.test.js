const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const app = require('../public/serverBase');  // Cambia esta ruta según la configuración de tu servidor

describe('Carts API', () => {
    it('should return a list of carts', (done) => {
        request(app)
            .get('/api/carts')
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.be.an('array');
                done();
            });
    });

    it('should add a new cart', (done) => {
        const newCart = {
            userId: 'user123'
        };

        request(app)
            .post('/api/carts')
            .send(newCart)
            .end((err, res) => {
                expect(res.status).to.equal(201);
                expect(res.body).to.have.property('id');
                expect(res.body.userId).to.equal('user123');
                done();
            });
    });

    it('should not add a cart without a userId', (done) => {
        const newCart = {};

        request(app)
            .post('/api/carts')
            .send(newCart)
            .end((err, res) => {
                expect(res.status).to.equal(400);
                expect(res.body).to.have.property('error');
                done();
            });
    });
});
