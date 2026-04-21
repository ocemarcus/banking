import { beforeEach, describe, expect, it, vi } from "vitest";
import { P2PTransactionsService } from "../p2p-transactions.service";

describe("P2PTransactionsService", () => {
	let accountRepository: any;
	let transactionsRepository: any;

	beforeEach(async () => {
		transactionsRepository = {
			saveP2P: vi.fn(),
			findOwnerOrSave: vi.fn(),
		};
		accountRepository = {
			findByAccountDetail: vi.fn(),
		};
	});

	const payload = {
		amount: 1000,
		accountDestinationId: "019c8a95-43e4-7797-88e6-67f00573ea54",
		accountId: "019c8a95-43e4-7797-88e6-67f00573ea54",
	};
	it("Validar conta não existente", async () => {
		const sut = new P2PTransactionsService(
			transactionsRepository,
			accountRepository,
		);

		await expect(sut.execute(payload, "userId")).rejects.toThrowError(
			"Conta não encontrada",
		);
	});

	it("Validar valor menor que 0", async () => {
		vi.spyOn(accountRepository, "findByAccountDetail").mockResolvedValue({
			id: "accountI",
		});

		const sut = new P2PTransactionsService(
			transactionsRepository,
			accountRepository,
		);
		payload.amount = -1
		await expect(sut.execute(payload, 'suerId')).rejects.toThrowError(
			'Valor deve ser maior que 0',
		);
	});
	it('Validar transação vom valor maior que saldo em conta',  async () => {

		vi.spyOn(accountRepository, "findByAccountDetail").mockResolvedValue({
			id: "accountI",
			balance: 1000,
		});
		
		const sut = new P2PTransactionsService(
			transactionsRepository,
			accountRepository,
		);
		payload.amount = 10000

		await expect(sut.execute(payload, 'suerId')).rejects.toThrowError(
			'Valor deve ser menor ou igual do saldo',
		);
	})
	it('Validar payload saveP2P',  async () => {

		vi.spyOn(accountRepository, "findByAccountDetail").mockResolvedValue({
			id: "accountId",
			balance: 10000,
			version: 1,
			user: {
				 fullName: 'fullName',
				 cellPhone: 'cellPhone',
				 document: 'document',
				 accountNumber: 'accountNumber'
			}

		});

		 const findOwnerOrSaveSpy = vi.spyOn(transactionsRepository, 'findOwnerOrSave')

		 findOwnerOrSaveSpy.mockImplementation(() => 'debitId')
		 findOwnerOrSaveSpy.mockImplementationOnce(() => 'creditId')

		const saveP2p = vi.spyOn(transactionsRepository, 'saveP2P')
		
		const sut = new P2PTransactionsService(
			transactionsRepository,
			accountRepository,
		);
	    await	sut.execute(payload, 'suerId')

		expect(saveP2p).toHaveBeenCalled()
		expect(saveP2p).toHaveBeenCalledWith(
			expect.objectContaining({
				account: expect.objectContaining({
					version: 1,
					accountId: 'accountId'
				}),
				transactions: [
					expect.objectContaining({
						statusTransaction: 'success',
						typeTransaction: 'transferInternalOut'
					}),
					expect.objectContaining({
						statusTransaction: 'success',
						typeTransaction: 'transferInternalIn'
					})
				]
			})
		)

	})

});
