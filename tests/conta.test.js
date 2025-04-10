const request = require('supertest');
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({errorFormat: 'minimal'});

const contaRoutes = require('../routes/contaRoutes');

const app = express();

app.use(express.json())
app.use('/contas', contaRoutes)

describe('testando endpoits de contas', () => {
    
    beforeAll(async () => [
        await prisma.conta.deleteMany({})
    ])

    afterAll(async () => [
        await prisma.conta.deleteMany({})
    ])
    
    let conta = {
        "titular": "livraria",
        "saldo": 100
    }

    let contaId;

    it('POST /contas', async () => {
        let response = await request(app).post('/contas').send(conta)
        expect(response.status).toBe(200)

        contaId = response.body.id;
    })

    it('GET /contas', async () => {
        let response = await request(app).get('/contas')
        expect(response.status).toBe(200)
        expect(response.body.length).toBe(1)
    })

    it('GET /contas/:id', async () => {
        let response = await request(app).get('/contas/')
        expect(response.status).toBe(200)
        expect(response.body.length).toBe(1)
        expect(response.body[0].id).toBe(contaId)
    })

    it('PUT /contas/:id', async () => {
        let response = await request(app).put(`/contas/${contaId}`).send({"saldo": 10})
        expect(response.status).toBe(200)
        expect(response.body.saldo).toBe(10)
        expect(response.body.saldo).not.toBe(100)
    })
    
    it('DELETE /contas/:id', async () => {
        let response = await request(app).delete(`/contas/${contaId}`)
        expect(response.status).toBe(200)
    })
})