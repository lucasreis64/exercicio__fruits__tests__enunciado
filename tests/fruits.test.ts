import app from "../src/index";
import supertest from "supertest";
import fruitsRepository, { Fruit } from "repositories/fruits-repository";
import fruits from "data/fruits";

const api = supertest(app);

function clearData() {
    while (fruits.length > 0) fruits.shift();
}

describe("GET: /fruits", () => {

    beforeAll(() => {
        clearData();
        const maça: Fruit = {
            id: 1,
            name: "maçã",
            price: 5,
        };
        const banana: Fruit = {
            id: 2,
            name: "banana",
            price: 3,
        };
        const manga: Fruit = {
            id: 3,
            name: "manga",
            price: 8,
        };
        fruits.push(maça, banana, manga);
    });

    afterAll(clearData);

    it("should respond with status 200 and fruits data", async () => {

        const result = await api.get("/fruits");

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
    beforeAll(() => {
        clearData();
        const maça: Fruit = {
            id: 1,
            name: "maçã",
            price: 5,
        };

        fruits.push(maça);
    });
    afterAll(clearData);

    it("should respond with status 200 and fruits data", async () => {

        const result = await api.get("/fruits/1");

        expect(result.status).toBe(200);

        expect(result.body).toStrictEqual(fruits[0]);
    });

    it("should respond with status 404 if id doesn't exists on the database", async () => {
        const result = await api.get("/fruits/10");
        expect(result.status).toBe(404);
    });
});

describe("POST: /fruits/", () => {
    beforeEach(clearData);
    afterAll(clearData);

    it("should respond with status 422 when body is not valid", async () => {
      const body = {
        test: 'testando tudo'
      };

      const result = await api.post("/fruits").send(body);

      expect(result.status).toBe(422);
    });

    it("should respond with status 201 and insert the new fruit in the database", async () => {

        const fruitsLengthBefore = fruitsRepository.getFruits().length;

        const fruitBody = {
            name: "jaca",
            price: 15,
        };

        const result = await api.post("/fruits").send(fruitBody);

        expect(result.status).toBe(201);

        const fruitsLengthAfter = fruitsRepository.getFruits().length;

        expect(fruitsLengthAfter).toBe(fruitsLengthBefore + 1);

        const newFruit = fruitsRepository.getFruits()[fruitsLengthAfter - 1];
        expect(newFruit).toMatchObject(fruitBody);
    });

    it("should respond with status 401 doesn't insert the new fruit in the database", async () => {
        const maça: Fruit = {
            id: 1,
            name: "maçã",
            price: 5,
        };

        fruits.push(maça);

        const fruitBody = {
            name: "maçã",
            price: 5,
        };

        const result = await api.post("/fruits").send(fruitBody);

        expect(result.status).toBe(409);
    });
});
