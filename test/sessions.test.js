const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const app = require('../public/serverBase');  // Cambia esta ruta según la configuración de tu servidor

describe('Sessions API', () => {
    it('should log in a user', (done) => {
        const userCredentials = {
            username: 'testuser',
            password: 'testpassword'
        };

        request(app)
            .post('/api/sessions/login')
            .send(userCredentials)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.have.property('token');
                done();
            });
    });

    it('should not log in with invalid credentials', (done) => {
        const userCredentials = {
            username: 'wronguser',
            password: 'wrongpassword'
        };

        request(app)
            .post('/api/sessions/login')
            .send(userCredentials)
            .end((err, res) => {
                expect(res.status).to.equal(401);
                expect(res.body).to.have.property('error');
                done();
            });
    });

    it('should log out a user', (done) => {
        request(app)
            .post('/api/sessions/logout')
            .end((err, res) => {
                expect(res.status).to.equal(200);
                done();
            });
    });
});
