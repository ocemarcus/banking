import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CreateTransactionsService } from "../create-transactions.service";

describe("CreateTransactionsService", () => {
	let accountRepository: any;
	let transactionsRepository: any;

	beforeEach(async () => {
		transactionsRepository = {
			findOwnerOrSave: vi.fn(),
			save: vi.fn(),
		};
		accountRepository = {
			findByAccountDetail: vi.fn(),
		};
	});
	afterEach(() => {
		 vi.clearAllMocks()
	})

	const payload = {
		  "amount": 1000,
  "accountNumber": "uuidAccount",
  "owner": {
    "fullName": "Jose Carlos",
    "document": "16245987067",
    "cellPhone": "3199999999",
    "bankName": "Itaú",
    "bankAccount": "1124432132"
  }
	};
	it("Validar conta não existente", async () => {

		vi.spyOn(accountRepository, "findByAccountDetail")
		const sut = new CreateTransactionsService(
			transactionsRepository,
			accountRepository,
		);

		await expect(sut.execute(payload)).rejects.toThrowError(
			"Conta não encontrada",
		);
	});

	it("Valor não pode ser menor que 0", async () => {
		vi.spyOn(accountRepository, "findByAccountDetail").mockResolvedValue({
			id: "accountI",
		});

		const sut = new CreateTransactionsService(
			transactionsRepository,
			accountRepository,
		);
		await expect(sut.execute({...payload, amount: -1})).rejects.toThrowError(
			'Valor deve ser maior que 0',
		);
	});
	
	it('Validar payload save',  async () => {

		vi.spyOn(accountRepository, "findByAccountDetail").mockResolvedValue({
			id: "accountId",
			balance: 10000,
			version: 1,
		});

		vi.spyOn(transactionsRepository, 'findOwnerOrSave')
		
		const saveSpy = vi.spyOn(transactionsRepository, 'save')
		
		const sut = new CreateTransactionsService(
			transactionsRepository,
			accountRepository,
		);
	    await	sut.execute(payload)

		expect(saveSpy).toHaveBeenCalled()
		expect(saveSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				account: expect.objectContaining({
					version: 1,
					accountId: 'accountId'
				}),
			})
		)

	})

});
