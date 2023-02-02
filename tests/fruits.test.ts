import app from "../src/index";
import supertest from "supertest";
import fruitsRepository from "repositories/fruits-repository";

const api = supertest(app);

describe("GET: /fruits", () => {
    it("should respond with status 200 and ticket data", async () => {
        //supertest faz a requisição
        const result = await api.get("/fruits");
        //matcher para status code
        expect(result.status).toBe(200);

        expect(result.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    price: expect.any(Number),
                }),
            ])
        );
    });
});

describe("GET: /fruits/:id", () => {
    it("should respond with status 200 and ticket data", async () => {
        //supertest faz a requisição
        const result = await api.get("/fruits/3");
        //matcher para status code
        expect(result.status).toBe(200);

        expect(result.body).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                name: expect.any(String),
                price: expect.any(Number),
            })
        );
    });
});

describe("POST: /fruits/", () => {
    it("should respond with status 201 and it should insert the new fruit in the database", async () => {
        //supertest faz a requisição
        const fruitsLengthBefore = fruitsRepository.getFruits().length;

        const fruitBody = {
            name: "jaca",
            price: 15,
        };

        const result = await api.post("/fruits").send(fruitBody);

        const fruitsLengthAfter = fruitsRepository.getFruits().length;

        expect(fruitsLengthAfter).toBe(fruitsLengthBefore + 1);

        const newFruit = fruitsRepository.getFruits()[fruitsLengthAfter - 1];
        expect(newFruit).toMatchObject(fruitBody);
    });
});
